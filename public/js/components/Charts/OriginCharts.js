import React from 'react';
import { Themes } from 'formidable-charts';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AreaChartWrap from './AreaChartWrap';
import ScatterChartWrap from './ScatterChartWrap';

const OriginCharts = ({ charts, isUpdating, toggleStackChart, filterVals }) => {

    const renderTitle = (type) => {
        switch (type) {
        case 'originatingSystem':
            return <h3>Tool of Origin: <span className='chart-title--second-series'>InCopy</span> vs <span className='chart-title--first-series'>Composer</span></h3>;
        case 'workflowState':
            return <h3>Workflow State: <span className='chart-title--second-series'>Never Seen in Workflow</span> vs <span className='chart-title--first-series'>Seen in Workflow</span></h3>;
        default:
            '';
        }
    };

    const getClassName = (error) => {
        if (error) {
            return 'chart-wrap chart-wrap__error';
        } else {
            return isUpdating ? 'chart-wrap chart-wrap__updating' : 'chart-wrap';
        }
    };

    return (
        <Grid fluid>
            <Row around='xs'>
                <Col xs={12} md={6}>
                    <AreaChartWrap
                        getClassName={getClassName}
                        filterVals={filterVals}
                        hasCsvButton={true}
                        toggleStackChart={toggleStackChart}
                        chartType={'ComposerVsIncopy'}
                        titleHeader={renderTitle('originatingSystem')}
                        scale='time'
                        data={charts.composerVsInCopy.data}
                        isStacked={charts.composerVsInCopy.isStacked}
                        error={charts.composerVsInCopy.error}
                        hasToggle={true}
                        height={250}
                        yLabel='Published Content Daily Numbers'
                        yLabelStacked='Published Content Daily %'
                    />
                </Col>
                <Col xs={12} md={6}>
                    <AreaChartWrap
                        getClassName={getClassName}
                        filterVals={filterVals}
                        hasCsvButton={true}
                        chartType={'InWorkflowVsNotInWorkflow'}
                        titleHeader={renderTitle('workflowState')}
                        scale='time'
                        data={charts.inWorkflowVsNotInWorkflow.data}
                        isStacked={charts.inWorkflowVsNotInWorkflow.isStacked}
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

export default OriginCharts;