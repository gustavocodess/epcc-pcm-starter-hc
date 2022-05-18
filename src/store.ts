//import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "src/modules/Auth/authSlice";
import appHeaderReducer from "./modules/AppHeader/AppHeaderSlice";
import carouselReducer from "./modules/Home/Carousel/CarouselSlice";
import onSalesReducer from "./modules/Home/OnSales/OnSalesSlice";
import bestSellingReducer from "./modules/Home/BestSelling/BestSellingSlice";
import featuredItemReducer from "./modules/Home/Featured/FeaturedItemSlice";
import categoryReducer from "./modules/Home/Category/CategorySlice";
import productListReducer from "./modules/Product/ProductList/ProductListType/ProductListSlice";
import cartReducer from "src/modules/Cart/CartSlice";
import customerReducer from "src/modules/Customer/CustomerSlice";
import checkoutReducer from "src/modules/Checkout/CheckoutSlice";
import accountReducer from "src/modules/Account/AccountSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "epcc",
  storage,
  //stateReconciler: autoMergeLevel2
  whitelist: ["checkout", "cart", "auth", "account"],
};

const rootReducer = combineReducers({
  auth: userReducer,
  appHeader: appHeaderReducer,
  carousel: carouselReducer,
  onSale: onSalesReducer,
  bestSelling: bestSellingReducer,
  featuredItem: featuredItemReducer,
  category: categoryReducer,
  productList: productListReducer,
  cart: cartReducer,
  customer: customerReducer,
  checkout: checkoutReducer,
  account: accountReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
