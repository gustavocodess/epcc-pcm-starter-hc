import { getComponent } from "src/modules/Home/EPComponentService";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface FeaturedItemState {
  item: any;
  loading: boolean | undefined;
  promotion: any;
}

const initialState: FeaturedItemState = {
  item: null,
  loading: false,
  promotion: null,
};

export const fetchFeaturedItem = createAsyncThunk(
  "homePage/fetchFeaturedItem",
  async (componentId: string, thunkAPI) => {
    const response = await getComponent(componentId);
    return response;
  }
);

export const fetchPromotion = createAsyncThunk(
  "homePage/fetchPromotion",
  async (componentId: string, thunkAPI) => {
    const response = await getComponent(componentId);
    return response;
  }
);

export const featuredSlide = createSlice({
  name: "homePage/featuredItem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchFeaturedItem.pending,
        (state, action: PayloadAction<any>) => {
          state.loading = true;
        }
      )
      .addCase(
        fetchFeaturedItem.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.item = action.payload.included;
        }
      )
      .addCase(fetchPromotion.pending, (state, action: PayloadAction<any>) => {
        state.loading = true;
      })
      .addCase(
        fetchPromotion.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.promotion = action.payload.included;
        }
      );
  },
});

export default featuredSlide.reducer;
