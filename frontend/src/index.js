import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import './styles/global.css'
import DarkModeProvider from "./components/DarkMode";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <DarkModeProvider>
      <App />
</DarkModeProvider>
    </Provider>
);
