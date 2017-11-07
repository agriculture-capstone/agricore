#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IMAGE_NAME="boresha/agriculture-core"
DOCKER_HOME="/agiculture-core/"
ARG_NUM=2

if [ "$1" == "init" ]; then
	docker build -t $IMAGE_NAME $DIR
elif [ "$1" == "build" ]; then
	docker run --rm -v $(pwd):/agriculture-core/ $IMAGE_NAME npm build
elif [ "$1" == "run" ]; then
    docker run --rm --volume "$(pwd):/agriculture-core/" -ti agriculture-core ./start.sh
else
	echo "usage: docker_build [init | build | run]"
fi