import getChartData from 'services/getChartData';

function updateComposerVsIncopyCharts(chartsData) {
    return {
        type: 'UPDATE_COMPOSER_VS_INCOPY_CHARTS',
        chartsData
    };
}

function updateFilter(filterObj) {
    return {
        type: 'UPDATE_FILTER',
        filterObj
    };
}

function toggleIsUpdatingCharts(isUpdating) {
    return {
        type: 'UPDATE_PROGRESS',
        isUpdating
    };
}

export function filterDesk(filterObj = {}) {
    return (dispatch, getState) => {
        dispatch(updateFilter(filterObj));
        dispatch(toggleIsUpdatingCharts(true));

        return getChartData(getState().filterVals).then(chartsData => {
            dispatch(toggleIsUpdatingCharts(false));
            dispatch(updateComposerVsIncopyCharts(chartsData));
        });
    };
}
