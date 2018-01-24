import React from 'react';
import ForkTimeCharts from '../Charts/ForkTimeCharts';

const ForkTime = ({filterVals, isUpdating, charts}) => {
    return (
        <div id="fork-time">
            <ForkTimeCharts
                charts={charts}
                filterVals={filterVals}
                isUpdating={isUpdating}
            />
        </div>
    );
};

export default ForkTime
