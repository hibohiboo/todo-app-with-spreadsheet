FROM node:14.16.0

# コンテナ上の作業ディレクトリ作成
WORKDIR /app

# 後で確認出来るようにpackage.jsonを作成
COPY .npmrc /app/.npmrc
RUN npm init -y
RUN npm i --no-optional -D elm
RUN npm i --no-optional -D elm-format
RUN npm i --no-optional -D elm-minify
# RUN npm i --no-optional -D elm-webpack-loader
# RUN npm i --no-optional -D elm-hot-webpack-loader
RUN npm i --no-optional -D elm-test
RUN npm i --no-optional -D elm-live
# elm-test --watchしたときのpolling設定
RUN sed -i -e "s/\(cwd: projectRootDir,\)/\1\n    usePolling: true, /g" /app/node_modules/elm-test/lib/elm-test.js
