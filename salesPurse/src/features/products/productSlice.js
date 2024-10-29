import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    productName: "",
    price: null,
    quantity: null,
    picture: null,
  },
  reducers: {
    setProduct(state, action) {
      state.productName = action.payload.productName;
      state.price = action.payload.price;
      state.quantity = action.payload.quantity;
      state.picture = action.payload.picture;
    },
  },
});

export default productSlice.reducer;
export const { setProduct } = productSlice.actions;
