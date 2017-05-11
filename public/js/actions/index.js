import fetch from 'unfetch';
import getChartData from 'services/getChartData';

function updateCharts(data) {
    return {
        type: 'UPDATE_CHARTS',
        dataPoints: data
    };
}

function updateFilter(filterObj) {
    return {
        type: 'UPDATE_FILTER',
        filterObj: filterObj
    };
}

export function filterDesk(filterObj = {}) {
    return (dispatch, getState) => {
        dispatch(updateFilter(filterObj));

        return getChartData(getState().filterVals).then(charts =>
            dispatch(updateCharts(charts)));
    };
}
