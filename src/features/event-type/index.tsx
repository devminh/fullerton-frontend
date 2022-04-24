import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Input, message, Popconfirm, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchEventType } from "./eventTypeSlice";

export interface EventTypeFields {
  _id?: string;
  id?: string;
  label: string;
  value: string;
}

function EventTypePage() {
  const [eventTypeList, setEventTypeList] = useState<EventTypeFields[]>([]);
  const [triggerReload, setTriggerReload] = useState<number>(0);

  const dispatch = useAppDispatch();

  const [newLabel, setNewLabel] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");

  const handleCreateEventType = (eventType: EventTypeFields) => {
    axios
      .post("http://localhost:4000/api/event-types", eventType, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      })
      .then((res: any) => {
        if (res.data) {
          message.success(`Create event successfully`);
          setTriggerReload(triggerReload + 1);
          setNewLabel("");
          setNewValue("");

          dispatch(fetchEventType());
        }
      })
      .catch(() => {
        message.error(`Can not create the event`);
      });
  };

  const handleUpdateEventType = (eventType: EventTypeFields) => {
    axios
      .put("http://localhost:4000/api/event-types", eventType, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      })
      .then((res: any) => {
        if (res.data) {
          message.success(`Save event successfully`);
          dispatch(fetchEventType());
        }
      })
      .catch(() => {
        message.error(`Can not save the event`);
      });
  };

  const handleDeleteEventType = (id: string) => {
    axios
      .delete(`http://localhost:4000/api/event-types/?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      })
      .then((res: any) => {
        if (res.data) {
          message.success(`Delete event successfully`);
          dispatch(fetchEventType());
          setTriggerReload(triggerReload + 1);
        }
      })
      .catch(() => {
        message.error(`Can not delete the event`);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/event-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      })
      .then((res) => {
        if (res.data.length) {
          setEventTypeList(res.data);
        }
      });
  }, [triggerReload]);

  return (
    <div className="p-8 space-y-8">
      {eventTypeList.map((item, index) => {
        return (
          <div key={index} className="flex space-x-2">
            <Input
              placeholder="Enter label"
              defaultValue={item.label}
              onChange={(e) => {
                const tempEventTypeList = JSON.parse(
                  JSON.stringify(eventTypeList)
                );
                tempEventTypeList[index].label = e.target.value;
                setEventTypeList(tempEventTypeList);
              }}
            />

            <Input
              placeholder="Enter value"
              defaultValue={item.value}
              onChange={(e) => {
                const tempEventTypeList = JSON.parse(
                  JSON.stringify(eventTypeList)
                );
                tempEventTypeList[index].value = e.target.value;
                setEventTypeList(tempEventTypeList);
              }}
              suffix={
                <Tooltip title="E.g: health-talk">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
            <Button
              type="primary"
              onClick={() => {
                handleUpdateEventType({
                  id: item._id,
                  label: item.label,
                  value: item.value,
                });
              }}
            >
              Save
            </Button>
            <Popconfirm
              title="Are you sure to delete this event?"
              onConfirm={() => {
                handleDeleteEventType(item._id || "");
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </div>
        );
      })}

      <div className="flex space-x-2">
        <Input
          placeholder="Enter label"
          value={newLabel}
          onChange={(e) => {
            setNewLabel(e.target.value);
          }}
        />

        <Input
          placeholder="Enter value"
          value={newValue}
          onChange={(e) => {
            setNewValue(e.target.value);
          }}
          suffix={
            <Tooltip title="E.g: health-talk">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Button
          type="dashed"
          onClick={() => {
            handleCreateEventType({ label: newLabel, value: newValue });
          }}
        >
          Add new event type
        </Button>
      </div>
    </div>
  );
}

export default EventTypePage;
