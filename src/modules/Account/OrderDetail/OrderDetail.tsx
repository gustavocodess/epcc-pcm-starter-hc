import React, { FC, useState, useEffect } from "react";
import styles from "./OrderDetail.module.scss";
import OrderDetailTable from "./OrderDetailTable/OrderDetailTable";
import OrderItemsTable from "./OrderItemsTable/OrderItemsTable";
import OrderTotal from "./OrderTotal/OrderTotal";
import { useParams } from "react-router-dom";
import { getCustomerOrderDetail } from "../AccountService";
import { getCustomerToken } from "src/modules/Customer/customerService";

const OrderDetail: FC = () => {
  const { orderId } = useParams<any>();
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      const { token } = getCustomerToken();
      const data = await getCustomerOrderDetail(orderId, token);
      setData(data);
    };
    init();
  }, [orderId]);

  return (
    <div className={styles["order-detail"]}>
      <div className={styles["order-detail-title"]}>ORDER(S) {orderId}</div>
      <OrderDetailTable data={data?.data?.[0]}></OrderDetailTable>
      <OrderItemsTable
        orderItems={data?.included?.items || []}
      ></OrderItemsTable>
      <OrderTotal orderPrice={data?.included?.items || []}></OrderTotal>
    </div>
  );
};

export default OrderDetail;
