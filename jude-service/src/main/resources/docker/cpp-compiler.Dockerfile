FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y g++ build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd -m compiler
USER compiler

WORKDIR /app

ENTRYPOINT ["bash", "-c", "g++ /app/source/solution.cpp -o /app/output/program -O2 -std=c++17 2> /app/output/compile_error.log && echo 'SUCCESS' > /app/output/compile_status.txt || echo 'COMPILE_ERROR' > /app/output/compile_status.txt"]