FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git openssh-client zlib~=1.3.2

# Enable corepack for pnpm (optional but recommended)
RUN corepack enable

RUN git config --global --add safe.directory /app

EXPOSE 4321

CMD ["sh"]
