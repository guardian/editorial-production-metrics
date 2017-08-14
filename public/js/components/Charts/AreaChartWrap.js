import React from 'react';
import { AreaChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const AreaChartWrap = ({ title, series, xLabel, yLabel, isUpdating, scale, stacked, error }) => {
    function getClassName() {
        if (error) {
            return 'chart-wrap chart-wrap__error';
        } else {
            return isUpdating ? 'chart-wrap chart-wrap__updating' : 'chart-wrap';
        }
    }
    
    return (
        <div className={getClassName()}>
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