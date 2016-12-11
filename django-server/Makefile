DOCKER_REPO_NAME=martinogden/<PROJECT_NAME>

all: build

build:
	docker build -t $(DOCKER_REPO_NAME) .

test:
	./bin/test

push:
	docker push $(DOCKER_REPO_NAME)
