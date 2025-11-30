FROM python:3.11-slim

# Install timeout utility
RUN apt-get update && apt-get install -y coreutils && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /sandbox

# Copy entrypoint script
COPY entrypoint.sh /sandbox/entrypoint.sh
RUN chmod +x /sandbox/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/sandbox/entrypoint.sh"]
