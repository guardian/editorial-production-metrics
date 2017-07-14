const initialState = false;

export default function graphData(state = initialState, action) {
    switch (action.type) {
    case 'UPDATE_PROGRESS':
        return action.updatingBool;
    default:
        return state;
    }
}
