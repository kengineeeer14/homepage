FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TERM=xterm-256color
ENV SHELL=/bin/bash

RUN apt-get update && apt-get install -y \
    curl \
    git \
    openssh-client \
    bash-completion \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22 のインストール
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g @anthropic-ai/claude-code \
    && rm -rf /var/lib/apt/lists/*

# ホストユーザーと UID を合わせた非 root ユーザーを作成
ARG USERNAME=developer
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

RUN git config --global --add safe.directory /app

WORKDIR /app
RUN chown $USERNAME:$USERNAME /app

USER $USERNAME

EXPOSE 4321

CMD ["bash"]
