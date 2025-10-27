FROM openjdk:21-jdk-slim

RUN apt-get update && apt-get install -y time && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY compile-java.sh /compile.sh
RUN chmod +x /cpp-compile.sh

ENTRYPOINT ["/compile.sh"]