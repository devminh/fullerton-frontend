import { EventTypeFields } from "../event-type";

export interface BookingFields {
  user_id: string;
  user_name: string;
  event_type: string;
  event_location: string;
  proposed_datetime_1: string;
  proposed_datetime_2: string;
  proposed_datetime_3: string;
  status: string;
  rejected_reason?: string;
}

export interface CreateBookingFields {
  event_type: string;
  event_location: string;
  proposed_datetime_1: string;
  proposed_datetime_2: string;
  proposed_datetime_3: string;
}

export interface BookingTableProps {
  accountRole: string;
  bookingData: BookingFields[];
  setEditStatus: (editStatus: EditStatusFields) => void;
}

export interface CreateBookingFormProps {
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
  eventTypeOptions: EventTypeFields[];
  submitBooking: (bookingData: CreateBookingFields) => void;
}

export enum BookingStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export interface EditStatusFields {
  id: string;
  status: BookingStatus;
  rejected_reason?: string;
  selected_datetime?: string;
}
