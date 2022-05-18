import React, { FC, useEffect, useState } from "react";
import { fetchProductByProductId } from "src/modules/Account/AccountService";
import { formatMoney } from "src/utils/helper";
import styles from "./OrderItem.module.scss";

const OrderItem: FC<{ item: any }> = ({ item }) => {
  const [productDetail, setProductDetail] = useState<any>();
  const [image, setImage] = useState<any>();

  useEffect(() => {
    const init = async () => {
      const product = await fetchProductByProductId(item?.product_id);
      const imageSrc = product?.included?.main_images?.[0]?.link?.href;
      setProductDetail(product?.data);
      setImage(imageSrc);
    };
    init();
  }, [item]);

  return (
    <tr className={styles["order-items-table-row"]}>
      <td className={styles["order-items-table-cell"]}>
        <div className={styles["order-items-overview"]}>
          <img
            className={styles["order-items-overview__img"]}
            src={image}
            alt=""
          />
          <div className={styles["order-items-desc"]}>
            <div className={styles["order-items-desc__name"]}>
              {productDetail?.attributes?.name || item?.name}
            </div>
            <div className={styles["order-items-desc__desc"]}>
              {productDetail?.attributes?.description}
            </div>
          </div>
        </div>
      </td>
      <td className={styles["order-items-table-cell"]}>
        {formatMoney(item?.unit_price?.amount)}
      </td>
      <td className={styles["order-items-table-cell"]}>$0</td>
      <td className={styles["order-items-table-cell"]}>{item?.quantity}</td>
      <td className={styles["order-items-table-cell"]}>
        {item?.total === 0 ? "Free" : `${formatMoney(item?.value?.amount)}`}
      </td>
    </tr>
  );
};

export default OrderItem;
