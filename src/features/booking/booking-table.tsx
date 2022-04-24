import React, { useState } from "react";
import {
  Button,
  Form,
  Modal,
  Popconfirm,
  Radio,
  Space,
  Table,
  Tag,
} from "antd";

import { BookingStatus, BookingTableProps } from "./interface";
import TextArea from "antd/lib/input/TextArea";

function BookingTable({
  accountRole,
  bookingData,
  setEditStatus,
}: BookingTableProps) {
  const [isShowApproveForm, setIsShowApproveForm] = useState<boolean>(false);
  const [isShowRejectForm, setIsShowRejectForm] = useState<boolean>(false);

  const [selectedDateProposed, setSelectedDateProposed] = useState<{
    dateProposed1: string;
    dateProposed2: string;
    dateProposed3: string;
  }>({ dateProposed1: "", dateProposed2: "", dateProposed3: "" });

  const [selectedRowId, setSelectedRowId] = useState<string>("");

  const [currentRejectedReason, setCurrentRejectedReason] =
    useState<string>("");

  const [currentShowOnlyRejectForm, setCurrentShowOnlyRejectForm] =
    useState<boolean>(false);

  const columns = [
    {
      title: "username",
      dataIndex: "user_name",
      key: "username",
    },
    {
      title: "Type of event",
      dataIndex: "event_type",
      key: "event_type",
    },
    {
      title: "Location of event",
      dataIndex: "event_location",
      key: "event_location",
    },
    {
      title: "Status",
      key: "status",
      render: (r: any) => {
        switch (r.status) {
          case BookingStatus.PENDING:
            return <Tag color="gold">{r.status}</Tag>;

          case BookingStatus.APPROVED:
            return <Tag color="green">{r.status}</Tag>;

          case BookingStatus.REJECTED:
            return <Tag color="red">{r.status}</Tag>;

          case BookingStatus.CANCELLED:
            return <Tag color="volcano">{r.status}</Tag>;

          default:
            break;
        }
      },
    },
    {
      title: "Proposed Datetime 1",
      key: "proposed_datetime_1",
      render: (r: any) => {
        return new Date(r.proposed_datetime_1 * 1000).toLocaleString();
      },
    },
    {
      title: "Proposed Datetime 2",
      key: "proposed_datetime_2",
      render: (r: any) => {
        return new Date(r.proposed_datetime_2 * 1000).toLocaleString();
      },
    },
    {
      title: "Proposed Datetime 3",
      key: "proposed_datetime_3",
      render: (r: any) => {
        return new Date(r.proposed_datetime_3 * 1000).toLocaleString();
      },
    },
    {
      title: "Selected datetime",
      key: "selected_datetime",
      render: (r: any) => {
        return r.selected_datetime
          ? new Date(r.selected_datetime * 1000).toLocaleString()
          : "";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (r: any) => {
        if (r.status === BookingStatus.PENDING) {
          if (accountRole === "user") {
            return (
              <Popconfirm
                title="Are you sure to cancel this booking ?"
                onConfirm={() => {
                  setEditStatus({
                    id: r._id,
                    status: BookingStatus.CANCELLED,
                  });
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button danger htmlType="button">
                  Cancel booking
                </Button>
              </Popconfirm>
            );
          } else if (accountRole === "admin") {
            return (
              <div className="flex space-x-2">
                <Button
                  type="primary"
                  htmlType="button"
                  onClick={() => {
                    setIsShowApproveForm(true);
                    setSelectedDateProposed({
                      dateProposed1: r.proposed_datetime_1,
                      dateProposed2: r.proposed_datetime_2,
                      dateProposed3: r.proposed_datetime_3,
                    });
                    setSelectedRowId(r._id);
                  }}
                >
                  Approve booking
                </Button>
                <Button
                  danger
                  type="primary"
                  htmlType="button"
                  onClick={() => {
                    setIsShowRejectForm(true);
                    setSelectedRowId(r._id);
                  }}
                >
                  Reject booking
                </Button>
              </div>
            );
          }
        }
        if (r.status === BookingStatus.REJECTED) {
          return (
            <Button
              type="dashed"
              htmlType="button"
              danger
              onClick={() => {
                setIsShowRejectForm(true);
                setCurrentRejectedReason(r.rejected_reason);
                setCurrentShowOnlyRejectForm(true);
              }}
            >
              Show reason for rejection
            </Button>
          );
        }
      },
    },
  ];

  return (
    <div className="overflow-auto">
      <Table
        dataSource={bookingData.map((item, index) => {
          return { ...item, key: index };
        })}
        columns={columns}
      />

      <ApprovedForm
        dateTime1={selectedDateProposed.dateProposed1}
        dateTime2={selectedDateProposed.dateProposed2}
        dateTime3={selectedDateProposed.dateProposed3}
        isShow={isShowApproveForm}
        setIsShow={setIsShowApproveForm}
        confirmApprove={(selectedDate) => {
          setEditStatus({
            id: selectedRowId,
            status: BookingStatus.APPROVED,
            selected_datetime: selectedDate,
          });
          setSelectedRowId("");
        }}
      />

      <RejectedForm
        isShow={isShowRejectForm}
        setIsShow={(isShow) => {
          if (isShow === false) {
            setCurrentRejectedReason("");
            setCurrentShowOnlyRejectForm(false);
          }
          setIsShowRejectForm(isShow);
        }}
        rejectedReason={currentRejectedReason}
        confirmReject={(rejectedReason) => {
          setEditStatus({
            id: selectedRowId,
            status: BookingStatus.REJECTED,
            rejected_reason: rejectedReason,
          });
          setSelectedRowId("");
        }}
        showOnly={currentShowOnlyRejectForm}
      />
    </div>
  );
}

const ApprovedForm = ({
  dateTime1,
  dateTime2,
  dateTime3,
  isShow,
  setIsShow,
  confirmApprove,
}: {
  dateTime1: string;
  dateTime2: string;
  dateTime3: string;
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
  confirmApprove: (selectedDate: string) => void;
}) => {
  return (
    <Modal
      title="Confirm date to approve booking"
      visible={isShow}
      onCancel={() => {
        setIsShow(false);
      }}
      footer={null}
    >
      <Form
        name="new-booking-form"
        onFinish={(values) => {
          confirmApprove(values.selected_datetime);
          setIsShow(false);
        }}
        autoComplete="off"
      >
        <Form.Item
          name="selected_datetime"
          rules={[
            { required: true, message: "Please select the booking date" },
          ]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={dateTime1}>
                Proposed Datetime 1 -{" "}
                {new Date(Number(dateTime1) * 1000).toLocaleString()}
              </Radio>
              <Radio value={dateTime2}>
                Proposed Datetime 2 -{" "}
                {new Date(Number(dateTime2) * 1000).toLocaleString()}
              </Radio>
              <Radio value={dateTime3}>
                Proposed Datetime 3 -{" "}
                {new Date(Number(dateTime3) * 1000).toLocaleString()}
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <div className="flex mt-4 space-x-4">
          <Button type="primary" htmlType="submit">
            Approve
          </Button>
          <Button htmlType="button" onClick={() => setIsShow(false)}>
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const RejectedForm = ({
  isShow,
  setIsShow,
  rejectedReason,
  confirmReject,
  showOnly,
}: {
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
  rejectedReason: string;
  confirmReject: (rejectedReason: string) => void;
  showOnly: boolean; //for showing reason of rejected booking
}) => {
  return (
    <Modal
      title={
        showOnly ? "Reason for rejection" : "Confirm the reason for rejection"
      }
      visible={isShow}
      onCancel={() => {
        setIsShow(false);
      }}
      footer={null}
    >
      {showOnly ? (
        <TextArea rows={6} disabled={showOnly} value={rejectedReason} />
      ) : (
        <Form
          name="new-booking-form"
          onFinish={(values) => {
            confirmReject(values.rejected_reason);
            setIsShow(false);
          }}
        >
          <Form.Item
            name="rejected_reason"
            rules={[
              {
                required: true,
                message: "Please input the reason for rejection",
              },
            ]}
          >
            <TextArea rows={6} disabled={showOnly} />
          </Form.Item>

          <div className="flex mt-4 space-x-4">
            <Button type="primary" htmlType="submit">
              Reject
            </Button>

            <Button htmlType="button" onClick={() => setIsShow(false)}>
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default BookingTable;
