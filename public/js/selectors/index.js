import moment from "moment";
import memoize from "lodash/memoize";

// If the state object is the same then just return the same obj
export const getFilters = memoize(({ filters }) => ({
  ...filters,
  values: {
    ...filters.values,
    startDate: moment(filters.values.startDate),
    endDate: moment(filters.values.endDate),
  }
}));
