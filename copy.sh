#!/bin/bash

set -eou pipefail

BRANCH=$1
VERSION=$(git rev-parse --short HEAD)

echo $BRANCH
echo $VERSION

cp -f UI-${VERSION}.tar.gz /tmp/mayadataio/maya-ui/${BRANCH}

