import React from 'react';
import { ScatterChart , Themes } from 'formidable-charts';
import ChartTheme from '../ChartTheme/theme';
import moment from 'moment';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const ScatterChartWrap = ({ isUpdating, scale, error, height, titleHeader, yLabel }) => {
    function getClassName() {
        if (error) {
            return 'chart-wrap chart-wrap__error';
        } else {
            return isUpdating ? 'chart-wrap chart-wrap__updating' : 'chart-wrap';
        }
    }
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    const generateData = times => {
        let data = [];
        for (let i = 0, j = 0; i < times; i++) {
            const xVal = moment().add(j + getRandomInt(0, 5), 'hours').utc().valueOf();
            const yVal = getRandomInt(0, 43200);
            data.push({ x: xVal, y: yVal, label: `${(yVal / 3600).toFixed(1)} hours`, size: 2.5 });
            j += 1;
        }
        return [{ data }];
    };

    const dataGen = generateData(60);

    return (
        <div className={getClassName()}>
            {titleHeader}
            <ScatterChart
                height={height}
                theme={customisedTheme}
                series={dataGen}
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