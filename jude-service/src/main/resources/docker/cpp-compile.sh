#!/bin/bash

SOLUTION="${SOLUTION:-solution.txt}"
INPUT="${INPUT:-input.txt}"
OUTPUT_FILE="output.txt"
COMPILE_ERROR_FILE="compile_error.txt"
TEMP_CPP_FILE="temp.cpp"
EXECUTABLE="program"

# Xóa nội dung cũ
echo "" > "$OUTPUT_FILE"
echo "" > "$COMPILE_ERROR_FILE"

# Kiểm tra file solution có tồn tại không
if [ ! -f "$SOLUTION" ]; then
    echo "ERROR: File $SOLUTION không tồn tại!" > "$OUTPUT_FILE"
    exit 1
fi

# Sao chép code vào file tạm
cat "$SOLUTION" > "$TEMP_CPP_FILE"

# Biên dịch
if g++ -o "$EXECUTABLE" "$TEMP_CPP_FILE" 2> "$COMPILE_ERROR_FILE"; then
    echo "SUCCESS" > "$OUTPUT_FILE"

    # Chạy chương trình với input từ input.txt
    if [ -f "$INPUT" ]; then
        cat "$INPUT" | /usr/bin/time -v ./"$EXECUTABLE" >> "$OUTPUT_FILE" 2>&1
        EXIT_CODE=$?

        if [ $EXIT_CODE -ne 0 ]; then
            echo "" >> "$OUTPUT_FILE"
            echo "RUNTIME ERROR (Exit code: $EXIT_CODE)" >> "$OUTPUT_FILE"
        fi
    else
        # Không có file input, chạy không có input
        /usr/bin/time -v ./"$EXECUTABLE" >> "$OUTPUT_FILE" 2>&1
    fi

else
    # Lỗi biên dịch
    echo "COMPILE ERROR" > "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "$COMPILE_ERROR_FILE" >> "$OUTPUT_FILE"
fi

# Dọn dẹp
rm -f "$TEMP_CPP_FILE" "$EXECUTABLE" "$COMPILE_ERROR_FILE"