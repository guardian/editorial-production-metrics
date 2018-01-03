
import React from 'react';
import { ScatterChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';
import ChartsToggles  from '../ChartsToggles';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const hasData = (data) => (((data || [])[0] || {})["data"] || []).length;

const ScatterChartWrap = ({ scale, error, noDataMessage, height, titleHeader, yLabel, data, getClassName, chartType, hasToggle, hasCsvButton, filterVals }) =>
    <div className={getClassName(error)}>
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
    </div>;

export default ScatterChartWrap;