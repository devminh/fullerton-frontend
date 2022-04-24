import React from "react";
import "antd/dist/antd.css";

import { LoginPage } from "./account/login";
import { Route, Routes } from "react-router-dom";
import { CreateAccountPage } from "./account/create-account";
import BookingPage from "./booking";
import EventTypePage from "./event-type";
import { ChangePasswordPage } from "./account/change-password";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route path="/edit-event-types" element={<EventTypePage />} />

      {/* Account components */}
      <Route path="/log-in" element={<LoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
    </Routes>
  );
}

export default AppRouter;
