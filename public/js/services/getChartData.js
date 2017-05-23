import fetch from 'unfetch';

export default function getChartData(filterVals) {
    const reqParams = `?office=${filterVals.office}&desk=${filterVals.desk}&section=${filterVals.section}&time=${filterVals.time}`;
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
