import * as constants from './constants';

export const setFilter = value => ({
    type: constants.SET_FILTER,
    value,
    meta: {
        debounce: {
            time: 100
        }
    }
 });

export const setSort = value => ({
    type: constants.SET_SORT,
    value
});
