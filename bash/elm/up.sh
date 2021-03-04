#!/bin/bash

# このシェルスクリプトのディレクトリの絶対パスを取得。
bin_dir=$(cd $(dirname $0) && pwd)
root_dir=$(cd $bin_dir/../.. && pwd)
elm_dir=$(cd $root_dir/docker && pwd)
composeFile=${1:-"docker-compose.yml"}

cd $elm_dir && docker-compose -f $composeFile up


