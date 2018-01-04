
import React from 'react';
import { ScatterChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';
import ChartsToggles  from '../ChartsToggles';
import Chart from './Chart';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const hasData = (data) => (((data || [])[0] || {})["data"] || []).length;

const ScatterChartWrap = ({ scale, error, noDataMessage, height, titleHeader, yLabel, data, isUpdating, chartType, hasToggle, hasCsvButton, filterVals }) =>
    <Chart error={error} isUpdating={isUpdating}>
        {titleHeader}
        {hasData(data.absolute) ? (
            <div>
                <ScatterChart
                    height={height}
                    theme={customisedTheme}
                    series={data.absolute}
                    xAxis={{
                        scale
                    }}
                    yAxis={{
                        label: yLabel,
                        tickFormat: (datum) => `${datum}h`
                    }}
                />
                <ChartsToggles
                    filterVals={filterVals}
                    hasToggle={hasToggle}
                    chartType={chartType}
                    data={data}
                    hasCsvButton={hasCsvButton}
                />
            </div>
        ) : (
            <div>
                {noDataMessage}
            </div>
        )}
    </Chart>;

export default ScatterChartWrap;