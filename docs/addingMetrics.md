# Adding Metrics

Currently data is collected from CAPI, Workflow and InCopy. Where possible data should be collected from CAPI.

## Collecting metrics via the kinesis stream

Metrics can be posted to the kinesis stream. Currently this stream is populated by the [production-metrics-lambdas](https://github.com/guardian/production-metrics-lambdas).
 Shared data models are in the [editorial-production-metrics-lib](https://github.com/guardian/editorial-production-metrics-lib). If the data field is already in CAPI this lambda
 and data model can be updated to include the new field 
 
## Collecting Metrics via POST requests

InCopy and Workflow both send data to metrics via POST requests

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

## Client Side

### Adding a new Metric

For a practical example please refer to [this PR](https://github.com/guardian/editorial-production-metrics/pull/87/commits/8fed3025dd56612509ff9d673394af5cf64c11c6).

The frontend is built in React. The app's state is managed with [redux](https://github.com/reactjs/redux). The library currently used for rendering the charts is [formidable-charts](https://github.com/FormidableLabs/formidable-charts), a collection of react components. Further documentation for the charts can be found [here](https://formidable.com/open-source/victory/docs/victory-chart/).

#### Fetching the data

All api calls are done with [axios](https://github.com/mzabriskie/axios). To fetch data for your new metric, you first need to define a new function in `public/js/services/Api.js` calling the desired endpoint on the scala client. We use the [panda-session](https://github.com/guardian/panda-session) library to handle reauthorization when a session is expired.

#### Merging the data into the store

All api calls for the different charts are triggered by the `filterDesk` action creator in `public/js/actions/index.js`, which dispatches async calls thanks to the `thunk` middleware. Currently, every endpoint for every metrics is called every time the url's query params have been changed by the filters (thanks to a custom routing middleware).

You should add the name of your new metric to the list in `public/js/utils/chartsList`: if you are consistent with the naming of the metric across the app, you should be able to easily add the new api call to the ones already being executed by the effect. The `filterDesk` action creator triggers the merge actions for every chart if fetching is successful, and the error actions if fetching fails. These actions are being listened by the reducer in `public/js/reducers/chartsReducer`, this is where the fetched data is manipulated and merged into the store.

You need to add your new metric to the reducers's initial state, following this structure:

```
nameOfYourMetric: {
    data: {
       ...yourMetricsData
    },
    ...yourOtherParams
}
```
        
You need to define your state update and fail cases in the reducer's switch statement, following the naming structure of the existing action types. In the reducers you have access to the state of the app and the payload of the action. All data manipulations needed to shape the data in the format requested by the charting component should be done at this level, before returning the new state. Remember to follow Redux's best practice of returning a new state object rather than altering the existing one.

#### Rendering the chart

All chart components are stored in `public/js/componets/Charts`. Just add a new wrapper for the new chart and import the chart-component that you need from `formidable-charts`, then pass it the required props. `ChartsReducer`, along with the other reducers, composes the app's store, which is connected to the app via the `mapStateToProps` function in `App.js`, so you only need to add your chart wrapper to the `Charts` component, and you will have access to the metrics data from the charts reducer in the component's props.

#### Adding a new filter

There is a unique reducer for all filters, in `updateFilterReducer.js`: just update the inital state, then in `Filters.js` add your filter and update the object by launching the `filterDesk()` action with the updated `filterVals` when your filter changes. Example: 
```
<select onChange={event => filterDesk({ ...filterVals, theFilterBeingUpdated: event.target.value })}> ... </select>
```
You can add the new query param in `Api.js` by simply adding a key to the `params` object built by the `buildQueryParams` function. 

`filterDesk` will update the filter object with the new value and proceed to call the api again with the updated values.

#### Routing

The App's state and url query params are kept in sync via a custom routing middleware (`public/js/services/routingMiddleware.js`).

#### Dates

[moment](https://momentjs.com) is used to manage all dates on the client. To ensure consistency across backend and frontend and across the app, all dates are being transformed to UTC format `moment(yourdate).utc()`. To maximize the amount of data requested for a specific range of time, start date (the day which is further in the past) should be at the beginning of the day `moment().utc().startOf('day')` while end date should be at the end of day `moment().utc().endOf('day')`.

### Graph Styling

The styling for the graphs can be found in [theme.js](https://github.com/guardian/editorial-production-metrics/tree/master/public/js/components/ChartTheme/theme.js)
