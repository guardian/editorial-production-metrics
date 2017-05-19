import React from 'react';
import {LineChart, Themes} from 'formidable-charts';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const Charts = ({charts}) => {
    return (
        <Grid fluid>
            <Row>
                <Col xs={12} md={6}>
                    <LineChart
                        title="Content started in Composer"
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={charts.startedInComposer}
                        xAxis={{
                            label: 'Day of week',
                            tickFormat: tick => tick.toFixed()
                        }}
                        yAxis={{
                            label: 'percentage'
                        }}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <LineChart
                        title="Content never in Workflow"
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={charts.neverInWorkflow}
                        xAxis={{
                            label: 'Day of week',
                            tickFormat: tick => tick.toFixed()
                        }}
                        yAxis={{
                            label: 'percentage'
                        }}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={6} md={4}>
                    <LineChart
                        title="Content in paper started in digital tools"
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={charts.paperStartedInDigital}
                        xAxis={{
                            label: 'Day of week',
                            tickFormat: tick => tick.toFixed()
                        }}
                        yAxis={{
                            label: 'percentage'
                        }}
                    />
                </Col>
                <Col xs={6} md={4}>
                    <LineChart
                        title="Digital only content started in InCopy"
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={charts.digitalStartedInInCopy}
                        xAxis={{
                            label: 'Day of week',
                            tickFormat: tick => tick.toFixed()
                        }}
                        yAxis={{
                            label: 'percentage'
                        }}
                    />
                </Col>
                <Col xs={6} md={4}>
                    <LineChart
                        title="Print only content produced"
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={charts.printOnly}
                        xAxis={{
                            label: 'Day of week',
                            tickFormat: tick => tick.toFixed()
                        }}
                        yAxis={{
                            label: 'percentage'
                        }}
                    />
                </Col>
            </Row>
        </Grid>
    );
};

export default Charts;
