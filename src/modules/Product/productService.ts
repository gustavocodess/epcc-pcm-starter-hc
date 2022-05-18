import { config } from "src/config";
import { MoltinGateway, moltinParam } from "src/services";
import axios from "src/utils/axios";

export const getProductListByCategoryId = async (
  categoryId: string,
  limit: number,
  page: number
) => {
  try {
    const res: any = await axios.get(
      `https://${config.endpointURL}/catalog/nodes/${categoryId}/relationships/products`,
      {
        params: {
          "page[limit]": limit,
          "page[offset]": (page - 1) * limit,
          include: "main_image",
        },
      }
    );

    if (res?.data && Array.isArray(res.data)) {
      const formatData = [];
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i];
        formatData.push({
          ...element,
          main_images: res?.included?.main_images?.[i] || {},
        });
      }

      return {
        data: formatData,
        total: res?.meta?.results?.total || 0,
      };
    }

    return {
      data: [],
      total: 0,
    };
  } catch (err) {
    Promise.reject(err);
  }
};

export const getProductDetail = async (product_id: string): Promise<any> => {
  const response: any = await axios.get(
    `https://${config.endpointURL}/catalog/products/${product_id}`,
    {
      params: {
        include: "main_image",
      },
    }
  ).catch((reason) => {
    return null;
  });


  if (response) {
    const { data, included } = response;

    if (Array.isArray(included?.main_images)) {
      const { main_images } = included;
      return {
        data: {
          ...data,
          image: main_images[0]?.link?.href || "",
        },
        included,
      };
    } else {
      return { data, included };
    }
  }

  
  const moltin = MoltinGateway(moltinParam);

  const product = await moltin.PCM.Get(product_id);
  let image = `https://via.placeholder.com/500x500`
  if (product.data.relationships?.main_image?.data.id) {
    image = (await getImage(product.data.relationships?.main_image?.data.id)).link.href;
  }

  return { data: {
    ...product,
    image
  }, included: { }}
};


export const getProductImage = async (
  product_id: string
): Promise<Array<moltin.PcmFileRelationship>> => {
  const moltin = MoltinGateway(moltinParam);
  const result = await moltin.PCM.FileRelationships.All(product_id);
  const image = result.data;
  return image;
};

export const getImage = async (image_id: string): Promise<any> => {
  const moltin = MoltinGateway({
    host: config.endpointURL,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });
  const result = await moltin.Files.Get(image_id);
  const image = result.data;
  return image;
};
