import { State, Actions, Effect } from 'jumpstate';
import getChartData from 'services/getChartData';
import { createYTotalsList, createPartialsList, formattedSeries } from 'helpers/chartsHelpers';

/* ------------- State Management ------------- */

Effect('filterDesk', (filterObj) => {
    Actions.updateFilter(filterObj);
    Actions.toggleIsUpdatingCharts(true);
    getChartData(filterObj).then(chartsData => {
        Actions.toggleIsUpdatingCharts(false);
        Actions.updateComposerVsIncopy(chartsData);
    });
});

const chartsRedux = State({
    initial: {
        composerVsInCopy: []
    },

    updateComposerVsIncopy(state, chartsData) {
        const series = chartsData.composerVsInCopy;
        const totals = createYTotalsList(createPartialsList(series));
        const percentSeries = formattedSeries(series, totals);
        return { composerVsInCopy: percentSeries };
    }
});

export default chartsRedux;