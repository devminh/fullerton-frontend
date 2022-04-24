import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

// First, create the thunk
export const fetchEventType = createAsyncThunk(
  "eventTypes/fetchEventType",
  async () => {
    console.log("fetch event types");
    const response = await axios.get(`http://localhost:4000/api/event-types`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    });
    return response.data;
  }
);

// Then, handle actions in your reducers:
const eventTypeSlice = createSlice({
  name: "eventTypeSlice",
  initialState: { eventTypes: [], status: "idle" },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventType.fulfilled, (state, action) => {
        state.status = "idle";
        state.eventTypes = action.payload;
      });
  },
});

export const eventTypeList = (state: RootState) =>
  state.eventTypeReducer.eventTypes;

export default eventTypeSlice.reducer;
