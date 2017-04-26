#!/usr/bin/env bash

mkdir -p ~/.configuration-magic/
aws s3 cp s3://guconf-flexible/atom-workshop/atom-workshop.conf ~/.configuration-magic/atom-workshop.conf --profile composer
