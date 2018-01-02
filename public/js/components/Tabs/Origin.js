import React from 'react';
import Filters from '../Filters/Filters';
import Charts from '../Charts/Charts';

const Origin = ({filterVals, isUpdating, desks, filterDesk, charts, toggleStackChart}) => {
    return (
        <div>
            <Filters
                filterVals={filterVals}
                isUpdating={isUpdating}
                desks={desks}
                filterDesk={filterDesk}
            />
            <Charts
                charts={charts}
                filterVals={filterVals}
                toggleStackChart={toggleStackChart}
                isUpdating={isUpdating}
            />
        </div>
    );
};

export default Origin