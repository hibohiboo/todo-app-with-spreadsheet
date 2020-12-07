# docker-hubからnode入りコンテナを取得
# https://hub.docker.com/_/node/
FROM node:12.20.0

# コンテナ上の作業ディレクトリ作成
WORKDIR /app
RUN npm i -g azure-functions-core-tools@3 --unsafe-perm true
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci

