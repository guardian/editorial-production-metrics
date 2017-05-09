import React from 'react';
import {LineChart, Themes} from 'formidable-charts';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ChartTheme from '../ChartTheme/theme';

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const Charts = ({startedInComposer, neverInWorkflow}) => {
    return (
        <Grid fluid>
            <Row>
                <Col xs={12} md={6}>
                    <LineChart
                        title={'Content started in Composer'}
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={startedInComposer}
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
                        title={'Content never in Workflow'}
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={neverInWorkflow}
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
                        title={'Content started in Composer'}
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={[
                            {
                                data: [
                                    {x: 1, y: 80},
                                    {x: 2, y: 90},
                                    {x: 3, y: 50},
                                    {x: 4, y: 90},
                                    {x: 5, y: 60},
                                    {x: 6, y: 50},
                                    {x: 7, y: 30}
                                ]
                            }
                        ]}
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
                        title={'Content started in InCopy'}
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={[
                            {
                                data: [
                                    {x: 1, y: 10},
                                    {x: 2, y: 10},
                                    {x: 3, y: 20},
                                    {x: 4, y: 30},
                                    {x: 5, y: 40},
                                    {x: 6, y: 50},
                                    {x: 7, y: 40}
                                ]
                            }
                        ]}
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
                        title={'Content started in InCopy'}
                        domain={{y: [0, 100]}}
                        theme={customisedTheme}
                        series={[
                            {
                                data: [
                                    {x: 1, y: 10},
                                    {x: 2, y: 10},
                                    {x: 3, y: 20},
                                    {x: 4, y: 30},
                                    {x: 5, y: 40},
                                    {x: 6, y: 50},
                                    {x: 7, y: 40}
                                ]
                            }
                        ]}
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
