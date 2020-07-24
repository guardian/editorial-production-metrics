#!/usr/bin/env bash

echo "##teamcity[npm 'install yarn']"
npm install --global yarn
echo "##teamcity[yarn 'install']"
yarn install
echo "##teamcity[yarn 'build']"
yarn build

echo "##teamcity[compilationStarted compiler='sbt']"
sbt clean compile testAll riffRaffUpload
echo "##teamcity[compilationFinished compiler='sbt']"
