import { State } from 'jumpstate';
import moment from 'moment';

const updateFilterRedux = State({
    initial: {
        desk: 'tracking/commissioningdesk/all',
        startDate: moment().subtract(7,'d'),
        endDate: moment()
    },

    updateFilter(state, filterObj) {
        return filterObj;
    }
});

export default updateFilterRedux;