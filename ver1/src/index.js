import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
    createStore,
    combineReducers
} from 'redux';
import { Provider } from 'react-redux';
import * as constants from './constants';

import data from './data/data500';

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

const store = createStore(
    reducer
);

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
  ,
  document.getElementById('root')
);
