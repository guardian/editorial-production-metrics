import React from "react";

const Td = ({ children, ...tdProps }) => (
  <td className="table__item" {...tdProps}>{children}</td>
);

export default Td;
