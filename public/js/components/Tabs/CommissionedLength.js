import React from "react";
import CountTable from "../CountTable";
import PieChartWrap from "../Charts/PieChartWrap";
import { Row, Col } from "react-flexbox-grid";
import ArticleWithCommissionedLengthTable from "../ArticleWithCommissionedLengthTable";
import ArticleWithoutCommissionedLengthTable from "../ArticleWithoutCommissionedLengthTable";

const CommissionedLength = ({
    commissionedLengthBands,
    wordCountBands,
    articlesWithCommissionedLength,
    articlesWithoutCommissionedLength
}) => (
    <div id="commissioned-length">
        <CountTable
            title="Commissioned Lengths"
            bands={commissionedLengthBands}
        />
        <Row around="xs">
            <Col xs={12} md={6}>
                <PieChartWrap
                    title="Commissioned Length Count"
                    data={commissionedLengthBands.map(({ count, label }) => ({
                        x: label,
                        y: count
                    }))}
                />
            </Col>
        </Row>
        <CountTable title="Word Counts" bands={wordCountBands} />
        <ArticleWithCommissionedLengthTable
            articles={articlesWithCommissionedLength}
        />
        <ArticleWithoutCommissionedLengthTable
            articles={articlesWithoutCommissionedLength}
        />
    </div>
);

export default CommissionedLength;
