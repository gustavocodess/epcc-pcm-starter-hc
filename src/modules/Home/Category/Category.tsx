import React, { FC } from "react";
import { Col, Row, Skeleton } from "antd";
import styles from "./Category.module.scss";

import { useAppSelector } from "src/hooks/hooks";
import { Link } from "react-router-dom";

const Category: FC = () => {
  const { item, loading } = useAppSelector((state) => state.category);

  if (!item || loading) {
    return (
      <div className={styles["container-slider"]}>
        <Skeleton />
      </div>
    );
  }

  const dataImage = item["component-details"];

  const topImage = [dataImage[0], dataImage[1]];
  const bottomImage = [dataImage[2], dataImage[3], dataImage[4]];

  return (
    <div className={styles.root}>
      <div className={styles.root__title}>Shop By Category</div>
      <Row className={styles.root__container}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Row className={styles["root__top-container"]}>
            <Col className={styles["root__top-col"]}>
              <Row className={styles["root__col-above"]} gutter={30}>
                {topImage.map((image: any, index: number) => {
                  return (
                    <Col
                      key={index}
                      className={styles["root__item"]}
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <div className={styles["root__product"]}>
                        <img
                          className={styles["root__product-img"]}
                          src={image["image-uri"]}
                          alt="BestSelling"
                        />
                        <div className={styles["root__product-content"]}>
                          <p className={styles["root__product-name"]}>
                            {image["text-1"]}
                          </p>
                          <div className={styles["root__product-button-link"]}>
                            <Link
                              to={image["cta-uri"]}
                              className={styles["root__product-link"]}
                            >
                              {image["cta-text"]}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col className={styles["root__top-col"]} span={24}>
              <Row className={styles["root__col-above"]} gutter={30}>
                {bottomImage.map((image: any, index: number) => {
                  return (
                    <Col
                      className={styles["root__item"]}
                      xs={24}
                      sm={24}
                      md={8}
                      lg={8}
                      xl={8}
                      key={index}
                    >
                      <div className={styles["root__product"]}>
                        <img
                          className={styles["root__product-img"]}
                          src={image["image-uri"]}
                          alt="BestSelling"
                        />
                        <div className={styles["root__product-content"]}>
                          <p className={styles["root__product-name"]}>
                            {image["text-1"]}
                          </p>
                          <div className={styles["root__product-button-link"]}>
                            <Link
                              to={image["cta-uri"]}
                              className={styles["root__product-link"]}
                            >
                              {image["cta-text"]}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default Category;
