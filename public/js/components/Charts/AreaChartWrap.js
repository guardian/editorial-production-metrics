import React from 'react';
import { Actions } from 'jumpstate';
import { AreaChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const AreaChartWrap = ({ data, xLabel, isUpdating, scale, isStacked, error }) => {
    function getClassName() {
        if (error) {
            return 'chart-wrap chart-wrap__error';
        } else {
            return isUpdating ? 'chart-wrap chart-wrap__updating' : 'chart-wrap';
        }
    }

    return (
        <div className={getClassName()}>
            <h3>Tool of Origin: <span className='chart-title-composer'>InCopy</span> vs <span className='chart-title-incopy'>Composer</span></h3>
            <AreaChart
                stacked={isStacked}
                height={250}
                theme={customisedTheme}
                series={isStacked ? data.percent : data.absolute}
                xAxis={{
                    label: xLabel,
                    scale
                }}
                yAxis={{
                    label: isStacked ? 'Published Content Daily %' : 'Published Content Daily Numbers',
                    scale: 'linear',
                    tickFormat: (d) => isStacked ? `${d}%` : d
                }}
            />
            <div className='chart-toggles'>
                <input
                    type="checkbox"
                    defaultChecked={isStacked}
                    onChange={event => Actions.toggleStackChart(event.target.checked)}
                />
                Show percent ratio
            </div>
        </div>
    );
};

export default AreaChartWrap;