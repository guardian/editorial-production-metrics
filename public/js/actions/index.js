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

function updateProgress(updatingBool) {
    return {
        type: 'UPDATE_PROGRESS',
        updatingBool: updatingBool
    };
}

export function filterDesk(filterObj = {}) {
    return (dispatch, getState) => {
        dispatch(updateFilter(filterObj));
        dispatch(updateProgress(true));

        return getChartData(getState().filterVals).then(charts => {
            dispatch(updateProgress(false));
            dispatch(updateCharts(charts));
        });
    };
}
