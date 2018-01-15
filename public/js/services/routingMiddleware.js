import { push } from 'react-router-redux';
import { runFilter } from 'actions';
import _isEqual from 'lodash/isEqual';
import { objectToParamString, paramStringToObject } from 'helpers/routingHelpers';
export const updateUrlFromStateChangeMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    const prevState = getState();
    let result = next(action);
    const newState = getState();
    // this formatting is needed as the dates in the state are moment objects, but need to be strings in the url
    const newStateFormattedFilters = {
        ...newState.filters.values,
        startDate: newState.filters.values.startDate,
        endDate: newState.filters.values.endDate
    };

    if (!_isEqual(prevState.filters.values, newState.filters.values)) {
        const location = newState.routing.location;
        const paramString = `?${objectToParamString(newStateFormattedFilters)}`;

        if (location && paramString !== location.search) {
            const newLocation = { ...location, search: paramString || ''};
            const updateAction = push(newLocation);
            dispatch(updateAction);
        }
    }
    
    return result;
};

export const updateStateFromUrlChangeMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    const results = next(action);
    const newState = getState();

    if (action.type === '@@router/LOCATION_CHANGE') {
        const filterObj = paramStringToObject(newState.routing.location.search);

        const nextFilterVals = {
            ...newState.filters.values,
            ...filterObj
        };

        if (!_isEqual(newState.filters.values, nextFilterVals) || !newState.filters.loaded) {
            dispatch(runFilter(nextFilterVals));
        }
    }

    return results;
};