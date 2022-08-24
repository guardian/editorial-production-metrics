# Setup
When running this project for the first time, you should complete the following steps:

1. Ensure you have the following installed:
   * [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html), version `1.11.190` or later.
   * [ssm-scala](https://github.com/guardian/ssm-scala). Run `brew install guardian/devtools/ssm` to install with Homebrew.
   * [Docker](https://docs.docker.com/docker-for-mac/install/#install-and-run-docker-for-mac). Required for running tests and running a local database.
2. Set up Nginx:
    * To set up Nginx mapping, run `dev-nginx setup-app ./nginx/nginx-mapping.yml` from the project root
    * To set up SSL certificate, run `dev-nginx setup-cert productionmetrics.local.dev-gutools.co.uk`
3. Fetch config:
    * This project uses [Configuration Magic](https://github.com/guardian/configuration-magic/) and the configuration is stored in AWS DynamoDB. 
    * Run `./scripts/fetch-config.sh DEV` or `./scripts/fetch-config.sh CODE` (the script will default to DEV if no stage is specified). 
   The DEV config is best to use when developing code that makes changes to the database or writes and reads from Kinesis stream. The CODE config points to the CODE database and is populated with the same data as in the PROD database so is useful when data that reflects PROD is needed.
