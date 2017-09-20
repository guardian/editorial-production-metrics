import { replace } from 'react-router-redux';
import actions from 'actions';
import _isEqual from 'lodash/isEqual';
import moment from 'moment';
import { objectToParamString, paramStringToObject } from 'helpers/routingHelpers';
export const updateUrlFromStateChangeMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    const prevState = getState();
    let result = next(action);
    const newState = getState();
    // this formatting is needed as the dates in the state are moment objects, but need to be strings in the url
    const newStateFormattedFilters = { ...newState.filterVals,  startDate: newState.filterVals.startDate.format(), endDate: newState.filterVals.endDate.format() };

    if (!_isEqual(prevState.filterVals, newState.filterVals)) {
        const location = newState.routing.location;
        const paramString = `?${objectToParamString(newStateFormattedFilters)}`;

        if (location && paramString !== location.search) {
            const newLocation = { ...location, search: paramString || ''};
            const updateAction = replace(newLocation);
            dispatch(updateAction);
        }
    }
    
    return result;
};

export const updateStateFromUrlChangeMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    next(action);
    const newState = getState();

    if (action.type === '@@router/LOCATION_CHANGE') {
        const filterObj = paramStringToObject(newState.routing.location.search);
        filterObj['startDate'] = !newState.routing.location.search ? moment(filterObj['startDate']).subtract(7,'d').utc().startOf('day') : moment(filterObj['startDate']).utc().startOf('day');
        filterObj['endDate'] = moment(filterObj['endDate']).utc().endOf('day');

        if (!_isEqual(filterObj, newState.filterVals)) {
            dispatch(actions.filterDesk(filterObj));
        }
    }
};