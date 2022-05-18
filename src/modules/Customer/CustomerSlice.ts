import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCartId } from "src/modules/Cart/cartService";
import {
  addCustomerAssociation,
  clearCustomer,
  getAddresses,
  getCustomer,
  login,
  register,
  setCustomer,
} from "src/modules/Customer/customerService";
import { RootState } from "src/store";

interface CustomerState {
  customer: moltin.CustomerBase;
  error: string;
  loading: boolean;
  isLogin: boolean;
  address: moltin.CustomerAddress[];
  guest: {
    name: string;
    email: string;
  };
}

const initialState: CustomerState = {
  customer: {
    type: "",
    name: "",
    email: "",
    password: "",
  },
  error: "",
  loading: false,
  isLogin: false,
  address: [],
  guest: {
    name: "",
    email: "",
  },
};

export const onRegisterCustomer = createAsyncThunk(
  "customer/onRegisterCustomer",
  async ({ name, email, password }: any, { rejectWithValue }) => {
    try {
      const response = await register(name, email, password);
      return response;
    } catch (err) {
      return rejectWithValue(err.errors?.[0]?.detail);
    }
  }
);

export const onLogin = createAsyncThunk(
  "customer/onLogin",
  async ({ email, password }: any, { rejectWithValue }) => {
    try {
      const response = await login(email, password);

      // sync cart
      const cartId = getCartId();
      if (cartId) {
        await addCustomerAssociation(
          cartId,
          response.customer_id,
          response.token
        );
      }
      return response;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.errors?.[0]?.detail);
    }
  }
);

export const getCustomerAddress = createAsyncThunk(
  "customer/getCustomerAddress",
  async ({ customer, token }: any, { rejectWithValue }) => {
    try {
      const response = await getAddresses(customer, token);
      return response;
    } catch (err) {
      return rejectWithValue(err.errors?.[0]?.detail);
    }
  }
);

export const getCustomerInfo = createAsyncThunk(
  "customer/getCustomerInfo",
  async ({ customer, token }: any, { rejectWithValue }) => {
    try {
      const response = await getCustomer(customer, token);
      return response;
    } catch (err) {
      return rejectWithValue(err.errors?.[0]?.detail);
    }
  }
);

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearError(state) {
      state.error = "";
    },
    onSetGuest(state, action) {
      state.guest.email = action.payload;
    },
    onLogout(state) {
      state.isLogin = false;
      state.customer = {
        type: "",
        name: "",
        email: "",
        password: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onRegisterCustomer.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(onRegisterCustomer.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        state.customer = payload;

        setCustomer(payload.customer_id, payload.token);
      })
      .addCase(onRegisterCustomer.rejected, (state, { payload }: any) => {
        state.loading = false;
        state.error = payload;

        clearCustomer();
      })
      .addCase(onLogin.pending, (state) => {
        state.loading = true;
        //state.error = "";
      })
      .addCase(onLogin.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        state.isLogin = true;

        setCustomer(payload.customer_id, payload.token);
      })
      .addCase(onLogin.rejected, (state, { payload }: any) => {
        state.loading = false;
        state.error = payload;
        state.isLogin = false;

        clearCustomer();
      })
      .addCase(getCustomerInfo.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getCustomerInfo.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        state.customer = payload;
      })
      .addCase(getCustomerInfo.rejected, (state, { payload }: any) => {
        state.loading = false;
        clearCustomer();
      });
  },
});

const { reducer } = customerSlice;

export const { clearError, onSetGuest, onLogout } = customerSlice.actions;

export const selectCustomer = (state: RootState) => state.customer;

export default reducer;
