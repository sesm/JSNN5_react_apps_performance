import * as constants from './constants';

export const setFilter = value => ({
    type: constants.SET_FILTER,
    value
});

export const setSort = value => ({
    type: constants.SET_SORT,
    value
});
