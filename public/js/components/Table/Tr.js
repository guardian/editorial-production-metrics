import React from "react";

const baseClass = headerRow => `table__${headerRow ? `header-` : ""}row`;

const Tr = ({ children, headerRow, isOdd, ...trProps }) => (
  <tr
    className={`${baseClass(headerRow)} ${
      isOdd !== null
        ? `${baseClass(headerRow)}--${isOdd ? "odd" : "even"}`
        : ``
    }`}
    {...trProps}
  >
    {children}
  </tr>
);

Tr.defaultProps = {
  isOdd: null,
};

export default Tr;
