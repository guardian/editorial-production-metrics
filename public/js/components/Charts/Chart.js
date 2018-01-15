import React from 'react';
import cx from "classnames";

const Chart = ({children, error, isUpdating}) => (
    <div className={cx({
        "chart-wrap": true,
        "chart-wrap__error": error,
        "chart-wrap__updating": isUpdating
    })}>
        {children}
    </div>
);

export default Chart;