import { Col, Row } from "antd";
import React from "react";
import styles from "./Assurance.module.scss";
import Assurance1 from "./../../../../src/assets/images/home-page/Assurance1.png";
import Assurance2 from "./../../../../src/assets/images/home-page/Assurance2.png";
import Assurance3 from "./../../../../src/assets/images/home-page/Assurance3.png";
import Assurance4 from "./../../../../src/assets/images/home-page/Assurance4.png";

const Assurance = () => {
  return (
    <div className={styles["assurance"]}>
      <div className={styles["assurance__title"]}>Our Assurance To You</div>
      <Row className={styles["assurance__content"]}>
        <Col
          xs={24}
          sm={24}
          md={16}
          lg={16}
          xl={16}
          className={styles["assurance__content"]}
        >
          <Row className={styles["assurance__content__item"]}>
            <Col
              className={styles["assurance__content__item__col"]}
              xs={24}
              sm={11}
              md={11}
              lg={5}
              xl={5}
            >
              <img
                className={styles["assurance__content__item__col__left-img"]}
                src={Assurance1}
                alt="Assurance"
              />
            </Col>
            <Col
              className={styles["assurance__content__item__col"]}
              xs={24}
              sm={11}
              md={11}
              lg={5}
              xl={5}
            >
              <img
                className={styles["assurance__content__item__col-img"]}
                src={Assurance2}
                alt="Assurance"
              />
            </Col>
            <Col
              className={styles["assurance__content__item__col"]}
              xs={24}
              sm={11}
              md={11}
              lg={5}
              xl={5}
            >
              <img
                className={styles["assurance__content__item__col__right-img"]}
                src={Assurance3}
                alt="Assurance"
              />
            </Col>
            <Col
              className={styles["assurance__content__item__col"]}
              xs={24}
              sm={11}
              md={11}
              lg={5}
              xl={5}
            >
              <img
                className={styles["assurance__content__item__col-img"]}
                src={Assurance4}
                alt="Assurance"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default Assurance;
