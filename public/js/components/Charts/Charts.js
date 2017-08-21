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
                        scale="time"
                        title="Tool of origin: inCopy vs Composer"
                        data={charts.composerVsInCopy.data}
                        isStacked={charts.composerVsInCopy.isStacked}
                        isUpdating={isUpdating}
                        error={charts.composerVsInCopy.error}
                    />
                </Col>
            </Row>
        </Grid>
    );
};

export default Charts;
