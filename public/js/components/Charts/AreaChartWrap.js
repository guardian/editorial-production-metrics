import React from 'react';
import { AreaChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';
import ChartsToggles from '../ChartsToggles';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const AreaChartWrap = ({ data, xLabel, yLabel, yLabelStacked, scale, isStacked, error, hasToggle, height, titleHeader, chartType, toggleStackChart, filterVals, hasCsvButton, getClassName }) =>
    <div className={getClassName(error)}>
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
    </div>;

export default AreaChartWrap;