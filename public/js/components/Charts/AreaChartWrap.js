import React from 'react';
import { Actions } from 'jumpstate';
import { AreaChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const AreaChartWrap = ({ title, data, xLabel, isUpdating, scale, isStacked, error }) => {
    function getClassName() {
        if (error) {
            return 'chart-wrap chart-wrap__error';
        } else {
            return isUpdating ? 'chart-wrap chart-wrap__updating' : 'chart-wrap';
        }
    }
    
    return (
        <div className={getClassName()}>
            <input
                type="checkbox"
                onChange={event => Actions.toggleStackChart(event.target.checked)}
            />
            <AreaChart
                stacked={isStacked}
                title={title}
                theme={customisedTheme}
                series={isStacked ? data.percent : data.absolute}
                xAxis={{
                    label: xLabel,
                    scale
                }}
                yAxis={{
                    label: isStacked ? 'Published Content Daily %' : 'Published Content Daily Numbers',
                    scale: 'linear'
                }}
            />
        </div>
    );
};

export default AreaChartWrap;