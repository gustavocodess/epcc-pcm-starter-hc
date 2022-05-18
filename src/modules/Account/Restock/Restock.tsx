import React, { FC } from "react";
import styles from "./Restock.module.scss";
import { useAppSelector } from "src/hooks/hooks";
import RestockItem from "./RestockItem/RestockItem";

const Restock: FC<any> = () => {
  const clientAccount = useAppSelector((state) => state.account);
  const { account } = clientAccount;

  const { completeOrderList } = account;

  return (
    <div className={styles.root}>
      <div className={styles["dashboard__col__center"]}>
        <div className={styles["dashboard__col__center__title"]}>
          RESTOCK PAST PURCHASES
        </div>
        <div className={styles["dashboard__col__center__parent-bottom"]}>
          <div className={styles["dashboard__col__center-bottom"]}>
            {completeOrderList?.length === 0 && (
              <p>You don't have purchases restock</p>
            )}
            {completeOrderList &&
              completeOrderList?.length > 0 &&
              completeOrderList.slice(0, 2).map((item: any, index: number) => {
                return <RestockItem item={item} key={index} />;
              })}
          </div>
        </div>
      </div>
      <div className={styles["dashboard__col__center__btn-bottom"]}>
        VIEW ALL
      </div>
    </div>
  );
};

export default Restock;
