#!/usr/bin/env bash

env=$( echo "${1:-DEV}" | tr '[:lower:]' '[:upper:]' )
if [[ "$env" != DEV && "$env" != CODE ]]; then
 env=DEV
fi

mkdir -p ~/.configuration-magic/
aws s3 cp s3://guconf-flexible/editorial-production-metrics/${env}/editorial-production-metrics.conf ~/.configuration-magic/editorial-production-metrics.conf --profile composer
