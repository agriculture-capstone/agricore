#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IMAGE_NAME="boresha/agricore"
DOCKER_HOME="/agricore/"

DB_IMAGE_NAME="postgres:10.1"
DB_CONTAINER_NAME="agricore_db"
DB_NAME="agricore_dev"
DB_USER="boresha"
DB_PASSWORD="devenv"

if [ "$1" == "init" ]; then
    docker build -t $IMAGE_NAME $DIR
elif [ "$1" == "install" ]; then
    docker run --rm \
        --volume "$DIR":"$DOCKER_HOME" \
        "$IMAGE_NAME" yarn install --frozen-lockfile
elif [ "$1" == "start" ]; then
    docker run --rm \
        --name agricore \
        --volume "$DIR":"$DOCKER_HOME" \
        --link "$DB_CONTAINER_NAME":postgres \
        -p 9090:9090 \
        $IMAGE_NAME npm start
elif [ "$1" == "stop" ]; then
    docker kill agricore
    docker kill "$DB_CONTAINER_NAME"
elif [ "$1" == "run" ]; then
    docker run --rm \
        --volume "$DIR":"$DOCKER_HOME" \
        "$IMAGE_NAME" npm run "${@:2}"
elif [ "$1" == "initdb" ]; then
    docker rm -f "$DB_CONTAINER_NAME"
    docker run --name "$DB_CONTAINER_NAME" \
        -e POSTGRES_DB="$DB_NAME" \
        -e POSTGRES_USER="$DB_USER" \
        -e POSTGRES_PASSWORD="$DB_PASSWORD" \
        -e PGDATA="$DIR/data" \
        -d "$DB_IMAGE_NAME"
    docker cp db-init.sql agricore_db:/
    sleep 5
    docker exec -it "$DB_CONTAINER_NAME" /bin/bash -c "psql -d $DB_NAME -U $DB_USER -c 'CREATE EXTENSION \"uuid-ossp\"'"
    docker exec -it "$DB_CONTAINER_NAME" /bin/bash -c "psql -d $DB_NAME -U $DB_USER -c '\i db-init.sql'"
    echo "Database container started"
elif [ "$1" == "startdb" ]; then
    docker start "$DB_CONTAINER_NAME"
elif [ "$1" == "stopdb" ]; then
    docker kill "$DB_CONTAINER_NAME"
elif [ "$1" == "shelldb" ]; then
    docker exec -it "$DB_CONTAINER_NAME" psql -d "$DB_NAME" -U "$DB_USER"
else
    echo "usage: $0 [ init | install | initdb | startdb | shelldb | stopdb | start | stop | run [args] ]"
fi
