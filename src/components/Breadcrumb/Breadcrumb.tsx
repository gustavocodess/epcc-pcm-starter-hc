import React, { FC } from "react";
import styles from "./Breadcrumb.module.scss";
import { Breadcrumb as BreadcrumbAntd } from "antd";
import { BreadcrumbProps } from "./BreadcrumbType";
import { Link } from "react-router-dom";

const { Item } = BreadcrumbAntd;

export const Breadcrumb: FC<BreadcrumbProps> = ({
  items,
  current,
  loading,
}) => {
  if (current && Array.isArray(items)) {
    items.push({
      title: current,
    });
  }
  return (
    <div className={styles.root}>
      {items?.length > 0 ? (
        <BreadcrumbAntd separator=">">
          <Item>
            <Link to="/">Home</Link>
          </Item>
          {items.map((item, index) => {
            return (
              <Item
                className={
                  items.length - 1 === index
                    ? styles["root__item--active"]
                    : styles.root__item
                }
                key={index}
              >
                {item.path ? (
                  <Link to={item.path}>{item.title}</Link>
                ) : (
                  <span>{item.title}</span>
                )}
              </Item>
            );
          })}
        </BreadcrumbAntd>
      ) : (
        <BreadcrumbAntd separator=">">
          <Item>
            <Link to="/">Home</Link>
          </Item>
        </BreadcrumbAntd>
      )}
    </div>
  );
};
