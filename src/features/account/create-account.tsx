import React, { useState } from "react";
import { Col, Row, Form, Input, Button, Select, message } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ERROR_DUPLICATED_USERNAME_CREATE,
  USER_ROLE_SELECT,
} from "../../constant";
import { omit } from "../utils";

const { Option } = Select;

export function CreateAccountPage() {
  let navigate = useNavigate();

  const onFinish = (values: any) => {
    const submitedValues = omit(values, "retype-password");
    axios
      .post("http://localhost:4000/api/auth/register", submitedValues)
      .then((res) => {
        if (res.data) {
          message.success("Success create");

          navigate("/log-in");
        }
      })
      .catch((error) => {
        if (
          error.response.data.message.includes(ERROR_DUPLICATED_USERNAME_CREATE)
        ) {
          message.error("Duplicated username");
        } else {
          message.error("Error request");
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
            onFinish={onFinish}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            initialValues={{ user_role: "user" }}
            autoComplete="off"
          >
            <div className="py-8 text-xl">Create new account</div>

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
              label="User role"
              name="user_role"
              rules={[{ required: true }]}
            >
              <Select>
                {USER_ROLE_SELECT.map((item, index) => {
                  return (
                    <Option value={item.value} key={index}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
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

            <Form.Item
              label="Retype Password"
              name="retype-password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please retype your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Create account
            </Button>

            <div className="mt-16">
              Already have account ? <Link to="/log-in">Sign in here</Link>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
}
