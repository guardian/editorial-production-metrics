import React from 'react';
import { Themes } from 'formidable-charts';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AreaChartWrap from './AreaChartWrap';

const Charts = ({ charts, isUpdating }) => {
    return (
        <Grid fluid>
            <Row around="xs">
                <Col xs={12} md={8}>
                    <AreaChartWrap
                        stacked={true}
                        scale="time"
                        title="Tool of origin: inCopy vs Composer"
                        series={charts.composerVsInCopy}
                        yLabel="Published Content %"
                        isUpdating={isUpdating}
                        errors={charts.errors}
                    />
                </Col>
            </Row>
        </Grid>
    );
};

export default Charts;
