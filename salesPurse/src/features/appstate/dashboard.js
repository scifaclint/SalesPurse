import { createSlice } from "@reduxjs/toolkit";

const dashBoardSlice = createSlice({
  name: "dashboard",
  initialState: {
    userDetails: null,
    appState: "start",
  },
  reducers: {
    setDashboard(state, action) {
      state.userDetails = action.payload.userDetails;
      state.appState = action.payload.appState;
    },
  },
});

export default dashBoardSlice.reducer;

export const { setDashboard } = dashBoardSlice.actions;
