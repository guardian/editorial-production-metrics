#!/usr/bin/env bash

mkdir -p ~/.configuration-magic/
aws s3 cp s3://guconf-flexible/editorial-production-metrics/editorial-production-metrics.conf ~/.configuration-magic/editorial-production-metrics.conf --profile composer
