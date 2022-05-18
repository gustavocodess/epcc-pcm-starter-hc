import * as moltin from "@moltin/sdk";
import { config } from "src/config";
import { moltinParam } from "src/services";
import { safeLsGet, safeLsSet } from "src/utils/safeLS";

const MoltinGateway = moltin.gateway;

const createCartIdentifier = () => {
  return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
};

function setCartId() {
  safeLsSet("mcart", createCartIdentifier());
}

export const getCartId = (): string => {
  let cartId = safeLsGet("mcart");

  if (!cartId) {
    setCartId();
    cartId = safeLsGet("mcart");
  }

  return cartId || "";
};

export async function getMultiCarts(token: string) {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
  });
  const cartsList = await moltin.Cart().GetCartsList(token);
  return cartsList;
}

export async function addToCart(
  productId: string,
  quantity: number
): Promise<any> {
  const cartId: string = getCartId();
  const moltin = MoltinGateway(moltinParam);
  const response = await moltin.Cart(cartId).AddProduct(productId, quantity);

  return response;
}

export async function addCustomerItemToCart(item: any): Promise<any> {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
    language: config.defaultLanguage,
    currency: config.defaultCurrency,
  });

  const cartId: string = getCartId();

  const response = await moltin.Cart(cartId).AddCustomItem(item);
  return response;
}

export async function addPromoItemToCart(code: string): Promise<any> {
  const cartId: string = getCartId();
  const moltin = MoltinGateway(moltinParam);
  const response = await moltin.Cart(cartId).AddPromotion(code);

  return response;
}

export async function getCartItems(cartId: string): Promise<any> {
  const moltin = MoltinGateway(moltinParam);
  const response = await moltin.Cart(cartId).Items();

  return response;
}

export async function updateCartItem(
  cartItemId: string,
  quantity: number
): Promise<any> {
  const cartId: string = getCartId();
  const moltin = MoltinGateway(moltinParam);
  const response = await moltin.Cart(cartId).UpdateItem(cartItemId, quantity);

  return response;
}

export async function removeCartItem(cartItemId: string): Promise<any> {
  const cartId: string = getCartId();
  const moltin = MoltinGateway(moltinParam);
  const response = await moltin.Cart(cartId).RemoveItem(cartItemId);

  return response;
}

export async function deleteAllProduct(): Promise<any> {
  const cartId: string = getCartId();
  const moltin = MoltinGateway(moltinParam);
  const response = await moltin.Cart(cartId).RemoveAllItems();

  return response;
}
