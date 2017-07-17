import fetch from 'unfetch';
import moment from 'moment';

export default function getChartData(filterVals) {
    const formattedStartDate = moment(filterVals.startDate).format();
    const formattedEndDate = moment(filterVals.endDate).format();
    const reqParams = `?office=${filterVals.office}&desk=${filterVals.desk}&section=${filterVals.section}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    return Promise
        .all(
            [
                'startedInComposer',
                'neverInWorkflow',
                'paperStartedInDigital',
                'digitalStartedInInCopy',
                'printOnly'
            ].map(chartType =>
                fetch(
                    `https://ed-met-fakeapi.getsandbox.com/${chartType}${reqParams}`
                )
                    .then(res => res.json())
                    .then(jsonRes => ({
                        [chartType]: [jsonRes]
                    })))
        )
        .then(chartArr => Object.assign(...chartArr));
}
