import { Col, Row } from "antd";
import React from "react";
import styles from "./Featured.module.scss";
import Featured1 from "./../../../../src/assets/images/home-page/Featured1.png";
import Featured2 from "./../../../../src/assets/images/home-page/Featured2.png";
import Featured3 from "./../../../../src/assets/images/home-page/Featured3.png";
import Featured4 from "./../../../../src/assets/images/home-page/Featured4.png";
import { useAppSelector } from "src/hooks/hooks";
import { Link } from "react-router-dom";
import { isImageUrl } from "src/utils/imageUrl";

const Featured = () => {
  const { item, promotion } = useAppSelector((state) => state.featuredItem);

  return (
    <div className={styles["featured-items"]}>
      <div className={styles["featured-items__title"]}>Featured Items</div>
      <Row className={styles["featured-items__parent"]}>
        <Col
          className={styles["featured-items__parent"]}
          xs={24}
          sm={24}
          md={16}
          lg={16}
          xl={16}
        >
          {item["component-details"].map((item: any, index: number) => {
            let image = undefined;
            switch (index) {
              case 0:
                image = Featured1;
                break;
              case 1:
                image = Featured2;
                break;
              case 2:
                image = Featured3;
                break;
              default:
                break;
            }
            return (
              <Row className={styles["featured-items__top"]} key={index}>
                <Col
                  className={styles["featured-items__top-left"]}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={11}
                  order={index % 2 === 0 ? 1 : 2}
                >
                  <img
                    src={
                      isImageUrl(item["image-uri"]) ? item["image-uri"] : image
                    }
                    className={styles["featured-items__top__img-left"]}
                    alt="Featured"
                  />
                </Col>
                <Col
                  className={styles["featured-items__top-left"]}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={11}
                  order={index % 2 === 1 ? 1 : 2}
                >
                  <div
                    className={
                      styles[
                        `featured-items__top-right${
                          index % 2 === 1 ? "-reverse" : ""
                        }`
                      ]
                    }
                  >
                    <div className={styles["featured-items__top__title-right"]}>
                      {item["text-1"]}
                    </div>
                    <div
                      className={
                        styles["featured-items__top__des_parent-right"]
                      }
                    >
                      <div
                        className={
                          styles[
                            `featured-items__top__des-right${
                              index % 2 === 1 ? "-reverse" : ""
                            }`
                          ]
                        }
                      >
                        <p>{item["text-2"]}</p>
                      </div>
                    </div>
                    <div
                      className={
                        styles["featured-items__top__view__parent-right"]
                      }
                    >
                      <div
                        className={styles["featured-items__top__view-right"]}
                      >
                        <Link to={item["cta-uri"]}>{item["cta-text"]}</Link>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            );
          })}
          <Row className={styles["featured-items__top__bottom"]}>
            <Col
              className={styles["featured-items__top-left"]}
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
            >
              <Link to={promotion["component-details"][0]["cta-uri"]}>
                <img
                  src={
                    isImageUrl(promotion["component-details"][0]["image-uri"])
                      ? promotion["component-details"][0]["image-uri"]
                      : Featured4
                  }
                  className={styles["featured-items__top__img-left"]}
                  alt="Featured"
                />
              </Link>
            </Col>
            <Col
              className={styles["featured-items__top-left-main"]}
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
            >
              <div className={styles["featured-items__top-right"]}>
                <div className={styles["featured-items__top__content-right"]}>
                  {promotion["component-details"][0]["text-1"]}
                </div>
                <div className={styles["featured-items__top__content-right"]}>
                  {promotion["component-details"][0]["text-2"]}
                </div>
                <div
                  className={styles["featured-items__top__view__parent-right"]}
                >
                  <Link to={promotion["component-details"][0]["cta-uri"]}>
                    <div className={styles["featured-items__top__view-right"]}>
                      {promotion["component-details"][0]["cta-text"]}
                    </div>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default Featured;
