import { config } from "src/config";
import { MoltinGateway } from "src/services";
import axios from "src/utils/axios";

export async function getAllPromotion(): Promise<any> {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
  });
  const result = await moltin.Promotions.All();
  return result;
}

export async function getProductPromotion(productId: string): Promise<any> {
  const response: any = await axios.get(
    `https://${config.endpointURL}/catalog/products/${productId}?include=files`
  );

  return response?.data;
}
