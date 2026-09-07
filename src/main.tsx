/// <reference path="./env.d.ts" />
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
// @ts-ignore: side-effect CSS import declaration handled in src/env.d.ts
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);