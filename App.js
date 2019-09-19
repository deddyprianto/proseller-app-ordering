/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {Provider} from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

import Main from "./src/main";
import persist from "./src/config/store";

const persistStore = persist();

export default class App extends Component {
  render() {
    return (
      <Provider store={persistStore.store}>
        <PersistGate loading={null} persistor={persistStore.persistor}>
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}
