// main.tsx 或 main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
// import { BrowserRouter } from "react-router-dom"
import { HashRouter } from "react-router-dom"

import App from "./App"
import "./style/style.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
