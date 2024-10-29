import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    name: "",
    password: "",
    phone: "",
    type: "",
  },
  reducers: {
    addUser(state, action) {
      state.name = action.payload.name;
      state.password = action.payload.password;
      state.phone = action.payload.phone;
      state.type = action.payload.type;
    },
  },
});

export default accountSlice.reducer;
export const { addUser } = accountSlice.actions;
