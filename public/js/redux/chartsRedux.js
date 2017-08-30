import { State, Actions, Effect } from 'jumpstate';
import api from 'services/Api';
import chartList from 'utils/chartList';
import { createYTotalsList, createPartialsList, formattedSeries, compareDates, fillMissingDates } from 'helpers/chartsHelpers';
import moment from 'moment';

/* ------------- State Management ------------- */

Effect('filterDesk', (filterObj) => {
    Actions.updateFilter(filterObj);
    Actions.toggleIsUpdatingCharts(true);
    const { startDate, endDate, desk } = filterObj;
    chartList.map(chart => {
        api[`get${chart}`](startDate, endDate, desk)
            .then(chartData => {
                Actions.toggleIsUpdatingCharts(false);
                Actions[`update${chart}`]({ chartData, startDate, endDate });
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
            data: {
                absolute: [],
                percent: []
            },
            isStacked: false
        }
    },

    updateComposerVsIncopy(state, { chartData, startDate, endDate }) {
        const { composerResponse, inCopyResponse } = chartData;
        const range = endDate.diff(startDate, 'days') + 1;
        const composerData = composerResponse.data.length < range ?  fillMissingDates(startDate, endDate, composerResponse.data).sort(compareDates) : composerResponse.data;
        const inCopyData = inCopyResponse.data.length < range ?  fillMissingDates(startDate, endDate, inCopyResponse.data).sort(compareDates) : inCopyResponse.data;
        const composerVsInCopyData = [{ data: composerData }, { data: inCopyData }];
        const seriesWithLabels = composerVsInCopyData.map(series => {
            return { 
                data: series.data.map((dataPoint, index) => {
                    const date = moment(dataPoint['date']).utc();
                    return {
                        x: date.valueOf(),
                        y: dataPoint['count'],
                        label: `Date: ${date.format('ddd, Do MMMM YYYY')}\nCreated in Composer: ${composerVsInCopyData[0]['data'][index]['count']}\nCreated in InCopy: ${composerVsInCopyData[1]['data'][index]['count']}`
                    };
                })
            };
        });
        const totals = createYTotalsList(createPartialsList(seriesWithLabels));
        const percentSeries = formattedSeries(seriesWithLabels, totals);

        return { 
            composerVsInCopy: {
                data: { 
                    absolute: seriesWithLabels,
                    percent: percentSeries
                },
                isStacked: state.composerVsInCopy.isStacked
            }
        };
    },

    toggleStackChart(state, isStacked) {
        return { 
            ...state,
            composerVsInCopy: {
                ...state.composerVsInCopy,
                isStacked 
            }
        };
    },

    getComposerVsIncopyFailed(state, error) {
        return { 
            ...state,
            composerVsInCopy: {
                ...state.composerVsInCopy,
                error: error.message
            }
        };
    }
});

export default chartsRedux;