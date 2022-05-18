import React, { FC, useState, useCallback, useEffect } from "react";
import IconCheck from "../../../../../assets/images/icons/Check-mark.png";
import PackageOrder from "../../../../../assets/images/icons/Packing-icon.png";
import { Link, useRouteMatch } from "react-router-dom";
import styles from "./OrderItem.module.scss";
import moment from "moment";

import {
  getCustomerOrderDetail,
  fetchProductByProductId,
} from "src/modules/Account/AccountService";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import { addProductToCart } from "src/modules/Cart/CartSlice";
import { notification } from "antd";
import { getCustomerToken } from "src/modules/Customer/customerService";
import { Skeleton } from "antd";
import { formatMoney } from "src/utils/helper";

const OrderItem: FC<any> = ({ order }) => {
  let { url } = useRouteMatch();
  const [listProduct, setListProduct] = useState<any>();
  const dispatch = useAppDispatch();
  const clientAccount = useAppSelector((state) => state.account);
  const [image, setImage] = useState<any>();
  const [image2, setImage2] = useState<any>();

  useEffect(() => {
    const init = async () => {
      const { token } = getCustomerToken();
      const orderDetail = await getCustomerOrderDetail(order.id, token);

      setListProduct(orderDetail);

      const items = orderDetail?.included?.items || [];
      let index = 0;

      // set image 1
      for (let i = 0; i < items.length; i++) {
        const element = items[i];
        index = i;
        if (element.sku !== "shipping-fee") {
          const product = await fetchProductByProductId(element.product_id);
          const imageSrc = product?.included?.main_images?.[0]?.link?.href;
          setImage(imageSrc);
          break;
        }
      }

      // set image 2
      for (let j = 1; j < items.length; j++) {
        const element = items[j];

        if (j === index) {
          continue;
        }

        if (element.sku !== "shipping-fee") {
          const product2 = await fetchProductByProductId(element.product_id);
          const imageSrc2 = product2?.included?.main_images?.[0]?.link?.href;
          setImage2(imageSrc2);

          break;
        }
      }
    };
    init();
  }, [order, clientAccount]);

  const handleReOrder = useCallback(async () => {
    let hasError = false;
    const products =
      listProduct?.included?.items?.filter(
        (x: any) => x.sku !== "shipping-fee"
      ) || [];

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
    <tr className={styles["orders-table-row"]}>
      <td className={styles["orders-table-cell"]}>
        <div
          className={
            order.status !== "incomplete" ? styles["order-completed"] : ""
          }
        >
          {order.id}
        </div>
        <Link
          to={`${url}/${order.id}`}
          className={`${styles["order-link"]} ${
            order.status !== "incomplete" ? styles["order-completed"] : ""
          }`}
        >
          Check order
        </Link>
      </td>
      <td
        className={`${styles["orders-table-cell"]} ${
          order.status !== "incomplete" ? styles["order-completed"] : ""
        }`}
      >
        {moment(order.meta.timestamps.created_at).format("DD MMM YYYY")}
      </td>
      <td className={styles["orders-table-cell"]}>
        <div className={styles["dashboard__image"]}>
          {image ? (
            <>
              {image && <img src={image} alt="product" width="80%" />}
              {image2 && <img src={image2} alt="product" width="80%" />}
            </>
          ) : (
            <>
              <Skeleton.Input
                style={{ width: "80px", height: "80px", margin: "1rem 0rem" }}
              />
            </>
          )}
        </div>
      </td>
      <td className={styles["orders-table-cell"]}>
        {formatMoney(order.meta?.display_price?.with_tax?.amount)}
      </td>
      <td className={styles["orders-table-cell"]}>
        {order.status === "incomplete" ? (
          <div className={styles["order-status"]}>
            <img
              className={styles["order-status__icon"]}
              src={PackageOrder}
              alt=""
            ></img>
            <div className={styles["order-status__text"]}>Packing order</div>
          </div>
        ) : (
          <div className={styles["order-status"]}>
            <img
              className={styles["order-status__icon"]}
              src={IconCheck}
              alt=""
            ></img>
            <div className={styles["order-status__text"]}>Completed</div>
          </div>
        )}
      </td>
      <td className={styles["orders-table-cell"]}>
        {order.status === "complete" ? (
          <button className={styles["reorder-btn"]} onClick={handleReOrder}>
            re-order
          </button>
        ) : (
          <div className={styles["reorder-line"]}>-</div>
        )}
      </td>
    </tr>
  );
};

export default OrderItem;
