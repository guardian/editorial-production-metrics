import React from 'react';
import BandedCount from "../BandedCount";
import PieChartWrap from "../Charts/PieChartWrap";
import TEST_DATA from "./_commissionedLengthTestData";
import { bandName } from "../../utils/BandUtils";

const CommissionedLength = () => {
    return (
        <div>
            <PieChartWrap data ={TEST_DATA.wordCountBands.map(({ count, ...band }) => ({
                x: bandName(band),
                y: count
            }))} />
            <BandedCount data={TEST_DATA.wordCountBands} />
            <BandedCount data={TEST_DATA.commissionedLengthBands} />
        </div>
    );
};

export default CommissionedLength
