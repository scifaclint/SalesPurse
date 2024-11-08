import { createSlice } from "@reduxjs/toolkit";

const dashBoardSlice = createSlice({
  name: "dashboard",
  initialState: {
    userDetails: null,
    appState: "",
  },
  reducers: {
    setDashboard(state, action) {
      state.userDetails = action.payload.userDetails;
    },
  },
});

export default dashBoardSlice.reducer;

export const { setDashboard } = dashBoardSlice.actions;
