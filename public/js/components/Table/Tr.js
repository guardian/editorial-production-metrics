import React from "react";
import cx from "classnames";

const Tr = ({ children, headerRow, isOdd, ...trProps }) => (
  <tr
    className={cx({
      "table__row": true,
      "table__row--header": headerRow,
      "table__row--odd": isOdd,
      "table__row--even": !isOdd,
    })}
    {...trProps}
  >
    {children}
  </tr>
);

Tr.defaultProps = {
  isOdd: null,
};

export default Tr;
