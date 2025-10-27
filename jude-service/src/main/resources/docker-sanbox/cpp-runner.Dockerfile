FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y time coreutils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd -m runner
USER runner

WORKDIR /app

ENTRYPOINT ["bash", "-c", "timeout ${TIME_LIMIT:-3}s /usr/bin/time -v /app/program < /app/input.txt > /app/output.txt 2> /app/runtime.log || (echo 'RUNTIME_ERROR' >> /app/output.txt && cat /app/runtime.log >> /app/output.txt)"]