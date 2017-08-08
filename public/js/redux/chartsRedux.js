import { State, Actions, Effect } from 'jumpstate';
import api from 'services/Api';
import { createYTotalsList, createPartialsList, formattedSeries } from 'helpers/chartsHelpers';

/* ------------- State Management ------------- */

Effect('filterDesk', (filterObj) => {
    Actions.resetErrors();
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
        composerVsInCopy: [],
        errors: {
            hasErrors: false,
            message: null
        }
    },

    updateComposerVsIncopy(state, composerVsInCopyData) {
        const totals = createYTotalsList(createPartialsList(composerVsInCopyData));
        const percentSeries = formattedSeries(composerVsInCopyData, totals);
        return { composerVsInCopy: percentSeries };
    },

    getComposerVsIncopyFailed(state, error) {
        return { 
            errors: { 
                hasErrors: true,
                message: error
            }
        };
    },

    resetErrors() {
        return {
            errors: {
                hasErrors: false,
                message: null
            }
        };
    }
});

export default chartsRedux;