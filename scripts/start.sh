#!/usr/bin/env bash
yarn build-dev &
docker-compose up -d &
sbt "run 9051"