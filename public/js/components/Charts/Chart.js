import React from 'react';

const getClassName = (error, isUpdating) => {
    if (error) {
        return 'chart-wrap chart-wrap__error';
    } else {
        return isUpdating ? 'chart-wrap chart-wrap__updating' : 'chart-wrap';
    }
};

const Chart = ({children, error, isUpdating}) => {

    return (
        <div className={getClassName(error, isUpdating)}>
            {children}
        </div>
    );
};

export default Chart;