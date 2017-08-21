import { State, Effect, Actions } from 'jumpstate';
import api from 'services/Api';

/* ------------- State Management ------------- */

Effect('fetchCommissioningDesksRedux', () => {
    api.getCommissioningDesks()
        .then(response => {
            const desksList = response.data;
            desksList.push('tracking/commissioningdesk/all');
            Actions.updateCommissioningDesks(desksList);
        })
        .catch(Actions.getCommissioningDesksFailed);
});

const commissioningDesksRedux = State({
    initial: {
        desksList: ['tracking/commissioningdesk/all']
    },

    updateCommissioningDesks(state, desksList) {
        return {
            desksList
        };
    },

    getCommissioningDesksFailed(state, error) {
        return {
            ...state,
            error: error.message
        };
    }
});

export default commissioningDesksRedux;