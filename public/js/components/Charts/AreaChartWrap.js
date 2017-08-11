import React from 'react';
import { AreaChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const AreaChartWrap = ({ title, series, xLabel, yLabel, isUpdating, scale, stacked, error }) => {
    return (
        <div className={!error ? `chart-wrap ${isUpdating && 'chart-wrap__updating'}` : 'error'}>
            <AreaChart
                stacked={stacked}
                title={title}
                theme={customisedTheme}
                series={series}
                xAxis={{
                    label: xLabel,
                    scale
                }}
                yAxis={{
                    label: yLabel,
                    scale: 'linear'
                }}
            />
        </div>
    );
};

export default AreaChartWrap;