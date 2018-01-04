import React from "react";
import { bandName } from "../utils/BandUtils";
import { Table, Td, Tr, Th } from "./Table";

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

const BandedCount = ({ bands, title, noBandCount, noBandTitle }) => (
  <div>
    <h3>{title}</h3>
    <Table
      centered
      alternate
      headTitle="Bands"
      bodyTitle="Count"
      head={
        <Tr>
          {bands.map((band) => (
            <Th key={bandName(band)}>
              {bandName(band)}
            </Th>
          ))}
          {isNumeric(noBandCount) && (
            <Th key="no-band">
              {noBandTitle}
            </Th>
          )}
        </Tr>
      }
    >
      <Tr>
        {bands.map(({ min, max, count }) => (
          <Td key={`${min}-${max}`}>
            {count}
          </Td>
        ))}
        {isNumeric(noBandCount) && (
          <Td key="no-band">
            {noBandCount}
          </Td>
        )}
      </Tr>
    </Table>
  </div>
);

BandedCount.defaultProps = {
  noBandTitle: "No band",
  noBandCount: null,
};

export default BandedCount;
