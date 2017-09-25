import React from 'react';
import { Themes } from 'formidable-charts';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AreaChartWrap from './AreaChartWrap';
import ScatterChartWrap from './ScatterChartWrap';

const Charts = ({ charts, isUpdating, toggleStackChart }) => {

    const renderTitle = (type) => {
        switch (type) {
        case 'originatingSystem':
            return <h3>Tool of Origin: <span className='chart-title--second-series'>InCopy</span> vs <span className='chart-title--first-series'>Composer</span></h3>;
        case 'workflowState':
            return <h3>Workflow State: <span className='chart-title--second-series'>Never Seen in Workflow</span> vs <span className='chart-title--first-series'>Seen in Workflow</span></h3>;
        case 'forkTime':
            return <h3>Fork Time</h3>;
        default:
            '';
        }
    };

    return (
        <Grid fluid>
            <Row around='xs'>
                <Col xs={12} md={6}>
                    <AreaChartWrap
                        toggleStackChart={toggleStackChart}
                        chartType={'ComposerVsIncopy'}
                        titleHeader={renderTitle('originatingSystem')}
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
                        titleHeader={renderTitle('workflowState')}
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
            <Row around='xs'>
                <Col xs={12} md={8}>
                    <ScatterChartWrap
                        titleHeader={renderTitle('forkTime')}
                        scale='time'
                        data={charts.forkTime.data}
                        isUpdating={isUpdating}
                        height={250}
                        yLabel='Time since forkage'
                    />
                </Col>
            </Row>
        </Grid>
    );
};

export default Charts;