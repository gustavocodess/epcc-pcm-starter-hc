import { config } from "src/config";
import { MoltinGateway, moltinParam } from "src/services";
import axios from "src/utils/axios";

export const fetchListCart = async (customerToken: string) => {
  try {
    const moltin = MoltinGateway(moltinParam);
    const response = await moltin.Cart().All(customerToken);

    return response;
  } catch (err) {
    console.log(err);
  }
};

export const mergeCart = async (cartId: string, prevCartId: string) => {
  try {
    const mergeCart: any = axios.post(
      `https://${config.endpointURL}/v2/carts/${cartId}/items`,
      {
        data: [
          {
            type: "cart_items",
            cart_id: prevCartId,
          },
        ],
        options: {
          add_all_or_nothing: false,
        },
      }
    );
    return mergeCart;
  } catch (err) {
    console.log(err);
  }
};
