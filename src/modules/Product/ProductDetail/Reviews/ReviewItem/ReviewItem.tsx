import ReviewImage from "src/assets/images/product-detail/ReviewImage.jpg";

import React, { FC } from "react";
import styles from "./ReviewItem.module.scss";
import { Row, Col, Rate } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

interface ReviewItemProps {
  title: string;
  comment: string;
  buyDate: string;
  customerName: string;
  customerLocation: string;
}

export const ReviewItem: FC<ReviewItemProps> = ({
  title,
  comment,
  buyDate,
  customerName,
  customerLocation,
}: any) => {
  return (
    <Row className={styles.root}>
      <Col xs={24} md={4} className={styles.root__user}>
        <p className={styles.root__date}>{buyDate}</p>
        <p className={styles.root__account}>
          {customerName} <span className={styles.root__dot}></span>{" "}
          {customerLocation}
        </p>
        <p className={styles.root__verified}>
          <CheckCircleTwoTone
            twoToneColor="#1E9C23"
            className={styles.root__icon}
          />{" "}
          Verified Buyer
        </p>
      </Col>
      <Col xs={24} md={20} className={styles.root__content}>
        <Rate disabled defaultValue={5} allowHalf />{" "}
        <span className={styles.root__title}>{title}</span>
        <p className={styles.root__comment}>{comment}</p>
        <Row gutter={8}>
          <Col xs={6} md={4} xl={2}>
            <img src={ReviewImage} alt="" width="75px" />
          </Col>
          <Col xs={6} md={4} xl={2}>
            <img src={ReviewImage} alt="" width="75px" />
          </Col>
          <Col xs={6} md={4} xl={2}>
            <img src={ReviewImage} alt="" width="75px" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
