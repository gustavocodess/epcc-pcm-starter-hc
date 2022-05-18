import React, { FC } from "react";
import styles from "./Reviews.module.scss";
import { Row, Col, Select, Button } from "antd";
import { ReviewItem } from "./ReviewItem/ReviewItem";

const { Option } = Select;

export const Reviews: FC = () => {
  return (
    <div className={styles.root}>
      <Row justify="space-between">
        <Col>
          <h1 className={styles.root__title}>Reviews</h1>
        </Col>
        <Col>
          <p className={styles["root__sort-text"]}>Sort:</p>
          <Select defaultValue={1} onChange={() => {}}>
            <Option value={1}>Most recent to oldest</Option>
            <Option value={2}>Most recent to oldest</Option>
            <Option value={3}>Most recent to oldest</Option>
            <Option value={4}>Most recent to oldest</Option>
          </Select>
        </Col>
      </Row>
      <div className={styles["root__review-container"]}>
        <ReviewItem
          title="Great service"
          comment="Customer service and support was phenomenal. I had a small issue... It was my mistake... But they made it right. Thank you so much!!!"
          buyDate="12 Dec 2021"
          customerName="Mary"
          customerLocation="VietNam"
        />
        <ReviewItem
          title="Almost completely perfect!"
          comment="Received in good quality. I love it. Shipment was fast"
          buyDate="5 Oct 2021"
          customerName="Alex"
          customerLocation="United States"
        />
        <ReviewItem
          title="Amazing items for a great price"
          comment="These are very high quality. They look very nice."
          buyDate="28 May 2020"
          customerName="Rog"
          customerLocation="United States"
        />
        <Button size="large" className={styles.root__button}>
          <span>View more</span>
        </Button>
      </div>
    </div>
  );
};
