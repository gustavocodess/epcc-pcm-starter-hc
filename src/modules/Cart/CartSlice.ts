import {
  addCustomerItemToCart,
  addPromoItemToCart,
  addToCart,
  getCartItems,
  getMultiCarts,
  removeCartItem,
  updateCartItem,
  deleteAllProduct,
} from "src/modules/Cart/cartService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { mergeCart } from "../AppHeader/AppHeaderService";
import { correctFreeShipping, correctShippingFee } from "src/utils/helper";

interface CartState {
  cartOnlyProduct: moltin.CartItem[];
  cart: moltin.CartItem[];
  cartError: string;
  promotionError: string;
  loading: boolean;
  cartPriceDisplay: any;
}

const initialState: CartState = {
  cartOnlyProduct: [],
  cart: [],
  cartError: "",
  promotionError: "",
  loading: false,
  cartPriceDisplay: {},
};

export const fetchMultiCart = createAsyncThunk(
  "cart/fetchMultiCart",
  async (token: string) => {
    const response = await getMultiCarts(token);
    return response;
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (cartId: string) => {
    const response = await getCartItems(cartId);
    return response;
  }
);

export const deleteAllProductInCart = createAsyncThunk(
  "cart/deleteAllProduct",
  async () => {
    const response = await deleteAllProduct();
    return response;
  }
);

export const mergeCartIntoCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ cartId, prevCartId }: { cartId: string; prevCartId: string }) => {
    const reponse = await mergeCart(cartId, prevCartId);
    return reponse;
  }
);

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await addToCart(productId, quantity);
      if (response?.data && Array.isArray(response.data)) {
        const totalPrice = response.data
          .filter((x: any) => x.sku !== "shipping-fee")
          .reduce((pre: any, item: any) => {
            return pre + item?.value?.amount;
          }, 0);

        const shippingFeeItem = response.data.find(
          (x: any) => x.sku === "shipping-fee"
        );

        if (
          totalPrice > 0 &&
          totalPrice < correctFreeShipping() &&
          !shippingFeeItem
        ) {
          await dispatch(
            addProductShippingFee({
              type: "custom_item",
              name: "shipping fee",
              sku: "shipping-fee",
              description: "shipping-fee",
              quantity: 1,
              price: {
                amount: correctShippingFee(),
              },
            })
          );

          return;
        }

        if (
          (totalPrice >= correctFreeShipping() || totalPrice === 0) &&
          shippingFeeItem
        ) {
          await dispatch(deleteProductInCart(shippingFeeItem.id));
          return;
        }

        return response;
      }
    } catch (err) {
      return rejectWithValue(
        err.errors?.[0].detail || err.response?.data.errors?.[0].detail
      );
    }
  }
);

export const updateProductToCart = createAsyncThunk(
  "cart/updateProductToCart",
  async (
    { id, quantity }: { id: string; quantity: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await updateCartItem(id, quantity);
      if (response && Array.isArray(response.data)) {
        const totalPrice = response.data
          .filter((x: any) => x.sku !== "shipping-fee")
          .reduce((pre: any, item: any) => {
            return pre + item?.value?.amount;
          }, 0);

        const shippingFeeItem = response.data.find(
          (x: any) => x.sku === "shipping-fee"
        );

        if (
          totalPrice > 0 &&
          totalPrice < correctFreeShipping() &&
          !shippingFeeItem
        ) {
          await dispatch(
            addProductShippingFee({
              type: "custom_item",
              name: "shipping fee",
              sku: "shipping-fee",
              description: "shipping-fee",
              quantity: 1,
              price: {
                amount: correctShippingFee(),
              },
            })
          );

          return;
        }

        if (
          (totalPrice >= correctFreeShipping() || totalPrice === 0) &&
          shippingFeeItem
        ) {
          await dispatch(deleteProductInCart(shippingFeeItem.id));
          return;
        }

        return response;
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors?.[0].detail);
    }
  }
);

export const addProductShippingFee = createAsyncThunk(
  "cart/addProductShippingFee",
  async (item: any, { rejectWithValue }) => {
    try {
      const response = await addCustomerItemToCart(item);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors?.[0].detail);
    }
  }
);

export const addPromoCode = createAsyncThunk(
  "cart/addPromoCode",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await addPromoItemToCart(code);

      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors?.[0].detail);
    }
  }
);

export const deleteProductInCart = createAsyncThunk(
  "cart/deleteProductInCart",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await removeCartItem(id);
      if (response?.data && Array.isArray(response.data)) {
        const totalPrice = response.data
          .filter((x: any) => x.sku !== "shipping-fee")
          .reduce((pre: any, item: any) => {
            return pre + item?.value?.amount;
          }, 0);

        const shippingFeeItem = response.data.find(
          (x: any) => x.sku === "shipping-fee"
        );

        if (
          totalPrice > 0 &&
          totalPrice < correctFreeShipping() &&
          !shippingFeeItem
        ) {
          await dispatch(
            addProductShippingFee({
              type: "custom_item",
              name: "shipping fee",
              sku: "shipping-fee",
              description: "shipping-fee",
              quantity: 1,
              price: {
                amount: correctShippingFee(),
              },
            })
          );

          return;
        }

        if (
          (totalPrice >= correctFreeShipping() || totalPrice === 0) &&
          shippingFeeItem
        ) {
          await dispatch(deleteProductInCart(shippingFeeItem.id));
          return;
        }

        return response;
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors?.[0].detail);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeCartError: (state) => {
      state.cartError = "";
    },
    removePromotionError: (state) => {
      state.promotionError = "";
    },
    addCart: (state, action) => {
      state.cart = action.payload;
      state.cartOnlyProduct = action.payload.filter(
        (x: any) => x.sku !== "shipping-fee"
      );
    },
    clearCart: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.cartError = "";
      })
      .addCase(fetchCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload && Array.isArray(payload.data)) {
          state.cart = payload.data;
          state.cartOnlyProduct = payload.data.filter(
            (x: any) => x.sku !== "shipping-fee" && x.type !== "promotion_item"
          );

          state.cartPriceDisplay = payload?.meta?.display_price || {};
        }
      })
      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
        state.cartError = "";
      })
      .addCase(addProductToCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload && Array.isArray(payload.data)) {
          state.cart = payload.data;
          state.cartOnlyProduct = payload.data.filter(
            (x: any) => x.sku !== "shipping-fee" && x.type !== "promotion_item"
          );

          state.cartPriceDisplay = payload?.meta?.display_price || {};
        }
      })
      .addCase(addProductToCart.rejected, (state, { payload }: any) => {
        state.loading = false;
        state.cartError = payload;
      })
      .addCase(updateProductToCart.pending, (state) => {
        state.loading = true;
        state.cartError = "";
      })
      .addCase(updateProductToCart.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        if (payload && Array.isArray(payload.data)) {
          state.cart = payload.data;
          state.cartOnlyProduct = payload.data.filter(
            (x: any) => x.sku !== "shipping-fee" && x.type !== "promotion_item"
          );
          state.cartPriceDisplay = payload?.meta?.display_price || {};
        }
      })
      .addCase(updateProductToCart.rejected, (state, { payload }: any) => {
        state.loading = false;
        state.cartError = payload;
      })
      .addCase(deleteProductInCart.pending, (state) => {
        state.loading = true;
        state.cartError = "";
      })
      .addCase(deleteProductInCart.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        if (payload && Array.isArray(payload.data)) {
          state.cart = payload.data;
          state.cartOnlyProduct = payload.data.filter(
            (x: any) => x.sku !== "shipping-fee" && x.type !== "promotion_item"
          );

          state.cartPriceDisplay = payload?.meta?.display_price || {};
        }
      })
      .addCase(deleteProductInCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addProductShippingFee.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductShippingFee.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        if (payload && Array.isArray(payload.data)) {
          state.cart = payload.data;
          state.cartOnlyProduct = payload.data.filter(
            (x: any) => x.sku !== "shipping-fee" && x.type !== "promotion_item"
          );

          state.cartPriceDisplay = payload?.meta?.display_price || {};
        }
      })
      .addCase(addProductShippingFee.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchMultiCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMultiCart.fulfilled, (state, { payload }: any) => {
        state.loading = false;
      })
      .addCase(fetchMultiCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addPromoCode.pending, (state) => {
        state.loading = true;
        state.promotionError = "";
      })
      .addCase(addPromoCode.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        if (payload && Array.isArray(payload.data)) {
          state.cart = payload.data;
          state.cartOnlyProduct = payload.data.filter(
            (x: any) => x.sku !== "shipping-fee" && x.type !== "promotion_item"
          );

          state.cartPriceDisplay = payload?.meta?.display_price || {};
        }
      })
      .addCase(addPromoCode.rejected, (state, { payload }: any) => {
        state.loading = false;
        state.promotionError = payload;
      })
      .addCase(deleteAllProductInCart.pending, (state) => {
        state.loading = true;
        state.cartError = "";
      })
      .addCase(deleteAllProductInCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = [];
        state.cartOnlyProduct = [];

        state.cartPriceDisplay = {};
      })
      .addCase(mergeCartIntoCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(mergeCartIntoCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(mergeCartIntoCart.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        if (payload && Array.isArray(payload.data)) {
          state.cart = payload.data;
          state.cartOnlyProduct = payload.data.filter(
            (x: any) => x.sku !== "shipping-fee" && x.type !== "promotion_item"
          );

          state.cartPriceDisplay = payload?.meta?.display_price || {};
        }
      });
  },
});

const { reducer, actions } = cartSlice;

export const selectCart = (state: RootState) => state.cart;

export const { removeCartError, clearCart, removePromotionError } = actions;

export default reducer;
