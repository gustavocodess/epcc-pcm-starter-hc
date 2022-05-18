import React, { useCallback, useEffect, useState } from 'react';
import { ProductInfomation } from 'src/modules/Product/ProductInfomation/ProductInfomation';
import { getImage, getProductDetail } from "src/modules/Product/productService";
import useMounted from 'src/hooks/mounted';

interface CustomProductBoxProps {
  product: {
    options: {
      product: string,
    }
  };
}

export const CustomProductBox: React.FC<CustomProductBoxProps> = ({ product }) => {
  const [productData, setProductData] = useState<moltin.CartItem | undefined>();
  const [listImages, setListImage] = useState<Array<any>>([]);
  const isMounted = useMounted();


  const productImage = useCallback(
    async (data: any) => {
      try {
        const listImageTemp: any = [];
        for (let i = 0; i < data.length; i++) {
          const image: any = await getImage(data[i].id);

          if (image?.link?.href) {
            listImageTemp.push({
              path: image.link.href,
            });
          }
        }

        if (isMounted.current) {
          setListImage(listImageTemp);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [isMounted]
  );

  useEffect(() => {
    const images =
    productData?.relationships?.files?.data ||
    productData?.relationships?.files?.data;
    if (images && Array.isArray(images)) {
      productImage(images);
    }
  }, [productData, productImage]);

  useEffect(() => {
    async function getProduct() {
      const { data }: any = await getProductDetail(product.options?.product);
      setProductData(data)
    }
    if (product) {
      setListImage([])
      getProduct()
    }
  }, [product])

  // @ts-ignore
  const productToDisplay = productData?.data ? { ...productData.data } : productData

  return (
    <div>
      <ProductInfomation
        listImage={productData?.image ? [{ path: productData?.image }] : listImages}
        data={productToDisplay?.attributes}
        productId={productToDisplay?.id}
        productPrice={{ price: productToDisplay?.attributes?.price?.['USD']?.amount || 0 }}
        promo={null}
        // @ts-ignore
        variations={productToDisplay?.meta?.variations || []}
        variationMatrix={[]}
      />
    </div>
  );
}
