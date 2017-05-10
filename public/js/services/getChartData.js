export default function getChartData(deskName) {
    return fetch('https://ed-met-fakeapi.getsandbox.com/startedInComposer')
        .then(res => res.json())
        .then(result => {
            console.log(result);
            return result;
        });
}
