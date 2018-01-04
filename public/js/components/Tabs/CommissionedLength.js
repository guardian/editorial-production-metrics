import React from 'react';
import BandedCount from "../BandedCount";
import PieChartWrap from "../Charts/PieChartWrap";
import TEST_DATA from "./_commissionedLengthTestData";
import { bandName } from "../../utils/BandUtils";
import { Row, Col } from 'react-flexbox-grid';

const CommissionedLength = () => {
    return (
        <div>
            <BandedCount data={TEST_DATA.wordCountBands} />
            <Row around='xs'>
                <Col xs={12} md={6}>
                    <PieChartWrap
                        title="Commissioned Length Count"
                        data={
                            TEST_DATA.commissionedLengthBands.map(({ count, ...band }) => ({
                                x: bandName(band),
                                y: count
                            })).concat([{
                                x: "None",
                                y: TEST_DATA.withoutCommissionedLengthCount
                            }])
                        } />
                </Col>
            </Row>
            <BandedCount data={TEST_DATA.commissionedLengthBands} />
        </div>
    );
};

export default CommissionedLength
