import fetch from 'unfetch';
import getChartData from 'services/getChartData';

function updateChart(data) {
    return {
        type: 'UPDATE_CHART',
        dataPoints: data
    };
}

export function filterDesk(deskName = null) {
    return dispatch => {
        return getChartData(deskName).then(chartData =>
            dispatch(updateChart(chartData)));
    };
}
