# Build a runtime for the application development
#
# This is not a regular image containing the application files. It is only a 
# runtime with node, npm and some other binary dependencies. The application
# files should be linked later, at the container execution time, with volume 
# attaching.
FROM node:21.4.0-alpine3.18 as base
RUN mkdir /app
WORKDIR /app
RUN --mount=type=cache,target=/root/.npm \
    npm install -g npm@10.2.5