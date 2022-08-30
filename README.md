# Editorial Production Metrics

A tool for recording and displaying metrics on how editorial content is produced.


## Running locally

1. If running this project for the first time, follow the setup instructions in the [docs](./docs/setup.md). 
2. Fetch `Composer` AWS credentials from Janus (assuming you have `editorialToolsDeveloper` permissions, or similar)
3. Run `./scripts/start.sh` from the project root. This will spin up a docker container running postgres and run sbt.

The app should now be running [here](https://productionmetrics.local.dev-gutools.co.uk/).

If you want to put some data in your local docker db you can run the [metrics lambda](https://github.com/guardian/production-metrics-lambdas) locally.


 ### Connecting to the CODE database:

 * The database you use must match the config you have: use the DEV docker database with the DEV config and CODE database with CODE config.
 * Set up the Postgres database: We use an RDS Postgres database running in the composer account in AWS.
 * To connect to it locally run `./scripts/setup-ssh-tunnel.sh -t <Endpoint of of database without the port number>`. For this to work you need to have Janus credentials for the Composer AWS account.
 * Get the endpoint by looking in the Composer AWS account.
 * If you want to connect to a different database, you must kill the process running on port 5902 first.
 

### Running tests

- Run the unit tests: `sbt test`
- Run the integration tests: `sbt it:test`
- Run all the tests: `sbt testAll`


#### Running Kinesis locally

The [kinesisLocal](/kinesisLocal) project posts to the kinesis DEV stream.

This is an sbt project
```
sbt
project kinesisLocal
run
```


## Metrics architecture

A diagram of the metrics architecture and where metrics come from is in the [docs](/docs/architecture.md)


## Adding a new metric

Documentation on how to add a new metric is in the [docs](/docs/addingMetrics.md)


## Glossary

A glossary of domain specific terms is available [here](/docs/glossary.md)
