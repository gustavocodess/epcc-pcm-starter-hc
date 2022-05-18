import React, { useState } from "react";
import styles from "./OrdersTable.module.scss";
import { useAppSelector } from "src/hooks/hooks";
import OrderItem from "./OrderItem/OrderItem";
import { Pagination } from "antd";
import { ORDERS_PER_PAGE } from "src/config";

const OrdersTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const customerAccount = useAppSelector((state) => state.account);
  const { account } = customerAccount;
  const { orderList } = account;

  if (!orderList) {
    return <div></div>;
  }

  return (
    <>
      <Pagination
        className={styles.paging}
        defaultCurrent={1}
        total={orderList.length}
        onChange={(page) => setCurrentPage(page)}
      />
      <p className={styles.quantity}>
        Show from {ORDERS_PER_PAGE * (currentPage - 1) + 1} to
        {Math.min(ORDERS_PER_PAGE * currentPage, orderList.length)} of{" "}
        {orderList.length} orders
      </p>
      <table className={styles["orders-table"]}>
        <thead className={styles["orders-table-thead"]}>
          <tr>
            <th>Order number</th>
            <th>Date of order</th>
            <th>Ordered items</th>
            <th>Total</th>
            <th>Order status</th>
            <th>Reorder(optional)</th>
          </tr>
        </thead>
        <tbody>
          {orderList.length !== 0
            ? orderList
                .slice(
                  ORDERS_PER_PAGE * (currentPage - 1),
                  ORDERS_PER_PAGE * currentPage
                )
                .map((order: any, index: number) => {
                  return <OrderItem order={order} key={index} />;
                })
            : "You have no item ordered !"}
        </tbody>
      </table>
    </>
  );
};

export default OrdersTable;
