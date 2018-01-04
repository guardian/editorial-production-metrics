import React from 'react';
import { AreaChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';
import ChartsToggles from '../ChartsToggles';
import Chart from './Chart';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const AreaChartWrap = ({ data, xLabel, yLabel, yLabelStacked, scale, isStacked, error, hasToggle, height, titleHeader, chartType, toggleStackChart, filterVals, hasCsvButton, isUpdating }) =>
    <Chart error={error} isUpdating={isUpdating}>
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
                label: isStacked ? yLabelStacked : yLabel,
                scale: 'linear',
                tickFormat: (datum) => isStacked ? `${datum}%` : datum
            }}
        />
        <ChartsToggles
            filterVals={filterVals}
            hasToggle={hasToggle}
            chartType={chartType}
            data={data}
            isStacked={isStacked}
            hasCsvButton={hasCsvButton}
            toggleStackChart={toggleStackChart}
        />
    </Chart>;

export default AreaChartWrap;