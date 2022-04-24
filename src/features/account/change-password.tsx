import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ERROR_DUPLICATED_USERNAME_CREATE } from "../../constant";
import { omit } from "../utils";

export function ChangePasswordPage() {
  let navigate = useNavigate();

  const onFinish = (values: any) => {
    let submitedValues = omit(values, "retype-password");
    submitedValues = {
      ...submitedValues,
      id: localStorage.getItem("user_id"),
    };
    axios
      .post("http://localhost:4000/api/auth/change-password", submitedValues, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        if (res.data) {
          message.success("Change password successfully");

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
    <div className="flex items-center justify-center h-full">
      <Form
        name="basic"
        onFinish={onFinish}
        initialValues={{ user_role: "user" }}
        autoComplete="off"
      >
        <div className="py-8 text-xl">Change password</div>

        <Form.Item
          label="Current password"
          name="current_password"
          rules={[
            { required: true, message: "Please input your current password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Retype new password"
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
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Change password
        </Button>
      </Form>
    </div>
  );
}
