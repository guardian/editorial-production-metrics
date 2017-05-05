import React from 'react';
import {LineChart} from 'formidable-charts';
import {Row, Col} from 'react-flexbox-grid';

class Charts extends React.Component {
    render() {
        return (
            <Row>
                <Col xs={12} md={6}>
                    <LineChart
                        title={'Content started in Composer'}
                        domain={{y: [0, 100]}}
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
                            },
                            {
                                data: [
                                    {x: 1, y: 30},
                                    {x: 2, y: 20},
                                    {x: 3, y: 40},
                                    {x: 4, y: 50},
                                    {x: 5, y: 50},
                                    {x: 6, y: 30},
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
                <Col xs={12} md={6}>
                    <LineChart
                        title={'Content started in InCopy'}
                        domain={{y: [0, 100]}}
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
                            },
                            {
                                data: [
                                    {x: 1, y: 7},
                                    {x: 2, y: 30},
                                    {x: 3, y: 10},
                                    {x: 4, y: 10},
                                    {x: 5, y: 20},
                                    {x: 6, y: 11},
                                    {x: 7, y: 5}
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
        );
    }
}

export default Charts;
