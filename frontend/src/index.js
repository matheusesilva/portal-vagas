// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports.js"; // Vamos criar este arquivo
import "./index.css";

Amplify.configure(awsconfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
