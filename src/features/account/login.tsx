import React from "react";
import { Col, Row, Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

export function LoginPage() {
  let navigate = useNavigate();
  const cookies = new Cookies();

  const onFinish = (values: any) => {
    axios
      .post("http://localhost:4000/api/auth/login", values)
      .then((res) => {
        const data = res.data;
        if (data.error === false) {
          cookies.set("fullerton_user_token", data.data.token, {
            path: "/",
            sameSite: "strict",
            maxAge: 600000, // 7 days
          });

          localStorage.setItem("fullerton_user_id", data.data.user._id);
          localStorage.setItem("fullerton_user_name", data.data.user.user_name);
          localStorage.setItem("fullerton_user_role", data.data.user.user_role);
          navigate("/");
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          message.error(error.response.data.message);
        }
      });
  };

  return (
    <Row className="h-screen">
      <Col md={12}>
        <div className="flex items-center justify-center h-full">
          <img
            src="https://www.fullertonhealth.com/wp-content/uploads/2021/06/logo-fullerton-health-small.png"
            alt=""
            style={{ width: "60%" }}
          />
        </div>
      </Col>
      <Col md={12}>
        <div className="flex items-center justify-center h-full">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            autoComplete="off"
            style={{ marginLeft: "16px", marginRight: "16px" }}
          >
            <Form.Item
              label="Username"
              name="user_name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <div className="float-right">
              <Button type="primary" htmlType="submit">
                Log-in
              </Button>
            </div>
            <div className="mt-16">
              <Link to="/create-account">Create account</Link>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
}
