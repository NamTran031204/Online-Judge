FROM gcc:latest

RUN apt-get update && apt-get install -y coreutils && rm -rf /var/lib/apt/lists/*

WORKDIR /sandbox

COPY entrypoint.sh /sandbox/entrypoint.sh
RUN chmod +x /sandbox/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/sandbox/entrypoint.sh"]
