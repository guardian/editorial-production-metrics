import { State, Actions, Effect } from 'jumpstate';
import api from 'services/Api';
import chartList from 'utils/chartList';
import { createYTotalsList, createPartialsList, formattedSeries } from 'helpers/chartsHelpers';

/* ------------- State Management ------------- */

Effect('filterDesk', (filterObj) => {
    Actions.updateFilter(filterObj);
    Actions.toggleIsUpdatingCharts(true);
    chartList.map(chart => {
        api[`get${chart}`](filterObj.startDate, filterObj.endDate, filterObj.desk)
            .then(chartData => {
                Actions.toggleIsUpdatingCharts(false);
                Actions[`update${chart}`](chartData);
            })
            .catch(error => {
                Actions.toggleIsUpdatingCharts(false);
                Actions[`get${chart}Failed`](error);
            });
    });
});

const chartsRedux = State({
    initial: {
        composerVsInCopy: {
            data: []
        }
    },

    updateComposerVsIncopy(state, composerVsInCopyData) {
        const totals = createYTotalsList(createPartialsList(composerVsInCopyData));
        const percentSeries = formattedSeries(composerVsInCopyData, totals);
        return { 
            composerVsInCopy: {
                data: percentSeries
            }
        };
    },

    getComposerVsIncopyFailed(state, error) {
        return {
            composerVsInCopy: {
                data: state.composerVsInCopy.data,
                error: error.message
            }
        };
    }
});

export default chartsRedux;