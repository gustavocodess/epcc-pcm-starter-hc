import React, { FC, useState } from "react";
import styles from "./DescriptionItem.module.scss";
import { Row, Col } from "antd";
import { ReactComponent as ChevronImage } from "src/assets/images/icons/chevron-down.svg";
import { DescriptionItemProps } from "../DescriptionItemType";

export const DescriptionItem: FC<DescriptionItemProps> = ({
  title,
  content,
  defaultState,
}) => {
  const [toggle, setToggle] = useState<boolean>(defaultState || false);
  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        className={styles.root__accordion}
      >
        <Col
          style={{ cursor: "pointer" }}
          onClick={() => {
            setToggle((toggle) => !toggle);
          }}
        >
          <h1 className={styles.root__title}>{title}</h1>
        </Col>
        <Col>
          <ChevronImage
            className={`${styles.root__icon} ${
              toggle ? styles.show : styles.hide
            }`}
            onClick={() => {
              setToggle((toggle) => !toggle);
            }}
          />
        </Col>
      </Row>{" "}
      <div
        className={`${styles.root__block} ${
          toggle ? styles.show : styles.hide
        }`}
      >
        {content}
        <div className={styles.root__border}></div>
      </div>
    </div>
  );
};
