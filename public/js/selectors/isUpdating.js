/*
TODO: to keep the structure of selectors consistent (files for reducers) this
func is in a single file, which seems overkill! In future we could bundle flags
into one reducer and keep all of them here.
*/

export const getIsUpdating = ({ isUpdating }) => isUpdating;
