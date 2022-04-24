import React from "react";

import { Button, Checkbox, DatePicker, Form, Input, Modal, Select } from "antd";
import { CreateBookingFormProps } from "./interface";
import { omit } from "../utils";

const { Option } = Select;

function CreateBookingForm({
  isShow,
  setIsShow,
  eventTypeOptions,
  submitBooking,
}: CreateBookingFormProps) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Create a new booking"
      visible={isShow}
      footer={null}
      onCancel={() => setIsShow(!isShow)}
    >
      <Form
        name="new-booking-form"
        onFinish={(values) => {
          const submitedValues = omit(values, "is_confirm_created");

          submitBooking({
            ...submitedValues,
            proposed_datetime_1: submitedValues.proposed_datetime_1.unix(),
            proposed_datetime_2: submitedValues.proposed_datetime_2.unix(),
            proposed_datetime_3: submitedValues.proposed_datetime_3.unix(),
          });

          form.resetFields();
        }}
        form={form}
        autoComplete="off"
      >
        <Form.Item
          label="Type of event"
          name="event_type"
          rules={[
            { required: true, message: "Please input the type of event" },
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {eventTypeOptions.map((item, index) => {
              return (
                <Option value={item.value} key={index}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Location of event"
          name="event_location"
          rules={[
            { required: true, message: "Please input the location of event" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Proposed Datetime 1"
          name="proposed_datetime_1"
          rules={[
            { required: true, message: "Please input the Proposed Datetime 1" },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          label="Proposed Datetime 2"
          name="proposed_datetime_2"
          rules={[
            { required: true, message: "Please input the Proposed Datetime 2" },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          label="Proposed Datetime 3"
          name="proposed_datetime_3"
          rules={[
            { required: true, message: "Please input the Proposed Datetime 3" },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          name="is_confirm_created"
          valuePropName="checked"
          rules={[
            { required: true, message: "Please confirm to create new booking" },
          ]}
        >
          <Checkbox>Confirm to create new booking</Checkbox>
        </Form.Item>

        <div className="flex mt-4 space-x-4">
          <Button type="primary" htmlType="submit">
            Create new booking
          </Button>
          <Button htmlType="button" onClick={() => setIsShow(!isShow)}>
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default CreateBookingForm;
