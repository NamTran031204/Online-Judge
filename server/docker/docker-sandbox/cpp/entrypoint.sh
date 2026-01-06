#!/usr/bin/env bash
set -e
TIME_LIMIT=${1:-2}     # seconds
MEMORY_LIMIT=${2:-128} # MB
# chuan hoa ten file main.cpp
SOURCE_FILE="/sandbox/main.cpp"
INPUT_FILE="/sandbox/imageInput.txt"
OUTPUT_FILE="/sandbox/imageOutput.txt"
ERROR_FILE="/sandbox/imageError.txt"
EXPECTED_OUTPUT_FILE="/sandbox/imageExpectedOutput.txt"
COMPILED_FILE="/sandbox/main"
METRICS_FILE="/sandbox/metrics.txt"
# xoa noi dung cac file output error va metrics
> "$OUTPUT_FILE"
> "$ERROR_FILE"
> "$METRICS_FILE"
MAX_WAIT=5
WAIT_COUNT=0
# doi mount file
echo "Waiting for mount files" >> "$ERROR_FILE" 2>&1
while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if [ -f "$SOURCE_FILE" ] && [ -f "$INPUT_FILE" ] && [ -f "$EXPECTED_OUTPUT_FILE" ]; then
        echo "Mount complete: ${WAIT_COUNT}s" >> "$ERROR_FILE" 2>&1
        break
    fi
    sleep 1
    WAIT_COUNT=$((WAIT_COUNT + 1))
done
if [ ! -f "$SOURCE_FILE" ]; then
    echo "ERROR: Source file not found" >> "$ERROR_FILE" 2>&1
    exit 1
fi
if [ ! -f "$INPUT_FILE" ]; then
    echo "ERROR: Input file not found" >> "$ERROR_FILE" 2>&1
    exit 1
fi
# compilation
echo "Compiling C++ source: main.cpp" >> "$ERROR_FILE" 2>&1
COMPILE_START=$(date +%s%N)
if g++ -std=c++17 -O2 "$SOURCE_FILE" -o "$COMPILED_FILE" 2>> "$ERROR_FILE"; then
    COMPILE_END=$(date +%s%N)
    COMPILE_TIME=$(( (COMPILE_END - COMPILE_START) / 1000000 ))
    echo "SUCCESS: Compilation successful" >> "$ERROR_FILE" 2>&1
    echo "COMPILE_TIME_MS=$COMPILE_TIME" >> "$METRICS_FILE"
else
    echo "COMPILATION_ERROR" >> "$ERROR_FILE" 2>&1
    exit 96
fi
# thiet lap memory limit kb chuyen tu mb sang kb
MEMORY_LIMIT_KB=$((MEMORY_LIMIT * 1024))
ulimit -v $MEMORY_LIMIT_KB 2>> "$ERROR_FILE" || true
echo "Executing program with time limit: ${TIME_LIMIT}s, memory limit: ${MEMORY_LIMIT}MB" >> "$ERROR_FILE" 2>&1
EXEC_START=$(date +%s%N)
# lay memory usage truoc khi chay
MEM_BEFORE=$(cat /proc/meminfo | grep MemAvailable | awk '{print $2}')
if timeout -s SIGTERM "${TIME_LIMIT}s" "$COMPILED_FILE" < "$INPUT_FILE" > "$OUTPUT_FILE" 2>> "$ERROR_FILE"; then
    EXIT_CODE=$?
    EXEC_END=$(date +%s%N)
    EXEC_TIME=$(( (EXEC_END - EXEC_START) / 1000000 ))
    # lay memory usage sau khi chay
    MEM_AFTER=$(cat /proc/meminfo | grep MemAvailable | awk '{print $2}')
    MEM_USED=$(( (MEM_BEFORE - MEM_AFTER) ))
    if [ $MEM_USED -lt 0 ]; then MEM_USED=0; fi

    echo "EXEC_TIME_MS=$EXEC_TIME" >> "$METRICS_FILE"
    echo "MEMORY_USED_KB=$MEM_USED" >> "$METRICS_FILE"

    if [ $EXIT_CODE -eq 0 ]; then
        echo "SUCCESS: Execution completed in ${EXEC_TIME}ms" >> "$ERROR_FILE" 2>&1
    else
        echo "RUNTIME_ERROR: Exit code $EXIT_CODE" >> "$ERROR_FILE" 2>&1
        exit 1
    fi
else
    EXIT_CODE=$?
    EXEC_END=$(date +%s%N)
    EXEC_TIME=$(( (EXEC_END - EXEC_START) / 1000000 ))
    echo "EXEC_TIME_MS=$EXEC_TIME" >> "$METRICS_FILE"

    if [ $EXIT_CODE -eq 124 ]; then
        echo "TIME_LIMIT_EXCEEDED" >> "$ERROR_FILE" 2>&1
        exit 124
    elif [ $EXIT_CODE -eq 137 ] || [ $EXIT_CODE -eq 139 ]; then
        echo "MEMORY_LIMIT_EXCEEDED" >> "$ERROR_FILE" 2>&1
        exit 139
    else
        echo "RUNTIME_ERROR: Exit code $EXIT_CODE" >> "$ERROR_FILE" 2>&1
        exit 1
    fi
fi

# so sanh ket qua
echo "Comparing output with expected output..." >> "$ERROR_FILE" 2>&1
if [ -f "$EXPECTED_OUTPUT_FILE" ]; then
    ACTUAL_OUTPUT=$(cat "$OUTPUT_FILE" | sed 's/[[:space:]]*$//' | sed '/^$/d')
    EXPECTED_OUTPUT=$(cat "$EXPECTED_OUTPUT_FILE" | sed 's/[[:space:]]*$//' | sed '/^$/d')
    
    if [ "$ACTUAL_OUTPUT" = "$EXPECTED_OUTPUT" ]; then
        echo "ACCEPTED: Output matches expected output" >> "$ERROR_FILE" 2>&1
        exit 0
    else
        echo "WRONG_ANSWER: Output does not match expected output" >> "$ERROR_FILE" 2>&1
        exit 100
    fi
else
    echo "Expected output file not found, so RUNTIME_ERROR" >> "$ERROR_FILE"
    exit 1
fi
