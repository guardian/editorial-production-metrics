#!/usr/bin/env bash

echo "##teamcity[compilationStarted compiler='yarn']"
npm install --global yarn
yarn install
yarn build
echo "##teamcity[compilationFinished compiler='yarn']"

echo "##teamcity[compilationStarted compiler='sbt']"
sbt clean compile testAll riffRaffUpload
echo "##teamcity[compilationFinished compiler='sbt']"
