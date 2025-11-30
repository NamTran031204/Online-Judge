#!/usr/bin/env bash
set -e

TIME_LIMIT=${1:-2}     # seconds
MEMORY_LIMIT=${2:-128} # MB

SOURCE_FILE="/sandbox/imageSolution.cpp"
INPUT_FILE="/sandbox/imageInput.txt"
OUTPUT_FILE="/sandbox/imageOutput.txt"
ERROR_FILE="/sandbox/imageError.txt"
EXPECTED_OUTPUT_FILE="/sandbox/imageExpectedOutput.txt"
COMPILED_FILE="/sandbox/solution"

# Clear output va error file
> "$OUTPUT_FILE"
> "$ERROR_FILE"

MAX_WAIT=5
WAIT_COUNT=0

# rất quan trọng => đợi mount file
echo "Waiting for mount files" >> "$ERROR_FILE" 2>/dev/null || true

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if [ -f "$SOURCE_FILE" ] && [ -f "$INPUT_FILE" ] && [ -f "$EXPECTED_OUTPUT_FILE" ]; then
        echo "Mount complete: ${WAIT_COUNT}s" >> "$ERROR_FILE" 2>/dev/null || true
        break
    fi
    sleep 1
    WAIT_COUNT=$((WAIT_COUNT + 1))
done

if [ ! -f "$SOURCE_FILE" ]; then
    echo "ERROR: Source file not found" > "$ERROR_FILE"
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "ERROR: Input file not found" > "$ERROR_FILE"
    exit 1
fi

echo "Compiling C++ :" >> "$ERROR_FILE"
if g++ -std=c++17 -O2 "$SOURCE_FILE" -o "$COMPILED_FILE" 2>> "$ERROR_FILE"; then
    echo "SUCCESS: Compilation successful" >> "$ERROR_FILE"
else
    echo "COMPILATION_ERROR" > "$ERROR_FILE"
    exit 96
fi

# Set memory limit (in KB, convert MB to KB)
MEMORY_LIMIT_KB=$((MEMORY_LIMIT * 1024))
ulimit -v $MEMORY_LIMIT_KB

echo "Executing program :" >> "$ERROR_FILE"
if timeout -s SIGTERM "${TIME_LIMIT}s" "$COMPILED_FILE" < "$INPUT_FILE" > "$OUTPUT_FILE" 2>> "$ERROR_FILE"; then
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 0 ]; then
        echo "SUCCESS" > "$ERROR_FILE"
    else
        echo "RUNTIME_ERROR: Exit code $EXIT_CODE" > "$ERROR_FILE"
        exit 1
    fi
else
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 124 ]; then
        echo "TIME_LIMIT_EXCEEDED" > "$ERROR_FILE"
        exit 124
    elif [ $EXIT_CODE -eq 137 ] || [ $EXIT_CODE -eq 139 ]; then
        echo "MEMORY_LIMIT_EXCEEDED" > "$ERROR_FILE"
        exit 139
    else
        echo "RUNTIME_ERROR: Exit code $EXIT_CODE" > "$ERROR_FILE"
        exit 1
    fi
fi

exit 0
