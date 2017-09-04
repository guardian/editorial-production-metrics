import { State } from 'jumpstate';
import moment from 'moment';

const updateFilterRedux = State({
    initial: {
        desk: 'tracking/commissioningdesk/all',
        productionOffice: 'all',
        startDate: moment().utc().startOf('day').subtract(7,'d'),
        endDate: moment().utc().endOf('day')
    },

    updateFilter(state, filterObj) {
        return filterObj;
    }
});

export default updateFilterRedux;