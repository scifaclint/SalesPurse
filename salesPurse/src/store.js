import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "./features/account/accountSlice";
import dashboardReducer from "./features/appstate/dashboard";
import salesReducer from "./features/products/createSales";
import productReducer from "./features/products/productSlice";

const store = configureStore({
  reducer: {
    account: accountReducer,
    dashboard: dashboardReducer,
    sales: salesReducer,
    products: productReducer,
  },
});

export default store;
