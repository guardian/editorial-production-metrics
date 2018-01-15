import moment from "moment";
import { createSelector } from "reselect";

const getFilters = ({ filters }) => filters;

export const getFilterVals = createSelector(getFilters, ({ values }) => ({
    ...values,
    startDate: moment(values.startDate),
    endDate: moment(values.endDate)
}));

export const getFilterStatuses = createSelector(
    getFilters,
    ({ statuses }) => statuses
);
