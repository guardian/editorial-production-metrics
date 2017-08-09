import { State } from 'jumpstate';
import moment from 'moment';

const updateFilterRedux = State({
    initial: {
        office: 'all',
        desk: 'all',
        section: 'all',
        startDate: moment().subtract(7,'d'),
        endDate: moment()
    },

    updateFilter(state, filterObj) {
        return filterObj;
    }
});

export default updateFilterRedux;