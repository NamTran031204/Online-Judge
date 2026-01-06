#!/usr/bin/env bash
set -e
TIME_LIMIT=${1:-2}     # giay
MEMORY_LIMIT=${2:-128} # mb
# chuan hoa ten file main.java class phai la main
SOURCE_FILE="/sandbox/Main.java"
INPUT_FILE="/sandbox/imageInput.txt"
OUTPUT_FILE="/sandbox/imageOutput.txt"
ERROR_FILE="/sandbox/imageError.txt"
EXPECTED_OUTPUT_FILE="/sandbox/imageExpectedOutput.txt"
SANDBOX_DIR="/sandbox"
METRICS_FILE="/sandbox/metrics.txt"
# class name co dinh la main
CLASS_NAME="Main"
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
    echo "ERROR: Source file not found: $SOURCE_FILE" >> "$ERROR_FILE" 2>&1
    exit 1
fi
if [ ! -f "$INPUT_FILE" ]; then
    echo "ERROR: Input file not found" >> "$ERROR_FILE" 2>&1
    exit 1
fi
# chuyen den thu muc sandbox
cd "$SANDBOX_DIR"
# compilation
echo "Compiling Java source: Main.java" >> "$ERROR_FILE" 2>&1
COMPILE_START=$(date +%s%N)
if javac -d "$SANDBOX_DIR" "$SOURCE_FILE" 2>> "$ERROR_FILE"; then
    COMPILE_END=$(date +%s%N)
    COMPILE_TIME=$(( (COMPILE_END - COMPILE_START) / 1000000 ))
    echo "SUCCESS: Compilation successful" >> "$ERROR_FILE" 2>&1
    echo "COMPILE_TIME_MS=$COMPILE_TIME" >> "$METRICS_FILE"
else
    echo "COMPILATION_ERROR" >> "$ERROR_FILE" 2>&1
    exit 96
fi
# kiem tra file class da duoc tao
if [ ! -f "$SANDBOX_DIR/$CLASS_NAME.class" ]; then
    echo "ERROR: Class file not found after compilation: $CLASS_NAME.class" >> "$ERROR_FILE" 2>&1
    echo "Available .class files:" >> "$ERROR_FILE" 2>&1
    ls -la "$SANDBOX_DIR"/*.class 2>> "$ERROR_FILE" || echo "No .class files found" >> "$ERROR_FILE" 2>&1
    echo "COMPILATION_ERROR" >> "$ERROR_FILE" 2>&1
    exit 96
fi
# ==================== execution ====================
# thiet lap memory limit cho jvm
MEMORY_LIMIT_JVM="${MEMORY_LIMIT}m"
echo "Executing program with time limit: ${TIME_LIMIT}s, memory limit: ${MEMORY_LIMIT_JVM}" >> "$ERROR_FILE" 2>&1
EXEC_START=$(date +%s%N)
# lay memory usage truoc khi chay
MEM_BEFORE=$(cat /proc/meminfo | grep MemAvailable | awk '{print $2}')
if timeout -s SIGTERM "${TIME_LIMIT}s" java -Xmx${MEMORY_LIMIT_JVM} -Xms16m -cp "$SANDBOX_DIR" "$CLASS_NAME" < "$INPUT_FILE" > "$OUTPUT_FILE" 2>> "$ERROR_FILE"; then
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
    echo "Expected output file not found, so RUNTIME_ERROR" >> "$ERROR_FILE" 2>&1
    exit 1
fi