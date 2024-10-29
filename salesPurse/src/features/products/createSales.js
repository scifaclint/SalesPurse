import { createSlice } from "@reduxjs/toolkit";

const createSale = createSlice({
  name: "Sales",
  initialState: {
    customer: null,
    products: null,
    orderSummary: null,
  },
  reducers: {
    setSales(state, action) {
      state.customer = action.payload.customer;
      state.products = action.payload.products;
      state.orderSummary = action.payload.orderSummary;
    },
  },
});

export default createSale.reducer;
export const { setSales } = createSale.actions;
