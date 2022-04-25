import React, { useEffect } from "react";

import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function NavigationHeader() {
  const cookies = new Cookies();

  let navigate = useNavigate();

  useEffect(() => {
    if (
      !localStorage.getItem("fullerton_user_id") &&
      window.location.pathname !== "/create-account"
    ) {
      navigate("/log-in");
    }
  }, []);

  return (
    <Menu mode="horizontal" defaultSelectedKeys={["SubMenu"]}>
      <Menu.SubMenu
        key="SubMenu"
        title={
          <div className="flex items-center space-x-2">
            <UserOutlined />
            <div>{localStorage.getItem("fullerton_user_name")} </div>
            <div>({localStorage.getItem("fullerton_user_role") || "user"})</div>
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
                Authorization: `Bearer ${cookies.get("fullerton_user_token")}`,
              },
            });
            cookies.set("fullerton_user_token", "", {
              path: "/",
              sameSite: "strict",
              maxAge: 600000, // 7 days
            });
            localStorage.removeItem("fullerton_user_id");
            localStorage.removeItem("fullerton_user_name");
            localStorage.removeItem("fullerton_user_role");
            navigate("/log-in");
            window.location.reload();
          }}
        >
          Log-out
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
}

export default NavigationHeader;
