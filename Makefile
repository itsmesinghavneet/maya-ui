BUILD_TAG:=$(shell git rev-parse --short HEAD)
CHECK_IMAGE:=$(shell docker images -q mayadata-io/build-ui:0.1)
# ^ This returns the image-id if it exists, but oddly returns 0 in every case(success/failure)

clean:
# Removes previous build remains.
	@echo "Deleting tmp/ dist/ directory"
	sudo rm -rf dist/ tmp/

dist: clean
# Builds the ui in a cached build environment.
# Build stage#1
ifeq ($(CHECK_IMAGE),)
	@cd scripts/ && docker build -t mayadata-io/build-ui:0.1 . && cd ..
else
	@echo "mayadata-io/build-ui:0.1 exists"
endif

	@echo "Building the ui in a docker volume"
	docker run --rm -v `pwd`:/mnt mayadata-io/build-ui:0.1
  sudo chown -R jenkins:jenkins .

#Dead code to be removed!
#build: dist
# Builds the dist image(the **built** UI into an nginx container and keeps it in the local machine.
# Build stage#2
#	@echo "Putting the distributable ui in an nginx container"
#	@echo "Builds will be tagged with the commit hash"
#	docker build -t mayadata-io/dist-ui:$(BUILD_TAG) .

push: build
# Push to an image registry
	@echo "push the container"
	docker push mayadata-io/dist-ui:$(BUILD_TAG)

.DEFAULT_GOAL=build
.PHONY=clean push build
