
import React from 'react';
import { ScatterChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';
import ChartsToggles  from '../ChartsToggles';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const ScatterChartWrap = ({ scale, error, height, titleHeader, yLabel, data, getClassName, chartType, hasToggle, hasCsvButton, filterVals }) =>
    <div className={getClassName(error)}>
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
        <ChartsToggles
            filterVals={filterVals}
            hasToggle={hasToggle}
            chartType={chartType}
            data={data}
            hasCsvButton={hasCsvButton}
        />
    </div>;

export default ScatterChartWrap;