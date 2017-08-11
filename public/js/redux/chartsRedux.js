import { State, Actions, Effect } from 'jumpstate';
import api from 'services/Api';
import { createYTotalsList, createPartialsList, formattedSeries } from 'helpers/chartsHelpers';

/* ------------- State Management ------------- */

Effect('filterDesk', (filterObj) => {
    Actions.updateFilter(filterObj);
    Actions.toggleIsUpdatingCharts(true);
    api.getComposerVsIncopy(filterObj.startDate, filterObj.endDate, filterObj.desk)
        .then(composerVsInCopyData => {
            Actions.toggleIsUpdatingCharts(false);
            Actions.updateComposerVsIncopy(composerVsInCopyData);
        })
        .catch((error) => {
            Actions.toggleIsUpdatingCharts(false);
            Actions.getComposerVsIncopyFailed(error);
        });
});

const chartsRedux = State({
    initial: {
        composerVsInCopy: []
    },

    updateComposerVsIncopy(state, composerVsInCopyData) {
        const totals = createYTotalsList(createPartialsList(composerVsInCopyData));
        const percentSeries = formattedSeries(composerVsInCopyData, totals);
        return { composerVsInCopy: percentSeries };
    },

    getComposerVsIncopyFailed(state, error) {
        return {
            composerVsInCopy: state.composerVsInCopy,
            error: error.message
        };
    }
});

export default chartsRedux;