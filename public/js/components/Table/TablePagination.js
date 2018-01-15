import React from "react";
import cx from "classnames";

const TablePagination = ({
    onPrev,
    onNext,
    onPage,
    prevDisabled,
    nextDisabled,
    pageIndex,
    visiblePageIndices,
    pageCount
}) => (
    <div className="table__pagination">
        <button
            className={cx({
                "table__pagination-btn": true,
                "table__pagination-btn--prev": true,
                "table__pagination-btn--disabled": prevDisabled
            })}
            disabled={prevDisabled}
            onClick={onPrev}
        >
            Prev
        </button>
        {visiblePageIndices.map(index => (
            <button
                key={index}
                disabled={index === pageIndex}
                className={cx({
                    "table__pagination-btn": true,
                    "table__pagination-btn--page": true,
                    "table__pagination-btn--selected": index === pageIndex,
                    "table__pagination-btn--disabled": index === pageIndex
                })}
                onClick={() => onPage(index)}
            >
                {index + 1}{index === pageIndex ? `/${pageCount}` : ""}
            </button>
        ))}
        <button
            className={cx({
                "table__pagination-btn": true,
                "table__pagination-btn--next": true,
                "table__pagination-btn--disabled": nextDisabled
            })}
            disabled={nextDisabled}
            onClick={onNext}
        >
            Next
        </button>
    </div>
);

export default TablePagination;
