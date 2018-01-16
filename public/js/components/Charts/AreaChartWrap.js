import React from 'react';
import { AreaChart, BarChart, Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';
import ChartsToggles from '../ChartsToggles';
import Chart from './Chart';
import { dateCount, xDomain } from '../../helpers/chartsHelpers';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const AreaChartWrap = ({ data, xLabel, yLabel, yLabelStacked, scale, isStacked, error, hasToggle, height, titleHeader, chartType, toggleStackChart, filterVals, hasCsvButton, isUpdating }) => {
    const series = isStacked ? data.percent : data.absolute;
    const ChartComponent = dateCount(series) > 1 ? AreaChart : BarChart;
    return (
        <Chart error={error} isUpdating={isUpdating}>
            {titleHeader}
            <ChartComponent
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
                domain={{
                    x: xDomain(series)
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
        </Chart>
    );
};

export default AreaChartWrap;