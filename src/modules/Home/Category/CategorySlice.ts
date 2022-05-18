import { getComponent } from "../../Home/EPComponentService";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface CategoryState {
  item: any;
  loading: boolean;
}

const initialState: CategoryState = {
  item: null,
  loading: false,
};

export const fetchCategory = createAsyncThunk(
  "homePage/fetchCategory",
  async (componentId: string, thunkAPI) => {
    const response = await getComponent(componentId);
    return response;
  }
);

export const categorySlice = createSlice({
  name: "homePage/category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state, action: PayloadAction<any>) => {
        state.loading = true;
      })
      .addCase(fetchCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.item = action.payload.included;
      });
  },
});

export default categorySlice.reducer;
