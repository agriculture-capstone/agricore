#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IMAGE_NAME="boresha/agriculture-core"
DOCKER_HOME="/agiculture-core/"

if [ "$1" == "init" ]; then
	docker build -t $IMAGE_NAME $DIR
elif [ "$1" == "install" ]; then
    docker run --rm \
    	--volume "$DIR:$DOCKER_HOME" \
    	"$IMAGE_NAME" yarn install --frozen-lockfile
elif [ "$1" == "start" ]; then
    docker run --rm \
    	--volume "$DIR:$DOCKER_HOME" \
    	-p 9090:9090 \
    	$IMAGE_NAME npm start
elif [ "$1" == "run" ]; then
	docker run --rm \
		--volume "$DIR":"$DOCKER_HOME" \
		"$IMAGE_NAME" npm run "${@:2}"
else
	echo "usage: docker_build [init | build | run]"
fi
