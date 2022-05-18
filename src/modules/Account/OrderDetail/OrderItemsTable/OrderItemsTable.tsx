import React, { FC } from "react";
import styles from "./OrderItemsTable.module.scss";
import OrderItem from "./OrderItem/OrderItem";

const OrderItemsTable: FC<{ orderItems: any[] }> = ({ orderItems }) => {
  return (
    <table className={styles["order-items-table"]}>
      <thead>
        <tr>
          <th className={styles["table-header__items"]}>Items</th>
          <th>Unit price</th>
          <th>Discounted</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {orderItems
          .filter((x: any) => x.sku !== "shipping-fee")
          .map((item, index) => {
            return <OrderItem item={item} key={index} />;
          })}
      </tbody>
    </table>
  );
};

export default OrderItemsTable;
