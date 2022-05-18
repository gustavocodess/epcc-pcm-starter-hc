import React from "react";
import { Home } from "src/modules/Home/Home";
import { ProductDetail } from "src/modules/Product/ProductDetail/ProductDetail";
import ProductList from "./modules/Product/ProductList/ProductList";
import Checkout from "./modules/Checkout/Checkout";
import Account from "./modules/Account/Account";
import Thankyou from "./modules/Thankyou/Thankyou";
import { Cart } from "./modules/Cart/Cart";

interface RouteConfig {
  path: string;
  exact: boolean;
  component: React.ComponentType<any>;
}

export const routes: RouteConfig[] = [
  { exact: true, path: "/", component: Home },
  { exact: false, path: "/product/:productSlug", component: ProductDetail },
  { exact: false, path: "/category/:categorySlug", component: ProductList },
  { exact: false, path: "/checkout", component: Checkout },
  { exact: false, path: "/thankyou/:orderId", component: Thankyou },
  { exact: false, path: "/thankyou/", component: Thankyou },
  { exact: false, path: "/account", component: Account },
  { exact: false, path: "/cart", component: Cart },
];

export function createHomeUrl(): string {
  return "/";
}

export function createProductUrl(productSlug: string): string {
  return `/product/${productSlug}`;
}
