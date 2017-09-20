# Editorial Production Metrics

A tool for recording and displaying metrics on how editorial content is produced.

## Running locally

You'll need the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed, and credentials
for the composer AWS account from [janus](https://janus.gutools.co.uk). You'll also need to follow the
'Install SSL certificates' step in the [dev-nginx readme](https://github.com/guardian/dev-nginx). Then:

### Local Config

This project uses [Configuration Magic](https://github.com/guardian/configuration-magic/) so you need to fetch a config file to use locally. Do this with the `fetch-config.sh` script. By default this will get the DEV config but you can also pass it a `DEV` or `CODE` parameter.

`./fetch-config.sh CODE` or `./fetch-config.sh DEV`
 
The DEV config is best to use when developing code that makes changes to the database or writes and reads from kinesis stream. The CODE config points to the CODE database and is populated with the same data as in the PROD database so is useful when data that reflects PROD is needed.

 - Fetch config from S3 with `./fetch-config.sh`. This gets the `DEV` config
 - Setup the nginx mapping by following the instructions in the
 [dev-nginx readme](https://github.com/guardian/dev-nginx#install-config-for-an-application).
 - Install Client Side Dependencies with `./scripts/setup.sh`
 - Set up the Postgres database: We use a RDS Posgres database running in the composer account in AWS. To connect to it locally run `./setup-ssh-tunnel.sh -t <Endpoint of of database without the port number>`. Which database you use mush match the config you have. I.e. use the DEV database with the DEV config and CODE database with CODE config. Get the endpoint by looking in the Composer AWS account.
 - Run Client and Server: `./scripts/start.sh`
 - Run using sbt: `sbt "run 9051"`. (For quick restart you should run `sbt` and then `run 9051`, so that you can exit
  the application without exiting sbt.)

### Compiling Client Side Dependencies

This project requires Node version 6. To manage different versions of node you can use [node version manager](https://github.com/creationix/nvm).
You can compile client side dependencies with `yarn build` or `npm run build`.
Alternatively to compile client side assets on change run `yarn build-dev` or `npm run build-dev`

## Client Side

### Adding a new Metric

The frontend is built in React. The app's state is managed with [jumpstate](https://github.com/jumpsuit/jumpstate), a state-management library which follows the same principles as Redux (a single store holds the whole state of the app and is modified by triggering actions) but provides a more readable and maintanable syntax, and more intuitive ways to alter the store. The library currently used for rendering the charts is [formidable-charts](https://github.com/FormidableLabs/formidable-charts), a collection of react components. Further documentation for the charts can be found [here](https://formidable.com/open-source/victory/docs/victory-chart/).

#### Fetching the data

All api calls are done with [axios](https://github.com/mzabriskie/axios). To fetch data for your new metric, you first need to define a new function in `public/js/services/Api.js` calling the desired endpoint on the scala client.

#### Merging the data into the store

In `public/js/redux/chartsRedux.js`:

All api calls for the different charts are triggered by the `filterDesk` Effect in `public/js/redux/chartsRedux.js`, which manages async operations (in the same way as a redux middleware for async calls). Currently, every endpoint for every metrics is called every time the url's query params have been changed by the filters.

You should add the name of your new metric to the list in `public/js/utils/chartsList`: if you are consistent with the naming of the metric across the app, you should be able to easily add the new api call to the ones already being executed by the effect. The `filterDesk` effect triggers the merge actions for every chart if fetching is successful, and adds errors to the store if fetching fails. In jumpstate, the name of the functions in the reducers coincide with their type.

You need to add your new metric to the reducers's initial state, following this structure:

```
nameOfYourMetric: {
    data: {
       ...yourMetricsData
    },
    ...yourOtherParams
}
```
        
You need to define your state update and fail functions, using the following naming conventions: `updateNameOfYourMetric`, `getNameOfYourMetricFailed`, using the name you defined in `public/js/utils/chartsList`. These functions give you have access to the state of the reducer and the payload of the action. All data manipulations needed to shape the data in the format requested by the charting component should be done at this level, before returning the new state. Remember to follow Redux's best practice of returning a new state object rather than altering the existing one.

#### Rendering the chart

All chart components are stored in `public/js/componets/Charts`. Just add a new wrapper for the new chart and import the chart-component that you need from `formidable-charts`, then pass it the required props. `ChartsRedux`, the charts reducer, is already connected to the app via the `mapStateToProps` function in `App.js`, so you only need to add your chart wrapper to the `Charts` component, and you will have access to the metrics data from the reducer in the component's props.

#### Adding a new filter

There is a unique reducer for all filters, in `updateFilterRedux.js`: just update the inital state, then in `Filters.js` add your filter and update the object by launching the `filterDesk()` action with the updated `filterVals` when your filter changes. Example: 
```
<select onChange={event => Actions.filterDesk({ ...filterVals, theFilterBeingUpdated: event.target.value })}> ... </select>
```
You can add the new query param in `Api.js` by simply adding a key to a `params` object passed as a parameter to the `httpClient.get()` function that makes your request.

`filterDesk` will update the filter object with the new value and proceed to call the api again with the updated values.

#### Routing

The App's state and url query params are kept in sync via a custom routing middleware (`public/js/services/routingMiddleware.js`).

#### Dates

[moment](https://momentjs.com) is used to manage all dates on the client. To ensure consistency across backend and frontend and across the app, all dates are being transformed to UTC format (moment(yourdate).utc()`. To maximize the amount of data requested for a specific range of time, start date (the day which is further in the past) should be at the beginning of the day `moment().utc().startOf('day') while end date should be at the end of day `moment().utc().endOf('day')`.

### Graph Styling

The styling for the graphs can be found in [theme.js](https://github.com/guardian/editorial-production-metrics/tree/master/public/js/components/ChartTheme/theme.js)

## Config

This project uses [Configuration Magic](https://github.com/guardian/configuration-magic) and the configuration is stored in the composer AWS account in dynamoDB.

### Adding Config Parameters

There are 2 places these need to be added.
1. The file in the `guconf-flexible` bucket. These are the DEV values for use locally
2. The `config-flexible` dynamo table. These are the PROD values

## Project Structure

Metrics are collected via the kinesis stream. This stream is populated by the [production-metrics-lambdas](https://github.com/guardian/production-metrics-lambdas). Shared data models are in the [editorial-production-metrics-lib](https://github.com/guardian/editorial-production-metrics-lib)

### Posting metrics from other apps

To post data from other apps to metrics, you need to follow these steps:
1. Import the [Editorial Production Metrics Library](https://github.com/guardian/editorial-production-metrics-lib). This will give you access to the `MetricOpt` case class.
```scala
"com.gu" %% "editorial-production-metrics-lib" % "x.x"
```
2. Send a post request to the metric's `/api/metric/save` endpoint. For example (for an app that is using Circe server side):
```scala
val metricOpt = MetricOpt(
    composerId = Some("some-id"),
    originatingSystem = Some(OriginatingSystem.Composer),
    commissioningDesk = Some("commissioning-desk"),
    creationTime = Some("2017-08-29T10:50:39.568Z"),
    inWorkflow = Some(true))
    
parse(metricOpt).fold(
  err => Left(err), 
  metric => WS.url(s"$metricsApiRoot/metric/save").withHeaders("content-type" -> "application/json").post(metric)
)
```
For apps that are not using Circe you can use the `toJsonString` method provided in the metrics lib to convert your `MetricOpt` object to a `String`. Then use your preferred Json parser. 
Here's an example for play json:
```scala
val json = Json.parse(toJsonString(metricOpt))
WS.url(s"$metricsApiRoot/metric/save").withHeaders("content-type" -> "application/json").post(json)
```

NOTE: Metrics is using CORS in the client side and HMAC in the server side. So for server side calls, in addition to the example, you'll have to set the right headers. For this you can use the [hmac-headers](https://github.com/guardian/hmac-headers) library.

### Testing the kinesis stream

The [kinesisLocal](/kinesisLocal) project posts to the kinesis DEV stream.

#### Running kinesisLocal

This is an sbt project
```
sbt
project kinesisLocal
run
```
