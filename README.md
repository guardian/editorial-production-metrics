# Editorial Production Metrics

A tool for recording and displaying metrics on how editorial content is produced.

## Running locally

You'll need:
 * [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed. Version `1.11.190` or later.
 * Credentials for the composer AWS account from [janus](https://janus.gutools.co.uk).
 * Set up SSL certificates by following the 'Install SSL certificates' step in the [dev-nginx readme](https://github.com/guardian/dev-nginx)
 * Set up config locally using [this guide](#local-config)
 * Setup the nginx mapping by following the instructions in the [dev-nginx readme](https://github.com/guardian/dev-nginx#install-config-for-an-application).
 * Install Client Side Dependencies with `./scripts/setup.sh`

Running the App:
 * Get some [local config](#local-config)
 * Set up the Postgres database: We use a RDS Posgres database running in the composer account in AWS. To connect to it locally run `./setup-ssh-tunnel.sh -t <Endpoint of of database without the port number>`. Which database you use must match the config you have. I.e. use the DEV database with the DEV config and CODE database with CODE config. Get the endpoint by looking in the Composer AWS account.
 * You need to use Node version 6. To manage different versions of node you can use [node version manager](https://github.com/creationix/nvm).
 * Run Client and Server: `./scripts/start.sh`
 * Run using sbt: `sbt "run 9051"`. (For quick restart you should run `sbt` and then `run 9051`, so that you can exit the application without exiting sbt.)

### Compiling Client Side Dependencies

This project requires Node version 6. To manage different versions of node you can use [node version manager](https://github.com/creationix/nvm).
You can compile client side dependencies with `yarn build` or `npm run build`.
Alternatively to compile client side assets on change run `yarn build-dev` or `npm run build-dev`

### Running the tests

The tests are running on Docker.

To install Docker on your machine go [here](https://docs.docker.com/docker-for-mac/install/#install-and-run-docker-for-mac) and follow the steps.
Make sure Docker is running on your machine and then:

- Run the unit tests: `sbt test`
- Run the integration tests: `sbt it:test`
- Run all the tests: `sbt testAll`

### Testing with the kinesis stream

The [kinesisLocal](/kinesisLocal) project posts to the kinesis DEV stream.

#### Running kinesisLocal

This is an sbt project
```
sbt
project kinesisLocal
run
```

## Config

This project uses [Configuration Magic](https://github.com/guardian/configuration-magic) and the configuration is stored in the composer AWS account in dynamoDB.

### Local Config

This project uses [Configuration Magic](https://github.com/guardian/configuration-magic/) so you need to fetch a config file to use locally. Do this with the `fetch-config.sh` script. By default this will get the DEV config but you can also pass it a `DEV` or `CODE` parameter.

`./fetch-config.sh CODE` or `./fetch-config.sh DEV`


 - If you get an error message saying that you requred AWS Signature Version 4, configure your aws cli by running `aws configure set default.s3.signature_version s3v4`. You must be running version `1.11.190` of the aws cli or later.

The DEV config is best to use when developing code that makes changes to the database or writes and reads from kinesis stream. The CODE config points to the CODE database and is populated with the same data as in the PROD database so is useful when data that reflects PROD is needed.

 - Fetch config from S3 with `./fetch-config.sh`. This gets the `DEV` config

### Adding Config Parameters

There are 2 places these need to be added.
1. The file in the `guconf-flexible` bucket. These are the DEV values for use locally
2. The `config-flexible` dynamo table. These are the PROD values

## Metrics architecture

A diagram of the metrics architecture and where metrics come from is in the [docs](/docs/architecture.md)

## Adding a new metric

Documentation on how to add a new metric is in the [docs](/docs) directory
