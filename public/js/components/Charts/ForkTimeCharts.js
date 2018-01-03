import React from 'react';
import { Themes } from 'formidable-charts';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AreaChartWrap from './AreaChartWrap';
import ScatterChartWrap from './ScatterChartWrap';
import { CHART_FILTERS_MAP } from "../../utils/chartList";

const NoDataMessage = ({ filters }) =>
    <div className="no-data">
        No data, please update any of the following:<br />
        <span className="filters">{filters.join(", ")}</span>
    </div>

const ForkTimeCharts = ({ charts, isUpdating, toggleStackChart, filterVals }) => {

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
                <Col xs={12} md={8}>
                    <ScatterChartWrap
                        hasToggle={false}
                        error={charts.forkTime.error}
                        chartType={'ForkTime'}
                        getClassName={getClassName}
                        filterVals={filterVals}
                        titleHeader={<h3>Fork Time</h3>}
                        hasCsvButton={true}
                        scale='time'
                        data={charts.forkTime.data}
                        noDataMessage={<NoDataMessage filters={CHART_FILTERS_MAP["ForkTime"]} />}
                        height={250}
                        yLabel='Time to Publication'
                    />
                </Col>
            </Row>
        </Grid>
    );
};

export default ForkTimeCharts;