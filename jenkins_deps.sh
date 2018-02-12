#!/bin/bash
set -ex
## What this does for Jenkins?
# It gets the distributable ui built in a container, so we don't need to install JS* things into our Jenkins VM.

make dist  # and not make build, which would put it in an nginx container
source ./scripts/version # Get the version tagging info.
BRANCH=$(git rev-parse --abbrev-ref HEAD)
# HACK_FIX: Hope it works
mkdir -p dist
sudo chown -R $USER:$USER dist/
tar zcf "UI-${VERSION}.tar.gz" dist/
# Metadata for the jenkins_deps.sh in maya-ui
