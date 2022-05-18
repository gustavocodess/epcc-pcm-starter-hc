import React from "react";
import styles from "./Orders.module.scss";
import OrdersTable from "./OrdersTable/OrdersTable";

const Orders = () => {
  return (
    <div className={styles.orders}>
      <div className={styles["orders-title"]}>Orders</div>
      <div className={styles["orders-links"]}>
        <a className={styles["orders-links__text"]} href="/#">Need help? Please read our FAQs</a>
        <a className={styles["orders-links__text"]} href="/#">Orders</a>
        <a className={styles["orders-links__text"]} href="/#">Shipping & Returns</a>
        <a className={styles["orders-links__text"]} href="/#">Delivery</a>
        <a className={styles["orders-links__text"]} href="/#">Payments</a>
      </div>
      <OrdersTable></OrdersTable>
    </div>
  );
};

export default Orders;
