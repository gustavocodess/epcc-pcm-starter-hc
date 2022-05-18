import { config } from "src/config";
import axios from "src/utils/axios";
import { getCustomerToken } from "../Customer/customerService";

export async function getOrderSummary(id: string): Promise<any> {
  const { token } = getCustomerToken();
  const response: any = await axios.get(
    `https://${config.endpointURL}/v2/orders?filter=eq(id,${id})&include=items`,
    {
      headers: {
        "x-moltin-customer-token": token,
      },
    }
  );

  return {
    data: response?.data?.[0],
    included: response?.included?.items,
  };
}
