#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IMAGE_NAME="boresha/agriculture-core"
DOCKER_HOME="/agriculture-core/"

if [ "$1" == "init" ]; then
    docker build -t $IMAGE_NAME $DIR
elif [ "$1" == "install" ]; then
    docker run --rm \
        --volume "$DIR":"$DOCKER_HOME" \
        "$IMAGE_NAME" yarn install --frozen-lockfile
elif [ "$1" == "initdb" ]; then
    docker run --name agricore-postgres \
        -e POSTGRES_DB=agricore-dev \
        -e POSTGRES_USER=boresha \
        -e POSTGRES_PASSWORD=devenv \
        -e PGDATA="$DIR/data" \
        --ip 172.17.0.99
        -d postgres
    docker kill agricore-postgres
elif [ "$1" == "start" ]; then
    docker start agricore-postgres
    docker run --rm \
        --volume "$DIR":"$DOCKER_HOME" \
        --link agricore-postgres:postgres \
        -p 9090:9090 \
        $IMAGE_NAME npm start
elif [ "$1" == "run" ]; then
    docker run --rm \
        --volume "$DIR":"$DOCKER_HOME" \
        "$IMAGE_NAME" npm run "${@:2}"
else
    echo "usage: $0 [ init | install | start | run [args] ]"
fi
