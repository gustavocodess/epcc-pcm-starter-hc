import { Col, Row } from "antd";
import React from "react";
import styles from "./Trending.module.scss";
import Trending1 from "./../../../../src/assets/images/home-page/Trending1.png";
import Trending2 from "./../../../../src/assets/images/home-page/Trending2.png";
import Trending3 from "./../../../../src/assets/images/home-page/Trending3.png";
import Trending4 from "./../../../../src/assets/images/home-page/Trending4.png";
import Trending5 from "./../../../../src/assets/images/home-page/Trending5.png";
const Trending = () => {
  return (
    <div className={styles["trending"]}>
      <div className={styles["trending__title"]}>Trending Brands</div>
      <Row className={styles["trending__content"]}>
        <Col
          xs={24}
          sm={24}
          md={16}
          lg={16}
          xl={16}
          className={styles["trending__content"]}
        >
          <Row className={styles["trending__content__child"]}>
            <Col
              className={styles["trending__content__child__col"]}
              xs={24}
              sm={11}
              md={11}
              lg={4}
              xl={4}
            >
              <img
                className={styles["trending__content__child__col-img"]}
                src={Trending1}
                alt="Trending"
              />
            </Col>
            <Col
              className={styles["trending__content__child__col"]}
              xs={24}
              sm={11}
              md={11}
              lg={4}
              xl={4}
            >
              <img
                className={styles["trending__content__child__col-img"]}
                src={Trending2}
                alt="Trending"
              />
            </Col>
            <Col
              className={styles["trending__content__child__col"]}
              xs={24}
              sm={11}
              md={11}
              lg={4}
              xl={4}
            >
              <img
                className={styles["trending__content__child__col__center-img"]}
                src={Trending3}
                alt="Trending"
              />
            </Col>
            <Col
              className={styles["trending__content__child__col"]}
              xs={24}
              sm={11}
              md={11}
              lg={4}
              xl={4}
            >
              <img
                className={styles["trending__content__child__col__center-img"]}
                src={Trending4}
                alt="Trending"
              />
            </Col>
            <Col
              className={styles["trending__content__child__col"]}
              xs={24}
              sm={11}
              md={11}
              lg={4}
              xl={4}
            >
              <img
                className={styles["trending__content__child__col-img"]}
                src={Trending5}
                alt="Trending"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default Trending;
