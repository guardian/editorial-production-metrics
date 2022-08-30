### Updating Config

If you need to change or add a new config parameter, this needs to be done in two places:
1. The file in the `guconf-flexible` bucket. These are the DEV values for use locally
    * `aws s3 cp ~/<path-to-relevant-file>/editorial-production-metrics.conf s3://<S3-path-to-relevant-file>/editorial-production-metrics.conf --profile composer --region eu-west-1 --sse aws:kms`
   Note the --sse aws:kms flag when uploading. Without this, you will see an 'AccessDenied' error, as the configuration files are encrypted via KMS.
2.The `config-flexible` dynamo table. These are the PROD values
