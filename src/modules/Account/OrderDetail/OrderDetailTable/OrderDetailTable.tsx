import React, { FC } from "react";
import styles from "./OrderDetailTable.module.scss";
import Paypal from "../../../../assets/images/Account/Visa.jpg";
import IconCheck from "../../../../assets/images/icons/Check-mark.png";
import PackageOrder from "../../../../assets/images/icons/Packing-icon.png";
import moment from "moment";

const OrderDetailTable: FC<{ data: any }> = ({ data }) => {
  enum StatusEnum {
    packingOrder,
    completed = "complete",
  }

  if (!data) {
    return <></>
  }

  return (
    <table className={styles["order-detail-table"]}>
      <thead>
        <tr>
          <th>Payment Method</th>
          <th>Shipping Address</th>
          <th>Date of Order</th>
        </tr>
      </thead>
      <tbody>
        {data && (
          <tr className={styles["order-detail-table-row"]}>
            <td className={styles["order-detail-table-cell"]}>
              <img src={Paypal} alt="" />
            </td>
            <td className={styles["order-detail-table-cell"]}>
              <p>{`${data?.shipping_address?.first_name} ${data?.shipping_address?.last_name}`}</p>
              <p>{`${data?.shipping_address?.line_1} ${data?.shipping_address?.line_2}`}</p>
              <p>{`${data?.shipping_address?.postcode} ${data?.shipping_address?.country}`}</p>
              <p>{`Mobile: +${data?.shipping_address?.phone_number}`}</p>
            </td>
            <td className={styles["order-detail-table-cell"]}>
              <div>
                {moment(data?.meta?.timestamps?.created_at).format(
                  "DD MMM YYYY"
                )}
              </div>
              <div className={styles["order-status__title"]}>Order Status</div>
              <div>
                {data?.status === StatusEnum.packingOrder ? (
                  <div className={styles["order-status"]}>
                    <img
                      className={styles["order-status__icon"]}
                      src={PackageOrder}
                      alt=""
                    ></img>
                    <div className={styles["order-status__text"]}>
                      Packing order
                    </div>
                  </div>
                ) : (
                  <div className={styles["order-status"]}>
                    <img
                      className={styles["order-status__icon"]}
                      src={IconCheck}
                      alt=""
                    ></img>
                    <div className={styles["order-status__text"]}>
                      Completed
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OrderDetailTable;
