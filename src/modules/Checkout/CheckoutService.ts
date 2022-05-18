import { MoltinGateway, moltinParam } from "src/services";
import axios from "src/utils/axios";

export const checkout = async (cartId: string, data: any) => {
  const moltin = MoltinGateway(moltinParam);

  const { customer, shipping_address, billing_address } = data;
  const response = await moltin
    .Cart(cartId)
    .Checkout(customer, billing_address, shipping_address);

  return response;
};

export const payment = async (cartId: string, data: any) => {
  const moltin = MoltinGateway(moltinParam);
  const response = await moltin.Orders.Payment(cartId, data);

  return response;
};

export const createPaymentToken = async (data: any) => {
  const response: any = await axios.post(`https://api.stripe.com/v1/tokens`, {
    data,
  });

  return response;
};
