FROM gcc:latest

# Install timeout utility and other useful debugging tools
RUN apt-get update && apt-get install -y \
    coreutils \
    vim \
    nano \
    tree \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /sandbox