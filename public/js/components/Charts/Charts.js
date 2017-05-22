import React from 'react';
import {LineChart, Themes} from 'formidable-charts';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Chart from './Chart';

import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const Charts = ({charts, updating, time}) => {
    const xLabelByTime = time === '7days' || time === '30days'
        ? 'Days'
        : 'Months';
    return (
        <Grid fluid>
            <Row>
                <Col xs={12} md={6}>
                    <Chart
                        title="Content started in Composer"
                        series={charts.startedInComposer}
                        xLabel={xLabelByTime}
                        yLabel="Percentage"
                        updating={updating}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Chart
                        title="Content never in Workflow"
                        series={charts.neverInWorkflow}
                        xLabel={xLabelByTime}
                        yLabel="Percentage"
                        updating={updating}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={6} md={4}>
                    <Chart
                        title="Content in paper started in digital tools"
                        series={charts.paperStartedInDigital}
                        xLabel={xLabelByTime}
                        yLabel="Percentage"
                        updating={updating}
                    />
                </Col>
                <Col xs={6} md={4}>
                    <Chart
                        title="Digital only content started in InCopy"
                        series={charts.digitalStartedInInCopy}
                        xLabel={xLabelByTime}
                        yLabel="Percentage"
                        updating={updating}
                    />
                </Col>
                <Col xs={6} md={4}>
                    <Chart
                        title="Print only content produced"
                        series={charts.printOnly}
                        xLabel={xLabelByTime}
                        yLabel="Percentage"
                        updating={updating}
                    />
                </Col>
            </Row>
        </Grid>
    );
};

export default Charts;
