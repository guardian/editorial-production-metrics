import React from 'react';
import { Themes } from 'formidable-charts';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AreaChartWrap from './AreaChartWrap';

const Charts = ({ charts, isUpdating }) => {

    const renderToolOfOriginTitle = () => {
        return(
            <div className='chart-title'>
                <h3>Tool of Origin: <span className='chart-title--second-series'>InCopy</span> vs <span className='chart-title--first-series'>Composer</span></h3>
            </div>
        );
    };

    const renderWorflowStateTitle = () => {
        return(
            <div className='chart-title'>
                <h3>Workflow State: <span className='chart-title--second-series'>Never Seen in Workflow</span> vs <span className='chart-title--first-series'>Seen in Workflow</span></h3>
            </div>              
        );
    };

    return (
        <Grid fluid>
            <Row around='xs'>
                <Col xs={12} md={6}>
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
                <Col xs={12} md={6}>
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
