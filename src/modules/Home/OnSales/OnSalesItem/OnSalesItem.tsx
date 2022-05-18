import React, { FC } from "react";
import styles from "./OnSalesItem.module.scss";
import { OnSalesItemProps } from "./OnSalesItemType";
import { Link } from "react-router-dom";

export const OnSalesItem: FC<OnSalesItemProps> = ({
  image,
  name,
  link,
  text,
}) => {
  return (
    <div className={styles.root}>
      <Link to={link ? link : "/"}>
        <img
          className={styles["root__product-image"]}
          src={image}
          alt="ProductList"
          width="100%"
        />
      </Link>{" "}
      <div className={styles["root__product-name"]}>{name}</div>
      <div className={styles["root__product-link"]}>
        <Link to={link ? link : "/"}>{text}</Link>
      </div>
    </div>
  );
};
