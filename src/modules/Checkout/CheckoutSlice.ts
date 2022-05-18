import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { createPaymentToken, checkout, payment } from "./CheckoutService";

export enum CheckoutStep {
  SIGNIN_AND_REGISTER = 1,
  ADDRESS = 2,
  OPTIONS = 3,
  PAYMENT = 4,
  PLACE_ORDER = 5,
}

interface CheckoutState {
  paymentToken: string;
  shippingAddress: any;
  billingAddress: any;
  isSameAddress: boolean;
  paymentMethod: any;
  checkoutStep: CheckoutStep;
  maxStep: CheckoutStep;
  cardPaymentComplete: boolean;
  options?: any;
}

const initialState: CheckoutState = {
  paymentToken: "",
  shippingAddress: null,
  billingAddress: null,
  paymentMethod: null,
  isSameAddress: true,
  checkoutStep: CheckoutStep.SIGNIN_AND_REGISTER,
  maxStep: CheckoutStep.SIGNIN_AND_REGISTER,
  cardPaymentComplete: false,
  options: null,
};

export const generatePaymentToken = createAsyncThunk(
  "paymentToken",
  async (data: any, _thunkAPI) => {
    const response = await createPaymentToken(data);
    return response;
  }
);

export const createOrder = createAsyncThunk(
  "checkout/createOder",
  async ({ cartId, data }: { cartId: string; data: any }, _thunkAPI) => {
    const response = await checkout(cartId, data);
    return response;
  }
);

export const createPayment = createAsyncThunk(
  "checkout/createPayment",
  async ({ orderId, data }: { orderId: string; data: any }, _thunkAPI) => {
    const response = await payment(orderId, data);
    return response;
  }
);

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
    setBillingAddress(state, action) {
      state.billingAddress = action.payload;
    },
    setSameAddress(state, action) {
      state.isSameAddress = action.payload;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    setPaymentToken(state, action) {
      state.paymentToken = action.payload;
    },
    changeStep(state, action: PayloadAction<CheckoutStep>) {
      state.checkoutStep = action.payload;
      if (action.payload >= state.maxStep) {
        state.maxStep = action.payload;
      }
    },
    changeMaxStep(state, action: PayloadAction<CheckoutStep>) {
      state.maxStep = action.payload;
    },
    setCardPayment(state, action) {
      state.cardPaymentComplete = action.payload;
    },
    setOpions(state, action) {
      state.options = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setShippingAddress,
  setBillingAddress,
  setPaymentMethod,
  setPaymentToken,
  changeStep,
  setCardPayment,
  changeMaxStep,
  setOpions,
  setSameAddress,
} = checkoutSlice.actions;

export const selectCheckout = (state: RootState) => state.checkout;

export default checkoutSlice.reducer;
