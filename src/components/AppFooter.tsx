import {
  BehanceOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  WechatOutlined,
  RedditOutlined,
  UpOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import GooglePlay from "./../assets/images/home-page/GooglePlay.png";
import AppStore from "./../assets/images/home-page/AppStore.png";
import footer1 from "./../assets/images/home-page/footer1.png";
import React, { useEffect, useState } from "react";
import styles from "./AppFooter.module.scss";
import { Promotion } from "./Promotion/Promotion";
const AppFooter = () => {
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [checkTop, setCheckTop] = useState(0);
  const handleScrollTop = (): void => {
    setScrollTop(1);
  };
  const handleScroll = () => {
    if (Math.ceil(window.innerHeight + window.scrollY) <= 1100) {
      setCheckTop(0);
    } else {
      setCheckTop(1);
    }
  };
  useEffect(() => {
    if (scrollTop === 1) {
      window.scrollTo(0, 0);
      setScrollTop(0);
    }
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollTop]);
  return (
    <div className={styles["footer"]}>
      <Row className={styles["footer__content"]}>
        <Col
          xs={24}
          sm={24}
          md={16}
          lg={16}
          xl={16}
          className={styles["footer__content"]}
        >
          {checkTop === 1 ? (
            <div className={styles["footer__content-hard"]}>
              <Promotion />
              <div
                onClick={handleScrollTop}
                className={styles["footer__content__back-hard"]}
              >
                <div>
                  <UpOutlined />
                </div>
                <div>
                  <p>BACK</p>
                  <p>TO</p>
                  <p>TOP</p>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <Row className={styles["footer__content-top"]}>
            <Col
              className={styles["footer__content__item-top"]}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div className={styles["footer__content__item__left-top"]}>
                <div className={styles["footer__content__item__left__des-top"]}>
                  Loving our products from NewChic?
                </div>
                <div className={styles["footer__content__item__left__des-top"]}>
                  Why not join our newsletter!
                </div>
              </div>
            </Col>
            <Col
              className={styles["footer__content__item-top"]}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <Row className={styles["footer__content__item__right-top"]}>
                <Col
                  className={styles["footer__content__item__right__col-top"]}
                  xs={24}
                  sm={24}
                  md={16}
                  lg={16}
                  xl={16}
                >
                  <input
                    className={
                      styles["footer__content__item__right__input-top"]
                    }
                    placeholder="Email address"
                  />
                </Col>
                <Col
                  className={styles["footer__content__item__right__col-top"]}
                  xs={24}
                  sm={24}
                  md={8}
                  lg={8}
                  xl={8}
                >
                  <div>Sign Up</div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={styles["footer__content__main"]}>
            <Col
              className={styles["footer__content__main-col"]}
              xs={24}
              sm={24}
              md={7}
              lg={7}
              xl={7}
            >
              <div className={styles["footer__content__main__title-col"]}>
                <div
                  className={styles["footer__content__main__title__follow-col"]}
                >
                  Follow us
                </div>
                <Row
                  className={styles["footer__content__main__title__row-col"]}
                >
                  <Col xs={24} sm={11} md={11} lg={5} xl={3}>
                    <InstagramOutlined
                      className={
                        styles["footer__content__main__title__icon-col"]
                      }
                    />
                  </Col>
                  <Col xs={24} sm={11} md={11} lg={5} xl={3}>
                    <RedditOutlined
                      className={
                        styles["footer__content__main__title__icon-col"]
                      }
                    />
                  </Col>
                  <Col xs={24} sm={11} md={11} lg={5} xl={3}>
                    <LinkedinOutlined
                      className={
                        styles["footer__content__main__title__icon-col"]
                      }
                    />
                  </Col>
                  <Col xs={24} sm={11} md={11} lg={5} xl={3}>
                    <TwitterOutlined
                      className={
                        styles["footer__content__main__title__icon-col"]
                      }
                    />
                  </Col>
                  <Col xs={24} sm={11} md={11} lg={5} xl={3}>
                    <FacebookOutlined
                      className={
                        styles["footer__content__main__title__icon-col"]
                      }
                    />
                  </Col>
                  <Col xs={24} sm={11} md={11} lg={5} xl={3}>
                    <BehanceOutlined
                      className={
                        styles["footer__content__main__title__icon-col"]
                      }
                    />
                  </Col>
                </Row>
              </div>
            </Col>
            <Col
              className={styles["footer__content__main-col"]}
              xs={24}
              sm={24}
              md={8}
              lg={8}
              xl={8}
            >
              <div className={styles["footer__content__main__title-col"]}>
                <div
                  className={styles["footer__content__main__title__follow-col"]}
                >
                  Download the Newchic App
                </div>
                <Row
                  className={styles["footer__content__main__title__center-col"]}
                >
                  <Col
                    className={
                      styles["footer__content__main__title__center__parent-col"]
                    }
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div
                      className={
                        styles[
                          "footer__content__main__title__center__parent__appstore-col"
                        ]
                      }
                    >
                      <div>
                        <img
                          src={GooglePlay}
                          className={
                            styles[
                              "footer__content__main__title__center__parent__appstore__img-col"
                            ]
                          }
                          alt="AppStore"
                        />
                      </div>
                      <div
                        className={
                          styles[
                            "footer__content__main__title__center__parent__appstore__text-col"
                          ]
                        }
                      >
                        <div>GET IT ON</div>
                        <div
                          className={
                            styles[
                              "footer__content__main__title__center__parent__appstore__text__parent-col"
                            ]
                          }
                        >
                          Google Play
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col
                    className={
                      styles["footer__content__main__title__center__parent-col"]
                    }
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div
                      className={
                        styles[
                          "footer__content__main__title__center__parent__appstore-col"
                        ]
                      }
                    >
                      <div>
                        <img
                          src={AppStore}
                          className={
                            styles[
                              "footer__content__main__title__center__parent__appstore__img-col"
                            ]
                          }
                          alt="AppStore"
                        />
                      </div>
                      <div
                        className={
                          styles[
                            "footer__content__main__title__center__parent__appstore__text-col"
                          ]
                        }
                      >
                        <div>Download on the</div>
                        <div
                          className={
                            styles[
                              "footer__content__main__title__center__parent__appstore__text__parent-col"
                            ]
                          }
                        >
                          App Store
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col
              className={styles["footer__content__main-col"]}
              xs={24}
              sm={24}
              md={7}
              lg={7}
              xl={7}
            >
              <img
                className={styles["footer__content__main__img-col"]}
                src={footer1}
                alt="Footer"
              />
            </Col>
          </Row>
          <div className={styles["footer__content__bottom"]}>
            <div>FAQ</div>
            <div>ABOUT US</div>
            <div>CONTACT US</div>
            <div>TERMS OF USE</div>
            <div>PRIVACY POLICY</div>
          </div>
        </Col>
      </Row>
      <div className={styles["chat"]}>
        <WechatOutlined className={styles["chat__icon"]} />
      </div>
    </div>
  );
};
export default AppFooter;
