import React from "react";
import { PieChart, Themes } from "formidable-charts";
import ChartTheme from "../ChartTheme/theme";
import ChartsToggles from "../ChartsToggles";
import Chart from "./Chart";

const customisedTheme = Object.assign({}, Themes.simple, ChartTheme);

const PieChartWrap = ({ error, isUpdating, data }) => (
  <Chart error={error} isUpdating={isUpdating}>
    <PieChart
      theme={customisedTheme}
      data={data}
    />
  </Chart>
);

export default PieChartWrap;
