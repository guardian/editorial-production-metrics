import React from 'react';
import {LineChart, Themes} from 'formidable-charts';

import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const Chart = ({title, series, xLabel, yLabel, updating}) => {
    return (
        <div className={`chart-wrap ${updating && 'chart-wrap__updating'}`}>
            <LineChart
                title={title}
                domain={{y: [0, 100]}}
                theme={customisedTheme}
                series={series}
                xAxis={{
                    label: xLabel,
                    tickFormat: tick => tick.toFixed()
                }}
                yAxis={{
                    label: yLabel
                }}
            />
        </div>
    );
};

export default Chart;
