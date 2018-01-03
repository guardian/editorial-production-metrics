import React from 'react';
import Filters from '../Filters/Filters';
import ForkTimeCharts from '../Charts/ForkTimeCharts';

const ForkTime = ({filterVals, isUpdating, charts, toggleStackChart}) => {
    return (
        <div>
            <ForkTimeCharts
                charts={charts}
                filterVals={filterVals}
                toggleStackChart={toggleStackChart}
                isUpdating={isUpdating}
            />
        </div>
    );
};

export default ForkTime