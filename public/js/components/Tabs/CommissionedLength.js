import React from 'react';
import BandedCount from "../BandedCount";
import PieChartWrap from "../Charts/PieChartWrap";
import { bandName } from "../../utils/BandUtils";
import { Row, Col } from 'react-flexbox-grid';
import ArticleCommissionedLengthTable from '../ArticleCommissionedLengthTable';

const CommissionedLength = ({
    commissionedLengthBands,
    withoutCommissionedLengthCount,
    wordCountBands,
    articles
}) => (
    <div>
        <BandedCount
            title="Commissioned Lengths"
            bands={commissionedLengthBands}
            noBandCount={withoutCommissionedLengthCount}
        />
        <Row around='xs'>
            <Col xs={12} md={6}>
                <PieChartWrap
                    title="Commissioned Length Count"
                    data={commissionedLengthBands
                        .map(({ count, ...band }) => ({
                            x: bandName(band),
                            y: count
                        }))
                        .concat([
                            {
                                x: "None",
                                y: withoutCommissionedLengthCount
                            }
                        ])}
                />
            </Col>
        </Row>
        <BandedCount title="Word Counts" bands={wordCountBands} />
        <ArticleCommissionedLengthTable articles={articles} />
    </div>
);

export default CommissionedLength;
