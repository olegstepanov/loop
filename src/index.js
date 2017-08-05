import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import { createStore, applyMiddleware } from 'redux';

import LevelMap from './components/LevelMap';
import reducers from './reducers';
import { nextLevel } from './actions'

const store = createStore(reducers, {});

const render = () => {
    ReactDOM.render(
    <Provider store={store}>
      <LevelMap />
    </Provider>,
    document.getElementById('root')
  );
};

store.subscribe(render);
store.subscribe(() => {
  console.log(store.getState().lastAction.type);
  console.log(store.getState())
});

store.dispatch(nextLevel());
