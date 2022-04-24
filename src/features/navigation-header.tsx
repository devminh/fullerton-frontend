import React, { useEffect } from "react";

import { Menu } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function NavigationHeader() {
  let navigate = useNavigate();

  useEffect(() => {
    if (
      !localStorage.getItem("user_id") &&
      window.location.pathname !== "/create-account"
    ) {
      navigate("/log-in");
    } else {
      navigate("/");
    }
  }, []);

  return (
    <Menu mode="horizontal" defaultSelectedKeys={["SubMenu"]}>
      <Menu.SubMenu
        key="SubMenu"
        title={
          <div className="flex items-center space-x-2">
            <UserOutlined />
            <div>{localStorage.getItem("user_name")} </div>
            <div>({localStorage.getItem("user_role") || "user"})</div>
          </div>
        }
      >
        <Menu.Item key="dashboard">
          <Link to="/">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="change-password">
          <Link to="/change-password"> Change account password</Link>
        </Menu.Item>

        <Menu.Item key="edit-event">
          <Link to="/edit-event-types">Edit list type of event</Link>
        </Menu.Item>

        <Menu.Item
          key="log-out"
          onClick={() => {
            axios.get(`http://localhost:4000/api/auth/logout/`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user_token")}`,
              },
            });
            navigate("/log-in");
            localStorage.removeItem("user_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_role");
          }}
        >
          Log-out
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
}

export default NavigationHeader;
