#!/usr/bin/env bash
yarn build-dev &
sbt "run 9051"