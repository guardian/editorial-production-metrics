# Editorial Production Metrics

A tool for recording and displaying metrics on how editorial content is produced.

## Running locally

You'll need the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed, and credentials
for the composer AWS account from [janus](https://janus.gutools.co.uk). You'll also need to follow the
'Install SSL certificates' step in the [dev-nginx readme](https://github.com/guardian/dev-nginx). Then:

 - Fetch config from S3: `./fetch-config.sh`
 - Setup the nginx mapping by following the instructions in the
 [dev-nginx readme](https://github.com/guardian/dev-nginx#install-config-for-an-application).
 - Install Client Side Dependencies with `./scripts/setup.sh`
 - Set up the Postgres database: We use a RDS Posgres database running in the composer account in AWS. To connect to it locally run `./setup-ssh-tunnel.sh -t <Endpoint of of database without the port number>` 
 Get the endpoint by looking in the Composer AWS account.
 - Run Client and Server: `./scripts/start.sh`
 - Run using sbt: `sbt "run 9051"`. (For quick restart you should run `sbt` and then `run 9051`, so that you can exit
  the application without exiting sbt.)

### Compiling Client Side Dependencies

This project requires Node version 6. To manage different versions of node you can use [node version manager](https://github.com/creationix/nvm).
You can compile client side dependencies with `yarn build` or `npm run build`.
Alternatively to compile client side assets on change run `yarn build-dev` or `npm run build-dev`

## Client Side

### Graph Styling

The styling for the graphs can be found in [theme.js](https://github.com/guardian/editorial-production-metrics/tree/master/public/js/components/ChartTheme/theme.js)

## Config

This project uses [Configuration Magic](https://github.com/guardian/configuration-magic) and the configuration is stored in the composer aws account in dynamoDB.

### Adding Config Parameters

There are 2 places these need to be added.
1. The file in the `guconf-flexible` bucket. These are the DEV values for use locally
2. The `config-flexible` dynamo table. These are the PROD values

## Project Structure

Metrics are collected via the kinesis stream. This stream is populated by the [production-metrics-lambdas](https://github.com/guardian/production-metrics-lambdas). Shared data models are in the [editorial-production-metrics-lib](https://github.com/guardian/editorial-production-metrics-lib)

### Testing the kinesis stream

The [kinesisLocal](/kinesisLocal) project posts to the kinesis DEV stream.

#### Running kinesisLocal

This is an sbt project
```
sbt
project kinesisLocal
run
```
