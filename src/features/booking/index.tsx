import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingTable from "./booking-table";
import { Alert, Button, Input, message, notification, Pagination } from "antd";
import CreateBookingForm from "./create-booking-form";
import { PlusOutlined } from "@ant-design/icons";
import { BookingStatus, CreateBookingFields } from "./interface";
import { useAppSelector } from "../../app/hooks";
import { eventTypeList } from "../event-type/eventTypeSlice";
import { EventTypeFields } from "../event-type";
import SelectField from "../../components/select-field";
import { STATUS_BOOKING_SELECT } from "../../constant";
import { debounce, omit } from "lodash";

function BookingPage() {
  const [accountRole, setAccountRole] = useState<string>("");
  const [isShowCreateForm, setIsShowCreateForm] = useState<boolean>(false);

  const [tableData, setTableData] = useState([]);
  const [filterTable, setFilterTable] = useState<any>({});
  const [totalPage, setTotalPage] = useState<number>(0);

  const [triggerReload, setTriggerReload] = useState<number>(0);

  const eventTypeOptions: EventTypeFields[] = useAppSelector(eventTypeList); //fetch using from redux store

  const handleCreateNewBooking = (bookingData: CreateBookingFields) => {
    setIsShowCreateForm(false);
    const dataPost = {
      user_id: localStorage.getItem("user_id"),
      user_name: localStorage.getItem("user_name"),
      status: BookingStatus.PENDING,
      ...bookingData,
      event_type: eventTypeOptions.find(
        (item) => item.value === bookingData.event_type
      )?.label,
    };
    axios
      .post("http://localhost:4000/api/bookings", dataPost)
      .then((res: any) => {
        if (res.data.id) {
          notification.open({
            message: (
              <Alert
                message="Create new booking successfully"
                type="success"
                showIcon
              />
            ),
          });
          setTriggerReload(triggerReload + 1);
        }
      })
      .catch(() => {});
  };

  const handleEditStatus = (editStatus: {
    id: string;
    status: BookingStatus;
  }) => {
    axios
      .put("http://localhost:4000/api/bookings/", editStatus)
      .then((res: any) => {
        if (res.data) {
          message.success(`This booking is ${editStatus.status} `);
          setTriggerReload(triggerReload + 1);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/bookings/booking-list", filterTable)
      .then((res: any) => {
        setTableData(res.data.bookings);
        setTotalPage(res.data.total);
      })
      .catch(() => {});
  }, [filterTable, triggerReload]);

  useEffect(() => {
    if (localStorage.getItem("user_role")) {
      setAccountRole(localStorage.getItem("user_role") || "user");
    }

    if (localStorage.getItem("user_role") === "user") {
      setFilterTable({
        user_id: localStorage.getItem("user_id"),
      });
    }
  }, []);

  return (
    <div className="p-8 space-y-16">
      <div className="float-right">
        {accountRole === "user" ? (
          <Button
            type="primary"
            htmlType="button"
            onClick={() => setIsShowCreateForm(true)}
          >
            <div className="flex items-center space-x-2">
              <PlusOutlined />
              <div> Create a new booking</div>
            </div>
          </Button>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-wrap space-x-2 space-y-2">
        <div></div>
        {accountRole === "admin" && (
          <div>
            <div>username</div>
            <Input
              placeholder="username"
              defaultValue={""}
              onChange={(e) => {
                if (e.target.value) {
                  const debounced = debounce(function () {
                    setFilterTable({
                      ...filterTable,
                      user_name: e.target.value,
                    });
                  }, 1000);
                  debounced();
                } else {
                  const tempFilterTable = omit(filterTable, ["user_name"]);
                  setFilterTable(tempFilterTable);
                }
              }}
            />
          </div>
        )}

        <div>
          <div>Type of event</div>
          <SelectField
            placeholder="Type of event"
            options={[{ label: "All", value: "all" }, ...eventTypeOptions]}
            onSelect={(value) => {
              if (value === "all") {
                const tempFilterTable = omit(filterTable, ["event_type"]);
                setFilterTable(tempFilterTable);
              } else {
                setFilterTable({
                  ...filterTable,
                  event_type: eventTypeOptions.find(
                    (item) => item.value === value
                  )?.label,
                });
              }
            }}
          />
        </div>
        <div>
          <div>Location of event</div>
          <Input
            placeholder="Location of event"
            defaultValue={""}
            onChange={(e) => {
              if (e.target.value) {
                const debounced = debounce(function () {
                  setFilterTable({
                    ...filterTable,
                    event_location: e.target.value,
                  });
                }, 1000);
                debounced();
              } else {
                const tempFilterTable = omit(filterTable, ["event_location"]);
                setFilterTable(tempFilterTable);
              }
            }}
          />
        </div>
        <div>
          <div>Status</div>
          <SelectField
            placeholder="Status"
            options={STATUS_BOOKING_SELECT}
            onSelect={(value) => {
              if (value === "all") {
                const tempFilterTable = omit(filterTable, ["status"]);
                setFilterTable(tempFilterTable);
              } else {
                setFilterTable({
                  ...filterTable,
                  status: value,
                });
              }
            }}
          />
        </div>
      </div>

      <BookingTable
        accountRole={accountRole}
        bookingData={tableData}
        setEditStatus={handleEditStatus}
      />
      <div className="flex justify-end">
        <Pagination
          total={totalPage}
          showTotal={(total) => `Total ${total} bookings`}
          defaultPageSize={10}
          defaultCurrent={1}
          onChange={(page, pageSize) => {
            const limit = pageSize;
            const offset = (page - 1) * pageSize;

            setFilterTable({ ...filterTable, limit: limit, offset: offset });
          }}
          showSizeChanger
        />
      </div>

      <CreateBookingForm
        isShow={isShowCreateForm}
        setIsShow={setIsShowCreateForm}
        eventTypeOptions={eventTypeOptions}
        submitBooking={handleCreateNewBooking}
      />
    </div>
  );
}

export default BookingPage;
