import React from 'react';
import { Themes } from 'formidable-charts';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AreaChartWrap from './AreaChartWrap';

const Charts = ({ charts, isUpdating }) => {

    const renderToolOfOriginTitle = () => {
        return(
            <h3>Tool of Origin: <span className='chart-title-green'>InCopy</span> vs <span className='chart-title-yellow'>Composer</span></h3>
        );
    };

    const renderWorflowStateTitle = () => {
        return(
            <h3>Workflow State: <span className='chart-title-green'>Never Seen in Workflow</span> vs <span className='chart-title-yellow'>Seen in Workflow</span></h3>
        );
    };

    return (
        <Grid fluid>
            <Row around='xs'>
                <Col xs={12} md={8}>
                    <AreaChartWrap
                        chartType={'ComposerVsIncopy'}
                        titleHeader={renderToolOfOriginTitle()}
                        scale='time'
                        data={charts.composerVsInCopy.data}
                        isStacked={charts.composerVsInCopy.isStacked}
                        isUpdating={isUpdating}
                        error={charts.composerVsInCopy.error}
                        hasToggle={true}
                        height={250}
                        yLabel='Published Content Daily Numbers'
                        yLabelStacked='Published Content Daily %'
                    />
                </Col>
                <Col xs={12} md={8}>
                    <AreaChartWrap
                        chartType={'InWorkflowVsNotInWorkflow'}
                        titleHeader={renderWorflowStateTitle()}
                        scale='time'
                        data={charts.inWorkflowVsNotInWorkflow.data}
                        isStacked={charts.inWorkflowVsNotInWorkflow.isStacked}
                        isUpdating={isUpdating}
                        hasToggle={false}
                        error={charts.inWorkflowVsNotInWorkflow.error}
                        height={250}
                        yLabel='Published Content Daily Numbers'
                        yLabelStacked='Published Content Daily %'
                    />
                </Col>
            </Row>
        </Grid>
    );
};

export default Charts;
