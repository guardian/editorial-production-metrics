
import React from 'react';
import { ScatterChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const ScatterChartWrap = ({ isUpdating, scale, error, height, titleHeader, yLabel, data }) => {
    function getClassName() {
        if (error) {
            return 'chart-wrap chart-wrap__error';
        } else {
            return isUpdating ? 'chart-wrap chart-wrap__updating' : 'chart-wrap';
        }
    }
    
    return (
        <div className={getClassName()}>
            {titleHeader}
            <ScatterChart
                height={height}
                theme={customisedTheme}
                series={data.absolute}
                xAxis={{
                    scale
                }}
                yAxis={{
                    label: yLabel,
                    tickFormat: (d) => `${Math.round(d / 3600)}h`
                }}
            />
        </div>
    );
};

export default ScatterChartWrap;