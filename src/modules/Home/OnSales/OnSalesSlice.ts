import { getComponent } from "src/modules/Home/EPComponentService";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface OnSalesState {
  item: any;
  loading: boolean;
}

const initialState: OnSalesState = {
  item: null,
  loading: false,
};

export const fetchOnSales = createAsyncThunk(
  "homePage/fetchOnSales",
  async (componentId: string, thunkAPI) => {
    const response = await getComponent(componentId);
    return response;
  }
);

export const onSalesSlice = createSlice({
  name: "homePage/onSales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchOnSales.pending, (state, action: PayloadAction<any>) => {
        state.loading = true;
      })
      .addCase(fetchOnSales.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.item = action.payload.included;
      });
  },
});

export default onSalesSlice.reducer;
