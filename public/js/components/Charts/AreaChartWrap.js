import React from 'react';
import { AreaChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const createPartialsList = (series) => {
    let partialsList = new Array(series.length);
    for(let i = 0; i < series.length; i++) {
        partialsList[i] = series[i].data.map(pair => pair['y']);
    }
    return partialsList;
};

const summedPartials = (partialsList) => {
    let totals = new Array(partialsList[0].length).fill(0);
    for(let i = 0; i < partialsList.length; i++) {
        for(let j = 0; j < totals.length; j++) {
            totals[j] += partialsList[i][j];
        }
    }
    return totals;
};

const converToPercentage = (value, total) => value * 100 / total;

const percentageDataSetPair = (pair, total) => { 
    return {'x': pair['x'], 'y': converToPercentage(pair['y'], total)};
};

const percentageDataSet = (dataSet, summedPartials) => {
    return dataSet.map((pair, index) => percentageDataSetPair(pair, summedPartials[index]));
};

const formattedSeries = (series, summedPartials) => series.map((singleSeries) => { return { data: percentageDataSet(singleSeries.data, summedPartials)};});

const AreaChartWrap = ({ title, series, xLabel, yLabel, isUpdating, scale, stacked }) => {
    const totals = summedPartials(createPartialsList(series));
    const percentSeries = formattedSeries(series, totals);
    return (
        <div className={`chart-wrap ${isUpdating && 'chart-wrap__updating'}`}>
            <AreaChart
                stacked={stacked}
                domain={{y: [0, 100]}}
                title={title}
                theme={customisedTheme}
                series={percentSeries}
                xAxis={{
                    label: xLabel,
                    scale
                }}
                yAxis={{
                    label: yLabel,
                    // tickFormat: d => Math.round(d*100/Math.max(totals)) + '%',
                    scale: 'linear'
                }}
            />
        </div>
    );
};

export default AreaChartWrap;