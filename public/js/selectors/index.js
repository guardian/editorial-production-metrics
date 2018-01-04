import moment from "moment";
import memoize from "lodash/memoize";

// If the state object is the same then just return the same obj
export const getFilters = memoize(({ filterVals }) => ({
  ...filterVals,
  startDate: moment(filterVals.startDate),
  endDate: moment(filterVals.endDate),
}));
