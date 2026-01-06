FROM eclipse-temurin:17-jdk-alpine

RUN apk add --no-cache coreutils bash

WORKDIR /sandbox

COPY entrypoint.sh /sandbox/entrypoint.sh
RUN chmod +x /sandbox/entrypoint.sh

ENTRYPOINT ["/sandbox/entrypoint.sh"]
