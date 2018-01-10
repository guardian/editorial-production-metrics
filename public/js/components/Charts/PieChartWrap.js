import React from "react";
import { PieChart, Themes } from "formidable-charts";
import ChartTheme from "../ChartTheme/theme";
import Chart from "./Chart";

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const PieChartWrap = ({ error, isUpdating, data, title }) => (
  <Chart error={error} isUpdating={isUpdating}>
    <h3>
      {title}
    </h3>
    <PieChart
      height={300}
      theme={customisedTheme}
      data={data}
    />
  </Chart>
);

export default PieChartWrap;
