import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAccountDetail,
  getCompleteOrders,
  getCustomerOrders,
} from "./AccountService";
// import { authorizedOrder, getCustomerApi } from "./AccountService";

interface AccountPageState {
  account: {
    loading: boolean;
    orderList: any;
    accountDetail: any;
    completeOrderList: any;
    email: string;
    password: string;
    customerToken: string;
    customerId: string;
    error: string;
  };
}
const initialState: AccountPageState = {
  account: {
    loading: false,
    orderList: [],
    accountDetail: {},
    completeOrderList: [],
    email: "",
    password: "",
    customerToken: "",
    customerId: "",
    error: "",
  },
};

export const fetchAccountDetail = createAsyncThunk(
  "fetch/account/detail",
  async ({ customer, token }: any, thunkAPI) => {
    const response = await getAccountDetail(customer, token);

    return response;
  }
);

export const fetchCustomerOrders = createAsyncThunk(
  "fetch/customer/orders",
  async (customerToken: any, thunkAPI) => {
    const response = await getCustomerOrders(customerToken);

    return response;
  }
);

export const fetchCompleteOrders = createAsyncThunk(
  "fetch/complete/orders",
  async (customerToken: any, thunkApi) => {
    const response: any = await getCompleteOrders(customerToken);
    return response.data;
  }
);

export const accountSlice = createSlice({
  name: "homePage/navigator",
  initialState,
  reducers: {
    getAccount: (state, action) => {
      state.account.email = action.payload.email;
      state.account.password = action.payload.password;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchCustomerOrders.pending, (state, action) => {
        state.account.loading = true;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action: any) => {
        state.account.loading = false;
        state.account.orderList = action.payload;
      })
      .addCase(fetchAccountDetail.pending, (state, action) => {
        state.account.loading = true;
      })
      .addCase(fetchAccountDetail.fulfilled, (state, action) => {
        state.account.loading = false;
        state.account.accountDetail = action.payload;
      })
      .addCase(fetchCompleteOrders.pending, (state, action) => {
        state.account.loading = true;
      })
      .addCase(fetchCompleteOrders.fulfilled, (state, action) => {
        state.account.loading = false;
        state.account.completeOrderList = action.payload;
      });
  },
});

export const { getAccount } = accountSlice.actions;

export default accountSlice.reducer;
