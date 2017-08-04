import React from 'react';
import { LineChart , Themes } from 'formidable-charts';

import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const LineChartWrap = ({ title, series, xLabel, yLabel, isUpdating, scale }) => {
    return (
        <div className={`chart-wrap ${isUpdating && 'chart-wrap__updating'}`}>
            <LineChart
                title={title}
                theme={customisedTheme}
                series={series}
                tickCount={5}
                xAxis={{
                    label: xLabel,
                    scale
                }}
                yAxis={{
                    label: yLabel
                }}
            />
        </div>
    );
};

export default LineChartWrap;