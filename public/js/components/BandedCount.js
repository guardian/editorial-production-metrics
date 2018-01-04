import React from "react";
import { bandName } from "../utils/BandUtils";

const BandedCount = ({ data }) => (
  <table>
    <thead>
      <tr>
        {data.map((band) => (
          <th key={bandName(band)}>
            {bandName(band)}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {data.map(({ min, max, count }) => (
          <td key={`${min}-${max}`}>
            {count}
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);

export default BandedCount;
