import React from "react";
import "antd/dist/antd.css";

import "./App.css";

import AppRouter from "./features/router";

import { BrowserRouter } from "react-router-dom";
import NavigationHeader from "./features/navigation-header";
import { useAppDispatch } from "./app/hooks";
import { fetchEventType } from "./features/event-type/eventTypeSlice";

function App() {
  const dispatch = useAppDispatch();

  if (localStorage.getItem("fullerton_user_id")) {
    dispatch(fetchEventType()); //fetch eventType and stored
    console.log("fetch at app.tsx");
  }
  document.title = "Fullerton application";

  return (
    <BrowserRouter>
      {window.location.pathname !== "/create-account" &&
        window.location.pathname !== "/log-in" && <NavigationHeader />}

      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
