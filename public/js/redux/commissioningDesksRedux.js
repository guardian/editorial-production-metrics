import { State, Effect, Actions } from 'jumpstate';
import api from 'services/Api';

/* ------------- State Management ------------- */

Effect('fetchCommissioningDesksRedux', (filterObj) => {
    api.getCommissioningDesks()
        .then(response => {
            const desksList = response.data;
            desksList.push('tracking/commissioningdesk/all');
            Actions.updateCommissioningDesks(desksList);
        })
        .catch((error) => {
            Actions.getCommissioningDesksFailed(error);
        });
});

const commissioningDesksRedux = State({
    initial: {
        desksList: ['tracking/commissioningdesk/all']
    },

    updateCommissioningDesks(state, desksList) {
        return {
            desksList
        }
    },

    getCommissioningDesksFailed(state, error) {
        return {
            desksList: state.desksList,
            error: error.message
        };
    }
});

export default commissioningDesksRedux;