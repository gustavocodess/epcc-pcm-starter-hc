import { getComponent } from "src/modules/Home/EPComponentService";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface CarouselState {
  item: any;
  loading: boolean | undefined;
}

const initialState: CarouselState = {
  item: null,
  loading: false,
};

export const fetchCarousel = createAsyncThunk(
  "homePage/fetchComponent",
  async (componentId: string, thunkAPI) => {
    const response = await getComponent(componentId);
    return response;
  }
);

export const carouselSlice = createSlice({
  name: "homePage/carousel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchCarousel.pending, (state, action: PayloadAction<any>) => {
        state.loading = true;
      })
      .addCase(fetchCarousel.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.item = action.payload.included;
      });
  },
});

export default carouselSlice.reducer;
