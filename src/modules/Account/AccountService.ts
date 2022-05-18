import { config } from "src/config";
import { MoltinGateway, moltinParam } from "src/services";
import axios from "src/utils/axios";

export const getCustomerOrders: any = async (customerToken: any) => {
  try {
    const moltin = MoltinGateway(moltinParam);
    const response = await moltin.Orders.All(customerToken);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getCustomerOrderDetail: any = async (
  orderId: string,
  customerToken: string
) => {
  try {
    const response = await axios.get(
      `https://${config.endpointURL}/v2/orders?filter=eq(id,${orderId})`,
      {
        headers: {
          "x-moltin-customer-token": customerToken,
        },
        params: {
          include: "items",
        },
      }
    );

    return response;
  } catch (err) {
    console.log(err);
  }
};

export const fetchProductByProductId = async (productId: string) => {
  try {
    const productList: any = await axios.get(
      `https://${config.endpointURL}/catalog/products/${productId}`,
      {
        params: {
          include: "main_image",
        },
      }
    );
    return productList;
  } catch (err) {
    console.log(err);
  }
};

//for account detail
export const getAccountDetail: any = async (
  customerId: any,
  customerToken: string
) => {
  try {
    const moltin = MoltinGateway(moltinParam);
    const accountDetail = await moltin.Customers.Get(customerId, customerToken);

    return accountDetail?.data;
  } catch (err) {
    console.log(err);
  }
};

export const getCompleteOrders = async (customerToken: any) => {
  try {
    const moltin = MoltinGateway(moltinParam);
    const completeOrders = await moltin.Orders.Filter({
      eq: {
        status: "complete",
      },
    }).All(customerToken);

    return completeOrders;
  } catch (err) {
    console.log(err);
  }
};
