import { Col, Row } from "antd";
import React from "react";
import styles from "./BestSelling.module.scss";
import BestSelling1 from "./../../../../src/assets/images/home-page/BestSelling1.png";
import BestSelling2 from "./../../../../src/assets/images/home-page/BestSelling2.png";
import BestSelling3 from "./../../../../src/assets/images/home-page/BestSelling3.png";
import BestSelling4 from "./../../../../src/assets/images/home-page/BestSelling4.png";
import BestSelling5 from "./../../../../src/assets/images/home-page/BestSelling5.png";
import { useAppSelector } from "src/hooks/hooks";
import { Link } from "react-router-dom";
import { isImageUrl } from "src/utils/imageUrl";

const BestSelling = () => {
  const { item, loading } = useAppSelector((state) => state.bestSelling);

  if (!item || loading) {
    return <div className={styles["container-slider"]}>Loading ...</div>;
  }

  const dataImage = item["component-details"];

  const topImage = [dataImage[0], dataImage[1]];
  const bottomImage = [dataImage[2], dataImage[3], dataImage[4]];

  return (
    <div className={styles.root}>
      <div className={styles.root__title}>Shop The Bestselling Brands</div>
      <Row className={styles.root__container}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Row className={styles["root__top-container"]}>
            <Col className={styles["root__top-col"]}>
              <Row className={styles["root__col-above"]} gutter={30}>
                {topImage.map((image: any, index: number) => {
                  let img = undefined;
                  switch (index % 2) {
                    case 0:
                      img = BestSelling1;
                      break;
                    case 1:
                      img = BestSelling2;
                      break;
                    default:
                      break;
                  }
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
                          src={
                            isImageUrl(image["image-uri"])
                              ? image["image-uri"]
                              : img
                          }
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
                  let img = undefined;
                  switch (index % 3) {
                    case 0:
                      img = BestSelling3;
                      break;
                    case 1:
                      img = BestSelling4;
                      break;
                    case 2:
                      img = BestSelling5;
                      break;
                    default:
                      break;
                  }
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
                          src={
                            isImageUrl(image["image-uri"])
                              ? image["image-uri"]
                              : img
                          }
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
export default BestSelling;
