import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import { createStore, applyMiddleware } from 'redux';

import LevelMap from './components/LevelMap';
import reducers from './reducers';
import { nextLevel } from './actions'
import {isConnected} from './global/levelGenerator'
import {setNextColors, invertColors} from './presentation/animations'

import $ from 'jquery'

const store = createStore(reducers, {});

const render = () => {
    ReactDOM.render(
    <Provider store={store}>
      <LevelMap />
    </Provider>,
    document.getElementById('root')
  );
};

var levelIsConnected = false;

store.subscribe(render);
store.subscribe(() => {
  levelIsConnected = isConnected(store.getState().level.map)
  if (levelIsConnected)
    invertColors();
  if (store.getState().lastAction.type == 'NEXT_LEVEL')
    setNextColors();
  console.log(store.getState().lastAction.type);
  console.log(store.getState())
});

store.dispatch(nextLevel());

$(document).ready(() => {
    $(document.body).on('click', (event) => {
      if (levelIsConnected) {
        store.dispatch(nextLevel());
        event.stopPropagation();
      }
    });
});
