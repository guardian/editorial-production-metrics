import { State, Actions, Effect } from 'jumpstate';
import api from 'services/api';
import { createYTotalsList, createPartialsList, formattedSeries } from 'helpers/chartsHelpers';

/* ------------- State Management ------------- */

Effect('filterDesk', (filterObj) => {
    Actions.updateFilter(filterObj);
    Actions.toggleIsUpdatingCharts(true);
    api.getComposerVsIncopy(filterObj.startDate, filterObj.endDate, filterObj.desk)
        .then(composerVsInCopyData => {
            Actions.toggleIsUpdatingCharts(false);
            Actions.updateComposerVsIncopy(composerVsInCopyData);
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