import React, { FC, useEffect, useState, useCallback } from "react";
import styles from "./RestockItem.module.scss";
import { notification } from "antd";
import {
  getCustomerOrderDetail,
  fetchProductByProductId,
} from "../../AccountService";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import { addProductToCart } from "src/modules/Cart/CartSlice";
import useMounted from "src/hooks/mounted";
import { getCustomerToken } from "src/modules/Customer/customerService";
import { formatMoney } from "src/utils/helper";

const RestockItem: FC<any> = ({ item }) => {
  const [listProduct, setListProduct] = useState<Array<any>>([]);
  const [productDetail, setProductDetail] = useState<any>();
  const [price, setPrice] = useState<any>();
  const [image, setImage] = useState<any>();
  const isMounted = useMounted();
  const clientAccount = useAppSelector((state) => state.account);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      const { token } = getCustomerToken();
      const orderDetail: any = await getCustomerOrderDetail(item.id, token);

      const items = orderDetail?.included?.items || [];

      for (let i = 0; i < items.length; i++) {
        const element = items[i];

        if (element.sku !== "shipping-fee") {
          const product = await fetchProductByProductId(element.product_id);

          const imageSrc = product?.included?.main_images?.[0]?.link?.href;
          const price = product?.data?.attributes?.price?.USD;
          if (isMounted.current) {
            setPrice(price);
            setProductDetail(product?.data);
            setImage(imageSrc);
          }

          break;
        }
      }

      if (isMounted.current) {
        setListProduct(orderDetail?.included?.items);
      }
    };
    init();
  }, [item, isMounted, clientAccount]);

  const handleAddtoBag = useCallback(async () => {
    let hasError = false;
    const products =
      listProduct.filter((x: any) => x.sku !== "shipping-fee") || [];

    for (let i = 0; i < products.length; i++) {
      const response: any = await dispatch(
        addProductToCart({
          productId: products[i].product_id,
          quantity: products[i].quantity,
        })
      );

      if (response?.error) {
        hasError = true;
      }
    }

    if (hasError) {
      if (products.length > 1) {
        notification.warning({
          message:
            "One of the items is out of stock. Please check your bag for more detail.",
        });
      } else {
        notification.warning({
          message: "Item is out of stock, Please try again later",
        });
      }

      return;
    }

    notification.success({
      message: "Add order to cart successfully",
    });
  }, [listProduct, dispatch]);

  return (
    <>
      {productDetail ? (
        <div className={styles.root}>
          <div className={styles["restock-item"]}>
            <div className={styles["restock-item__image"]}>
              {image && (
                <img
                  src={image}
                  alt="product"
                  width="80%"
                  className={styles["image"]}
                />
              )}
            </div>
            <div className={styles["restock-item__desc"]}>
              <div className={styles["title"]}>
                {productDetail?.attributes?.name}
              </div>
              <div className={styles.des}>
                {productDetail?.attributes?.description}
              </div>
              <div>{formatMoney(price?.amount)}</div>
            </div>
            <div className={styles["restock-item__action"]}>
              <div
                className={styles["add-bottom"]}
                style={{ justifyContent: "center" }}
                onClick={handleAddtoBag}
              >
                ADD TO BAG
              </div>
              <div
                className={styles["remove-bottom"]}
                style={{ justifyContent: "center" }}
              >
                REMOVE
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default RestockItem;
