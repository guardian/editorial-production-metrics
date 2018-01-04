import React from 'react';
import BandedCount from "../BandedCount";
import PieChartWrap from "../Charts/PieChartWrap";
import TEST_DATA from "./_commissionedLengthTestData";
import { bandName } from "../../utils/BandUtils";
import { Row, Col } from 'react-flexbox-grid';
import ArticleCommissionedLengthTable from '../ArticleCommissionedLengthTable';

const CommissionedLength = () => {
    return (
        <div>
            <BandedCount
                title="Commisioned Lengths"
                bands={TEST_DATA.commissionedLengthBands}
                noBandCount={TEST_DATA.withoutCommissionedLengthCount}
            />
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
            <BandedCount title="Word Counts" bands={TEST_DATA.wordCountBands} />
            <ArticleCommissionedLengthTable articles={TEST_DATA.articles}/>
        </div>
    );
};

export default CommissionedLength
