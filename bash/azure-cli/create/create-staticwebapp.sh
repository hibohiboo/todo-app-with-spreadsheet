#!/bin/bash
bin_dir=$(cd $(dirname $0) && pwd)

# 環境変数ファイル読込
eval "$(cat $bin_dir/.env <(echo) <(declare -x))"

# 500 Bad Requestでエラーとなる
az staticwebapp create \
    -n $YOUR_GITHUB_REPOSITORY_NAME \
    -g $RESOURCE_GROUP_NAME \
    -s https://github.com/$YOUR_GITHUB_ACCOUNT_NAME/$YOUR_GITHUB_REPOSITORY_NAME \
    -l $LOCATION \
    -b $YOUR_GITHUB_BRANCH \
    --app-artifact-location $ARTIFACT_LOCATION \
    --token $YOUR_GITHUB_PERSONAL_ACCESS_TOKEN