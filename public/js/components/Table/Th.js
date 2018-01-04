import React from "react";

const Th = ({ children, ...thProps }) => (
  <th className="table__item table__item--header" {...thProps}>{children}</th>
);

export default Th;
