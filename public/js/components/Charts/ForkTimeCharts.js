import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import ScatterChartWrap from './ScatterChartWrap';
import { CHART_FILTERS_MAP } from "../../utils/chartList";

const NoDataMessage = ({ filters }) =>
    <div className="no-data">
        No data, please update any of the following:<br />
        <span className="filters">{filters.join(", ")}</span>
    </div>

const ForkTimeCharts = ({ charts, isUpdating, filterVals }) => {

    return (
        <Row around="xs">
            <Col xs={12} md={8}>
                <ScatterChartWrap
                    hasToggle={false}
                    error={charts.forkTime.error}
                    chartType={'ForkTime'}
                    isUpdating={isUpdating}
                    filterVals={filterVals}
                    titleHeader={<h3>Fork Time (Excluding data points over 24 hours)</h3>}
                    hasCsvButton={true}
                    scale='time'
                    data={charts.forkTime.data}
                    noDataMessage={<NoDataMessage filters={CHART_FILTERS_MAP["ForkTime"]} />}
                    height={250}
                    yLabel='Time between fork and last edition'
                />
            </Col>
        </Row>
    );
};

export default ForkTimeCharts;
