// Imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import logger from "redux-logger";

// Redux
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";

// Firebase
import { reactReduxFirebase } from "react-redux-firebase";
import { reduxFirestore } from "redux-firestore";

//Other Imports
import App from "./components/App";
import * as serviceWorker from './serviceWorker';
import reducers from "./components/reducers";
import promise from "redux-promise-middleware";
import firebase from "./config/firebase";

const rrfConfig = {
  userProfile: "users",
  attachAuthIsReady: true,
  useFirestoreForProfile: true,
  logErrors: true,
  enableLogging: true
};

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

let middleware = [ promise, logger ];
const store = createStoreWithFirebase(
  reducers,
  {},
  applyMiddleware(...middleware)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();