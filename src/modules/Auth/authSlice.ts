import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    user: any
}

const initialState: AuthState = {
    user: null
}

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
});

const { reducer, actions } = auth;

export const { setUser } = actions;

export default reducer;
