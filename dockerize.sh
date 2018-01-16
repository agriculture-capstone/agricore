#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IMAGE_NAME="boresha/agricore"
DOCKER_HOME="/agricore/"

if [ "$1" == "init" ]; then
    docker build -t $IMAGE_NAME $DIR
elif [ "$1" == "install" ]; then
    docker run --rm \
        --volume "$DIR":"$DOCKER_HOME" \
        "$IMAGE_NAME" yarn install --frozen-lockfile
elif [ "$1" == "initdb" ]; then
    docker run --name agricore_db \
        -e POSTGRES_DB=agricore_dev \
        -e POSTGRES_USER=boresha \
        -e POSTGRES_PASSWORD=devenv \
        -e PGDATA="$DIR/data" \
        -d postgres:10.1
    docker kill agricore_db
elif [ "$1" == "start" ]; then
    docker start agricore_db
    docker run --rm \
        --name agricore \
        --volume "$DIR":"$DOCKER_HOME" \
        --link agricore_db:postgres \
        -p 9090:9090 \
        $IMAGE_NAME npm start
elif [ "$1" == "stop" ]; then
    docker kill agricore
    docker kill agricore_db
elif [ "$1" == "run" ]; then
    docker run --rm \
        --volume "$DIR":"$DOCKER_HOME" \
        "$IMAGE_NAME" npm run "${@:2}"
else
    echo "usage: $0 [ init | install | initdb | start | stop | run [args] ]"
fi
