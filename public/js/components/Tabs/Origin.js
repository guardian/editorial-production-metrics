import React from 'react';
import OriginCharts from '../Charts/OriginCharts';

const Origin = ({filterVals, isUpdating, charts, toggleStackChart}) => {
    return (
        <div>
            <OriginCharts
                charts={charts}
                filterVals={filterVals}
                toggleStackChart={toggleStackChart}
                isUpdating={isUpdating}
            />
        </div>
    );
};

export default Origin
