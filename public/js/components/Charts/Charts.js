import React from 'react';
import { Themes } from 'formidable-charts';
import { Grid, Row, Col } from 'react-flexbox-grid';
import LineChartWrap from './LineChartWrap';
import AreaChartWrap from './AreaChartWrap';

const Charts = ({ charts, isUpdating }) => {
    return (
        <Grid fluid>
            <Row>
                <Col xs={12} md={6}>
                    <AreaChartWrap
                        stacked={true}
                        scale="time"
                        title="Tool of origin: inCopy vs Composer"
                        series={charts.composerVsInCopy}
                        yLabel="Published Content %"
                        updating={isUpdating}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <LineChartWrap
                        scale="time"
                        title="Content started in Composer"
                        series={charts.startedInComposer}
                        yLabel="Published Content %"
                        isUpdating={isUpdating}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={6} md={4}>
                    <LineChartWrap
                        scale="time"
                        title="Content never in Workflow"
                        series={charts.neverInWorkflow}
                        yLabel="Published Content %"
                        isUpdating={isUpdating}
                    />
                </Col>
                <Col xs={6} md={4}>
                    <LineChartWrap
                        scale="time"
                        title="Content in paper started in digital tools"
                        series={charts.paperStartedInDigital}
                        yLabel="Published Content %"
                        isUpdating={isUpdating}
                    />
                </Col>
                <Col xs={6} md={4}>
                    <LineChartWrap
                        scale="time"
                        title="Digital only content started in InCopy"
                        series={charts.digitalStartedInInCopy}
                        yLabel="Published Content %"
                        isUpdating={isUpdating}
                    />
                </Col>
                <Col xs={6} md={4}>
                    <LineChartWrap
                        scale="time"
                        title="Print only content produced"
                        series={charts.printOnly}
                        yLabel="Published Content %"
                        isUpdating={isUpdating}
                    />
                </Col>
            </Row>
        </Grid>
    );
};

export default Charts;
