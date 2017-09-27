const initialState = false;

const isUpdating = (state = initialState, action) => {
    switch (action.type) {
    case 'TOGGLE_IS_UPDATING_CHARTS':
        return action.isUpdating;
    default:
        return state;
    }
};

export default isUpdating;