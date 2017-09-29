import React from 'react';
import { downloadCSV } from 'helpers/chartsHelpers';

const ChartsToggles = ({ filterVals, hasToggle, hasCsvButton, isStacked, data, chartType, toggleStackChart }) =>
    <div className='chart-toggles'>
        { 
            hasToggle &&
            <span>
                <input
                    type="checkbox"
                    defaultChecked={isStacked}
                    onChange={event => toggleStackChart(event.target.checked)}
                />
            Show percent ratio
            </span>
        }
        { hasCsvButton && <button onClick={() => downloadCSV(data, chartType, filterVals)}>Download CSV</button> }
    </div>;

export default ChartsToggles;