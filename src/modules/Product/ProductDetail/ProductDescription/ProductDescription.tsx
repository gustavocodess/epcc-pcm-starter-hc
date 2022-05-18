import React, { FC } from "react";
import styles from "./ProductDescription.module.scss";
import { Row, Col } from "antd";
import { DescriptionItem } from "./DescriptionItem/DescriptionItem";
import { ProductDescriptionProps } from "./DescriptionItemType";

const detailContent = (data: any) => {
  return (
    <>
      {data ? (
        <div className={styles["details-wrapper"]}>
          <div className={styles["details-properties"]}>
            {Object.keys(data).map((key, index) => {
              if (!data[key]) {
                return "";
              }

              return (
                <div className={styles["property"]} key={index}>
                  <div className={styles["property__key"]}>{key}:</div>
                  <div>{data[key]}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export const ProductDescription: FC<ProductDescriptionProps> = ({
  title,
  details,
}) => {
  return (
    <Row className={styles.root}>
      <Col xs={24} md={16}>
        <DescriptionItem
          title={title}
          content={detailContent(details)}
          defaultState={true}
        />
      </Col>
    </Row>
  );
};
