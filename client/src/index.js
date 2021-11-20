import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
//REDUX
import { createStore, applyMiddleware, compose } from "redux";

import rootReducer from "./store/reducers";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
//Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const composeEnchancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnchancer(applyMiddleware(thunk))
);

const stripePromise = loadStripe(
  "pk_test_51IEz6wBsr9DaYDeOWrHMhDk9pyPxI3vdMLeKJ3VLDJeboqHwljixDO0S4OFj1Xiyb010GqWEz1YJZjY5QeRDLC1h00MWkrNwuv"
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
