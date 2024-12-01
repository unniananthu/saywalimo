import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "react-toastify/dist/ReactToastify.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
console.log(stripePromise);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Elements stripe={stripePromise}>
    <Provider store={store}>
      <BrowserRouter>
        {/* <React.StrictMode> */}
        <App />
        {/* </React.StrictMode> */}
      </BrowserRouter>
    </Provider>
  </Elements>
);

reportWebVitals();
