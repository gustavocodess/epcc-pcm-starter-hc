import * as moltin from "@moltin/sdk";
import { config, SHOP_BY_CATEGORY } from "src/config";
import { PRICEBOOKID } from "src/config";
import axios from "src/utils/axios";

const MoltinGateway = moltin.gateway;

export const getAllCatalog = async (): Promise<any> => {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });
  const result = await moltin.Catalogs.All();
  return result;
};

export const getCatalogById = async (catalog_id: string): Promise<any> => {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });
  const result = await moltin.Catalogs.Releases.Get({
    catalogId: catalog_id,
    releaseId: "latest",
  });
  return result;
};

export const getNodeByCatalogId = async (catalog_id: string): Promise<any> => {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });
  const result = await moltin.Catalogs.Nodes.GetAllCatalogNodes({
    catalogId: catalog_id,
    releaseId: "latest",
  });
  return result;
};

// export const getNodeDetail = async (
//   catalog_id: string,
//   node_id: string
// ): Promise<any> => {
//   const moltin = MoltinGateway({
//     host: config.endpointURL,
//     client_id: config.clientId,
//     client_secret: config.clientSecret,
//   });
//   const result = await moltin.Catalogs.Nodes.GetNodeInCatalogRelease({
//     catalogId: catalog_id,
//     nodeId: node_id,
//     releaseId: "latest",
//   });
//   return result;
// };

export const getNodeDetail = async (node_id: string): Promise<any> => {
  const response: any = await axios.get(
    `https://${config.endpointURL}/catalog/nodes/${node_id}`
  );
  return response;
};

export async function loadCategoryProducts(
  categoryId: string,
  pageNum: number
): Promise<moltin.ResourcePage<moltin.Product>> {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
  });

  const result = await moltin.Products.Offset(
    (pageNum - 1) * config.categoryPageSize
  )
    .Limit(config.categoryPageSize)
    .Filter({
      eq: {
        category: {
          id: categoryId,
        },
      },
    })
    .All();

  return result;
}

export const getListOfNodeChildren = async (node_id: string): Promise<any> => {
  const response: any = await axios.get(
    `https://${config.endpointURL}/catalog/nodes/${node_id}/relationships/children`
  );
  return response;
};

export const getProductsInCategory = async (node_id: string): Promise<any> => {
  const response: any = await axios.get(
    `https://${config.endpointURL}/catalog/nodes/${node_id}/relationships/products?include=main_image`
  );
  return response;
};

export const getProductsInHeirarchy = async (
  hierarchy_id: string
): Promise<any> => {
  const response: any = await axios.get(
    `https://${config.endpointURL}/catalog/hierarchies/${hierarchy_id}/products?include=main_image`
  );
  return response;
};

export const getNodeBySlug = async (slug: string): Promise<any> => {
  const response: any = await axios.get(
    `https://${config.endpointURL}/catalogs/${SHOP_BY_CATEGORY}/releases/latest/nodes?filter=eq(slug,${slug})`
  );
  return response;
};

export const getPriceBook = async (): Promise<any> => {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });
  const result = await moltin.PriceBooks.Prices.All({
    pricebookId: PRICEBOOKID,
  });
  return result;
};

export const getPriceById = async (priceId: string): Promise<any> => {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });
  const result = await moltin.PriceBooks.Prices.Get({
    priceId: priceId,
    pricebookId: PRICEBOOKID,
  });
  return result;
};
