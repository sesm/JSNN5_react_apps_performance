import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux';
import { Provider } from 'react-redux';
import * as constants from './constants';
import createDebounce from 'redux-debounced';

import data from './data/data2k';

import Perf from 'react-addons-perf';
window.Perf = Perf;

const items = (state = data, action) => {
    return state
};
const sort = (state = 'id', action) => {
    switch(action.type) {
        case constants.SET_SORT:
            return action.value;
        default:
            return state;
    }
};
const filter = (state = '', action) => {
    switch(action.type) {
        case constants.SET_FILTER:
            return action.value;
        default:
            return state;
    }
};

const reducer = combineReducers({
    items,
    sort,
    filter
});

const createStoreWithMiddleware = applyMiddleware(
    createDebounce()
)(createStore);

const store = createStoreWithMiddleware(reducer);

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
  ,
  document.getElementById('root')
);
