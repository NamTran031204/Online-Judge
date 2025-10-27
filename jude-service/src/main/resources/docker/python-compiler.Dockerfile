FROM python:3.11-slim

RUN apt-get update && apt-get install -y time && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY compile-python.sh /compile.sh
RUN chmod +x /cpp-compile.sh

ENTRYPOINT ["/compile.sh"]