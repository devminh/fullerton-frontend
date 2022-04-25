import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import eventTypeReducer from "../features/event-type/eventTypeSlice";

export const store = configureStore({
  reducer: {
    eventTypeReducer: eventTypeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
