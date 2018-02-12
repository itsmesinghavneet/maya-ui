FROM node:6.12.3
# This is used to build the UI-project inside the container and output the dist build in the `dist/` directory
# The generated `dist/` can be put inside an nginx container, and with an environment variable given at run-time
# will point to the running instance of maya-io-server.
RUN yarn global add bower && npm install -g ember-cli@2.15.1
WORKDIR /mnt
ENTRYPOINT yarn install && bower install --allow-root && ember build --environment=production
