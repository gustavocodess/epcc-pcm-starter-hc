import { getComponent } from "src/modules/Home/EPComponentService";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface BestSellingState {
  item: any;
  loading: boolean;
}

const initialState: BestSellingState = {
  item: null,
  loading: false,
};

export const fetchBestSelling = createAsyncThunk(
  "homePage/fetchBestSelling",
  async (componentId: string, thunkAPI) => {
    const response = await getComponent(componentId);
    return response;
  }
);

export const bestSellingSlice = createSlice({
  name: "homePage/bestSelling",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchBestSelling.pending,
        (state, action: PayloadAction<any>) => {
          state.loading = true;
        }
      )
      .addCase(
        fetchBestSelling.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.item = action.payload.included;
        }
      );
  },
});

export default bestSellingSlice.reducer;
