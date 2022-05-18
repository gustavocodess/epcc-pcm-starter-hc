import { Modal, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { ProductInfomation } from "src/modules/Product/ProductInfomation/ProductInfomation";
import { getImage, getProductDetail } from "src/modules/Product/productService";
import { ProductPrice } from "src/modules/Product/ProductInfomation/ProductInformationType";
import { getProductPromotion } from "src/modules/Pomotion/promoService";
import { formatProductMatrix } from "src/utils/helper";

interface ProductListTypeModalProps {
  modalItem: boolean;
  handleChange: (value: string) => void;
  ModalItemFunc: (status: boolean) => void;
  productId: string;
}
const ProductListTypeModal: React.FC<ProductListTypeModalProps> = ({
  modalItem,
  ModalItemFunc,
  productId,
}) => {
  const [listImage, setListImage] = React.useState<Array<any>>([]);
  const [data, setData] = useState<any>();
  const [productPrice, setProductPrice] = useState<ProductPrice>({
    price: 0,
    priceSale: 0,
  });
  const [productPromo, setProductPromo] = useState<any>({});
  const [variations, setVariations] = useState([]);
  const [variationMatrix, setVariationMatrix] = useState({});

  const init = useCallback(async () => {
    try {
      const { data }: any = await getProductDetail(productId);

      if (data) {
        setProductPrice({
          priceSale: data?.meta?.original_price
            ? data?.attributes?.price?.USD?.amount
            : null,
          price: data?.meta?.original_price
            ? data?.meta?.original_price?.USD?.amount
            : data?.attributes?.price?.USD?.amount,
        });

        if (data.meta?.variations) {
          setVariations(data.meta?.variations);
          setVariationMatrix(formatProductMatrix(data.meta?.variation_matrix));
        }
      }

      setData(data);

      // get product promotion code
      const promo: any = await getProductPromotion(productId);
      if (promo?.attributes?.extensions?.["products(product-promotion)"]) {
        setProductPromo(
          promo?.attributes?.extensions?.["products(product-promotion)"]
        );
      }
    } catch (err) {
    } finally {
    }
  }, [productId]);

  const productImage = useCallback(async (data: any) => {
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

      setListImage(listImageTemp);
    } catch (err) {
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (
      data?.relationships?.files?.data &&
      Array.isArray(data?.relationships?.files?.data)
    ) {
      productImage(data?.relationships?.files?.data);
    }
  }, [data, productImage]);

  if (!data || !data.attributes)
    return (
      <div>
        <Spin />
      </div>
    );

  return (
    <Modal
      title=""
      footer={null}
      centered
      width={"70%"}
      visible={modalItem}
      onOk={() => ModalItemFunc(false)}
      onCancel={() => ModalItemFunc(false)}
    >
      <ProductInfomation
        listImage={listImage}
        data={data.attributes}
        type="modal"
        productId={productId}
        productPrice={productPrice}
        promo={productPromo}
        variations={variations}
        variationMatrix={variationMatrix}
      />
    </Modal>
  );
};
export default ProductListTypeModal;
