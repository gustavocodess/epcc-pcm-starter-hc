import React, { useMemo } from "react";
import { formatMoney } from "src/utils/helper";
import styles from "./OrderTotal.module.scss";

const OrderTotal: React.FC<any> = ({ orderPrice }) => {
  const discount = useMemo(() => {
    if (orderPrice.length === 0) {
      return 0;
    }

    return orderPrice.reduce((pre: any, next: any) => {
      if (!next.discounts) {
        return pre;
      }

      return (
        pre +
        next.discounts.reduce((prev: any, item: any) => {
          return prev + (item?.amount?.amount || 0);
        }, 0)
      );
    }, 0);
  }, [orderPrice]);

  const total = () => {
    if (orderPrice.length === 0) return { amount: 0 };
    if (orderPrice.length === 1) return { amount: orderPrice[0].value?.amount };
    return orderPrice
      .map((item: any) => item.value)
      .reduce(
        (item: any, nextItem: any) => {
          return {
            amount: item?.amount + nextItem?.amount,
          };
        },
        { amount: 0 }
      );
  };

  return (
    <div className={styles["order-total"]}>
      <div className={styles["order-total-table"]}>
        {/* <div className={styles["order-total-table-row"]}>
          <div className={styles["order-total-table-cell"]}>Subtotal</div>
          <div className={styles["order-total-table-cell"]}>$55.08</div>
        </div>
        <div className={styles["order-total-table-row"]}>
          <div className={styles["order-total-table-cell"]}>Discount</div>
          <div className={styles["order-total-table-cell"]}>$55.08</div>
        </div>
        <div className={styles["order-total-table-row"]}>
          <div className={styles["order-total-table-cell"]}>
            Price before GTS
          </div>
          <div className={styles["order-total-table-cell"]}>$55.08</div>
        </div>
        <div className={styles["order-total-table-row"]}>
          <div className={styles["order-total-table-cell"]}>Shipping cost</div>
          <div className={styles["order-total-table-cell"]}>$55.08</div>
        </div>
        <div className={styles["order-total-table-row"]}>
          <div className={styles["order-total-table-cell"]}>
            GTS 7.0%(included)
          </div>
          <div className={styles["order-total-table-cell"]}>$55.08</div>
        </div> */}
        <div className={styles["order-total-table-row"]}>
          <div className={styles["order-total-table-cell"]}>Total</div>
          <div className={styles["order-total-table-cell"]}>
            {formatMoney(total().amount + discount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTotal;
