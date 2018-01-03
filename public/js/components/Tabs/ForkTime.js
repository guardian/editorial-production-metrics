import React from 'react';
import Filters from '../Filters/Filters';
import ForkTimeCharts from '../Charts/ForkTimeCharts';

const ForkTime = ({filterVals, isUpdating, charts}) => {
    return (
        <div>
            <ForkTimeCharts
                charts={charts}
                filterVals={filterVals}
                isUpdating={isUpdating}
            />
        </div>
    );
};

export default ForkTime