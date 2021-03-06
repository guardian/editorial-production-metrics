import React from "react";
import { Th } from './index';
import cx from "classnames";

const renderSection = (leftTitle, children, propFn) =>
  React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      ...propFn(child, index),
      children:
        index === 0 && leftTitle
          ? [
              <Th key="header" rowSpan={React.Children.count(children)}>
                {leftTitle}
              </Th>
            ].concat(React.Children.toArray(child.props.children))
          : child.props.children
    })
  );

const Table = ({ head, children, centered, headTitle, bodyTitle, alternate }) => (
  <table className={cx({
    table: true,
    "table--centered": centered,
  })}>
    {head && (
      <thead className="table__head">
        {renderSection(headTitle, head, () => ({ headerRow: true }))}
      </thead>
    )}
    <tbody className="table__body">
      {renderSection(bodyTitle, children, (_, i) => ({ isOdd: alternate ? !(i % 2) : null }))}
    </tbody>
  </table>
);

export default Table;
