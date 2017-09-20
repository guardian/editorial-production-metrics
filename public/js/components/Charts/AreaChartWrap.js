import React from 'react';
import { AreaChart , Themes } from 'formidable-charts';
import { downloadCSV } from 'helpers/chartsHelpers'
import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const AreaChartWrap = ({ data, xLabel, yLabel, yLabelStacked, isUpdating, scale, isStacked, error, hasToggle, height, titleHeader, chartType, actions }) => {
    function getClassName() {
        if (error) {
            return 'chart-wrap chart-wrap__error';
        } else {
            return isUpdating ? 'chart-wrap chart-wrap__updating' : 'chart-wrap';
        }
    }

    const renderToggle = () => {
        return(
            <span>
                <input
                    type="checkbox"
                    defaultChecked={isStacked}
                    onChange={event => actions.toggleStackChart(event.target.checked)}
                />
                Show percent ratio
            </span>
        );
    };

    return (
        <div className={getClassName()}>
            {titleHeader}
            <AreaChart
                stacked={isStacked}
                height={height}
                theme={customisedTheme}
                series={isStacked ? data.percent : data.absolute}
                xAxis={{
                    label: xLabel,
                    scale
                }}
                yAxis={{
                    label: isStacked ? yLabel : yLabelStacked,
                    scale: 'linear',
                    tickFormat: (d) => isStacked ? `${d}%` : d
                }}
            />
            <div className='chart-toggles'>
                {hasToggle && renderToggle()}
                <button onClick={() => downloadCSV(data, chartType)}>Download CSV</button>
            </div>
        </div>
    );
};

export default AreaChartWrap;