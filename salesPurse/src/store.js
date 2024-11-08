import { configureStore } from "@reduxjs/toolkit";

import dashboardReducer from "./features/appstate/dashboard";
import salesReducer from "./features/products/createSales";
import productReducer from "./features/products/productSlice";
import accountReducer from "./features/account/accountSlice";
const store = configureStore({
  reducer: {
    account: accountReducer,
    dashboard: dashboardReducer,
    sales: salesReducer,
    products: productReducer,
  },
});

// Debug subscriber
store.subscribe(() => {
  console.log('Store updated:', store.getState());
});

export default store;
