import React from "react";
import { Table, Td, Tr, Th } from "./Table";

const BandedCount = ({ bands, title }) => (
  <div>
    <h3>{title}</h3>
    <Table
      centered
      alternate
      headTitle="Bands"
      bodyTitle="Count"
      head={
        <Tr>
          {bands.map(({ label }) => (
            <Th key={label}>
              {label}
            </Th>
          ))}
        </Tr>
      }
    >
      <Tr>
        {bands.map(({ label, count }) => (
          <Td key={label}>
            {count}
          </Td>
        ))}
      </Tr>
    </Table>
  </div>
);

export default BandedCount;
