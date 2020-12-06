#!/bin/bash

bin_dir=$(cd $(dirname $0) && pwd)
env_file=$bin_dir/.env
output_file="$bin_dir/../dist/google/serviceAccountKey.json"

# 環境変数ファイル読込
if [ -e $env_file ]; then
  eval "$(cat $env_file <(echo) <(declare -x))"
fi

cat << EOS > $output_file
{
  "type": "$SERVICE_ACCOUNT_TYPE",
  "project_id": "$SERVICE_ACCOUNT_PROJECT_ID",
  "private_key_id": "$SERVICE_ACCOUNT_PRIVATE_KEY_ID",
  "private_key": "$SERVICE_ACCOUNT_PRIVATE_KEY",
  "client_email": "$SERVICE_ACCOUNT_CLIENT_EMAIL",
  "client_id": "$SERVICE_ACCOUNT_CLIENT_ID",
  "auth_uri": "$SERVICE_ACCOUNT_AUTH_URI",
  "token_uri": "$SERVICE_ACCOUNT_TOKEN_URI",
  "auth_provider_x509_cert_url": "$SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL",
  "client_x509_cert_url": "$SERVICE_ACCOUNT_CLIENT_X509_CERT_URL"
}
EOS

