import React from "react";
import ReactDOM from "react-dom";
import { builder } from "@builder.io/react";
import App from "src/App";
import * as serviceWorker from "src/serviceWorker";
import "./theme/index.scss";
import { safeLsGet, safeLsSet } from "./utils/safeLS";

const version = 2;
const storageVersion = parseInt(safeLsGet("version") || "");

if (process.env.REACT_APP_BUILDER_PUBLIC_KEY) {
  builder.init(process.env.REACT_APP_BUILDER_PUBLIC_KEY);
} else {
  throw new Error('Missing env builder varialbe BUILDER_PUBLIC_KEY');
}

if (
  typeof storageVersion === "undefined" ||
  storageVersion === null ||
  version !== storageVersion
) {
  localStorage.clear();
  safeLsSet("version", version.toString());
}

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000);
}

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.register();
