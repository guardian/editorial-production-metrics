import { State } from 'jumpstate';

const updateProgressRedux = State({
    initial: false,

    toggleIsUpdatingCharts(state, isUpdating) {
        return isUpdating;
    }
});

export default updateProgressRedux;