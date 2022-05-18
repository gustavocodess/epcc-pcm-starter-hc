import { Col, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./Dashboard.module.scss";
import Account2 from "./../../../../src/assets/images/Account/Account2.png";
import Account3 from "./../../../../src/assets/images/Account/Account3.png";
import Account4 from "./../../../../src/assets/images/Account/Account4.png";
import { StarOutlined } from "@ant-design/icons";
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import IconCheck from "../../../../src/assets/images/icons/Check-mark.png";
import {
  fetchAccountDetail,
  fetchCompleteOrders,
  fetchCustomerOrders,
} from "../AccountSlice";
import Restock from "../Restock/Restock";
import moment from "moment";
import { getCustomerToken } from "src/modules/Customer/customerService";
import {
  fetchProductByProductId,
  getCustomerOrderDetail,
} from "../AccountService";
import { formatMoney } from "src/utils/helper";

const Dashboard = () => {
  let { url } = useRouteMatch();
  const history = useHistory();
  const [newestOrder, setNewestOrder] = useState<any>();
  const clientAccount = useAppSelector((state) => state.account);
  const [isFetchData, setFetch] = useState(false);
  const { account } = clientAccount;
  const [image, setImage] = useState<any>();
  const [image2, setImage2] = useState<any>();

  const { accountDetail, orderList } = account;
  const dispatch = useAppDispatch();

  const customerAccount = useMemo(() => {
    return {
      email: account.email,
      password: account.password,
    };
  }, [account]);

  useEffect(() => {
    const { customer, token } = getCustomerToken();
    if (isFetchData) {
      return;
    }

    if (customer && token) {
      dispatch(fetchAccountDetail({ customer, token }));
      dispatch(fetchCustomerOrders(token));
      dispatch(fetchCompleteOrders(token));
      setFetch(true);
    } else {
      history.push("/");
    }
  }, [isFetchData, history, account, dispatch, customerAccount]);

  useEffect(() => {
    const init = async () => {
      if (orderList && Array.isArray(orderList)) {
        setNewestOrder(orderList[0]);
        const { token } = getCustomerToken();
        const orderDetail: any = await getCustomerOrderDetail(
          orderList?.[0]?.id,
          token
        );

        const items = orderDetail?.included?.items || [];
        let index = 0;
        // set image 1
        for (let i = 0; i < items.length; i++) {
          const element = items[i];
          index = i;
          if (element.sku !== "shipping-fee") {
            const product = await fetchProductByProductId(element.product_id);
            const imageSrc = product?.included?.main_images?.[0]?.link?.href;
            setImage(imageSrc);
            break;
          }
        }

        // set image 2
        for (let j = 1; j < items.length; j++) {
          const element = items[j];

          if (j === index) {
            continue;
          }

          if (element.sku !== "shipping-fee") {
            const product2 = await fetchProductByProductId(element.product_id);
            const imageSrc2 = product2?.included?.main_images?.[0]?.link?.href;
            setImage2(imageSrc2);

            break;
          }
        }
      }
    };
    init();
  }, [orderList]);

  return (
    <Row className={styles.dashboard} gutter={[20, 40]} align="stretch">
      <Col
        className={styles["dashboard__col"]}
        xs={24}
        sm={24}
        md={11}
        lg={10}
        xl={12}
      >
        <div className={styles["dashboard__col__center"]}>
          <div className={styles["dashboard__col__center__title"]}>ORDERS</div>
          <div
            style={{ alignItems: "flex-start" }}
            className={styles["dashboard__col__center-bottom"]}
          >
            {!newestOrder && "You have no ordered item"}
            {newestOrder && (
              <>
                <div className={styles["dashboard__image"]}>
                  {image && <img src={image} alt="product" width="80%" />}
                  {image2 && <img src={image2} alt="product" width="80%" />}
                </div>
                <div className={styles["dashboard__col__center__rx-bottom"]}>
                  {newestOrder.id}
                </div>
                <Row className={styles["dashboard__col__center__date-bottom"]}>
                  <Col
                    xs={24}
                    sm={24}
                    md={8}
                    lg={8}
                    xl={8}
                    className={
                      styles["dashboard__col__center__date__col-bottom"]
                    }
                  >
                    Date of Order
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={4}
                    lg={4}
                    xl={4}
                    className={
                      styles["dashboard__col__center__date__col__center-bottom"]
                    }
                  >
                    Total
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={8}
                    lg={8}
                    xl={8}
                    className={
                      styles["dashboard__col__center__date__col-bottom"]
                    }
                  >
                    <div
                      className={
                        styles["dashboard__col__center__park__img-bottom"]
                      }
                    >
                      Order status
                    </div>
                  </Col>
                </Row>
                <Row className={styles["dashboard__col__center__main-bottom"]}>
                  <Col
                    className={
                      styles["dashboard__col__center__main__col-bottom"]
                    }
                    xs={24}
                    sm={24}
                    md={8}
                    lg={8}
                    xl={8}
                  >
                    {moment(newestOrder?.meta?.timestamps?.created_at).format(
                      "DD MMM YYYY"
                    )}
                  </Col>
                  <Col
                    className={
                      styles["dashboard__col__center__main__col-bottom"]
                    }
                    xs={24}
                    sm={24}
                    md={5}
                    lg={5}
                    xl={5}
                  >
                    {formatMoney(
                      newestOrder.meta.display_price.with_tax.amount
                    )}
                  </Col>
                  <Col
                    className={
                      styles["dashboard__col__center__main__col-bottom"]
                    }
                    xs={24}
                    sm={24}
                    md={6}
                    lg={6}
                    xl={6}
                  >
                    {newestOrder.status === "incomplete" ? (
                      <div className={styles["order-status"]}>
                        <img
                          className={styles["order-status__icon"]}
                          src={Account2}
                          alt=""
                        ></img>
                        <div className={styles["order-status__text"]}>
                          Packing order
                        </div>
                      </div>
                    ) : (
                      <div className={styles["order-status"]}>
                        <img
                          className={styles["order-status__icon"]}
                          src={IconCheck}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "0.5rem",
                          }}
                        ></img>
                        <div className={styles["order-status__text"]}>
                          Completed
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </div>
        </div>
        <div className={styles["dashboard__col__center__btn-bottom"]}>
          <NavLink to="/account/orders">VIEW ALL</NavLink>
        </div>
      </Col>
      <Col
        className={styles["dashboard__col"]}
        xs={24}
        sm={24}
        md={11}
        lg={10}
        xl={12}
      >
        <div className={styles["dashboard__col__center"]}>
          <div className={styles["dashboard__col__center__title"]}>
            WISHLIST
          </div>
          <div className={styles["dashboard__col__center__parent-bottom"]}>
            <div className={styles["dashboard__col__center-bottom"]}>
              <Row className={styles["dashboard__col__center__right-bottom"]}>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
                  }
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={4}
                >
                  <img
                    className={
                      styles["dashboard__col__center__right__col__img-bottom"]
                    }
                    src={Account3}
                    alt="Account"
                  />
                </Col>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
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
                        "dashboard__col__center__right__col__center-bottom"
                      ]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__center__title-bottom"
                        ]
                      }
                    >
                      Baellery
                    </div>
                    <div>
                      PU Leather Shoulder Bag Smooth leather, Maroon Color
                    </div>
                    <div>$45.09</div>
                  </div>
                </Col>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
                  }
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={7}
                >
                  <div
                    className={
                      styles["dashboard__col__center__right__col__btn-bottom"]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__btn__add-bottom"
                        ]
                      }
                    >
                      ADD TO BAG
                    </div>
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__btn__remove-bottom"
                        ]
                      }
                    >
                      REMOVE
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className={styles["dashboard__col__center-bottom"]}>
              <Row className={styles["dashboard__col__center__right-bottom"]}>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
                  }
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={4}
                >
                  <img
                    className={
                      styles["dashboard__col__center__right__col__img-bottom"]
                    }
                    src={Account4}
                    alt="Account"
                  />
                </Col>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
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
                        "dashboard__col__center__right__col__center-bottom"
                      ]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__center__title-bottom"
                        ]
                      }
                    >
                      Baellery
                    </div>
                    <div>
                      PU Leather Shoulder Bag Smooth leather, Maroon Color
                    </div>
                    <div>$45.09</div>
                  </div>
                </Col>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
                  }
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={7}
                >
                  <div
                    className={
                      styles["dashboard__col__center__right__col__btn-bottom"]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__btn__add-bottom"
                        ]
                      }
                    >
                      ADD TO BAG
                    </div>
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__btn__remove-bottom"
                        ]
                      }
                    >
                      REMOVE
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className={styles["dashboard__col__center__btn-bottom"]}>
          <NavLink to={`${url}/orders`}>VIEW ALL</NavLink>
        </div>
      </Col>
      <Col
        className={styles["dashboard__col"]}
        xs={24}
        sm={24}
        md={11}
        lg={10}
        xl={12}
      >
        <div className={styles["dashboard__col__center"]}>
          <div className={styles["dashboard__col__center__title"]}>REVIEWS</div>
          <div className={styles["dashboard__col__center__parent-bottom"]}>
            <div className={styles["dashboard__col__center-bottom"]}>
              <Row className={styles["dashboard__col__center__right-bottom"]}>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
                  }
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={4}
                >
                  <img
                    className={
                      styles["dashboard__col__center__right__col__img-bottom"]
                    }
                    src={Account3}
                    alt="Account"
                  />
                </Col>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
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
                        "dashboard__col__center__right__col__center-bottom"
                      ]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__center__title-bottom"
                        ]
                      }
                    >
                      Baellery
                    </div>
                    <div>
                      PU Leather Shoulder Bag Smooth leather, Maroon Color
                    </div>
                    <div>$45.09</div>
                  </div>
                </Col>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
                  }
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={8}
                >
                  <div
                    className={
                      styles["dashboard__col__center__right__col__star-bottom"]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__star__top-bottom"
                        ]
                      }
                    >
                      <StarOutlined
                        className={
                          styles[
                            "dashboard__col__center__right__col__star__top__item-bottom"
                          ]
                        }
                      />
                      <StarOutlined
                        className={
                          styles[
                            "dashboard__col__center__right__col__star__top__item-bottom"
                          ]
                        }
                      />
                      <StarOutlined
                        className={
                          styles[
                            "dashboard__col__center__right__col__star__top__item-bottom"
                          ]
                        }
                      />
                      <StarOutlined
                        className={
                          styles[
                            "dashboard__col__center__right__col__star__top__item-bottom"
                          ]
                        }
                      />
                      <StarOutlined
                        className={
                          styles[
                            "dashboard__col__center__right__col__star__top__item-bottom"
                          ]
                        }
                      />
                    </div>
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__star__btn-bottom"
                        ]
                      }
                    >
                      WRITE REVIEW
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div
              style={{ opacity: "0" }}
              className={styles["dashboard__col__center-bottom"]}
            >
              <Row className={styles["dashboard__col__center__right-bottom"]}>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
                  }
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={4}
                >
                  <img
                    className={
                      styles["dashboard__col__center__right__col__img-bottom"]
                    }
                    src={Account4}
                    alt="Account"
                  />
                </Col>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
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
                        "dashboard__col__center__right__col__center-bottom"
                      ]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__center__title-bottom"
                        ]
                      }
                    >
                      Baellery
                    </div>
                    <div>
                      PU Leather Shoulder Bag Smooth leather, Maroon Color
                    </div>
                    <div>$45.09</div>
                  </div>
                </Col>
                <Col
                  className={
                    styles["dashboard__col__center__right__col-bottom"]
                  }
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={7}
                >
                  <div
                    className={
                      styles["dashboard__col__center__right__col__btn-bottom"]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__btn__add-bottom"
                        ]
                      }
                    >
                      ADD TO BAG
                    </div>
                    <div
                      className={
                        styles[
                          "dashboard__col__center__right__col__btn__remove-bottom"
                        ]
                      }
                    >
                      REMOVE
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className={styles["dashboard__col__center__btn-bottom"]}>
          VIEW ALL
        </div>
      </Col>
      <Col
        className={styles["dashboard__col"]}
        xs={24}
        sm={24}
        md={11}
        lg={10}
        xl={12}
      >
        <Restock orderList={orderList} />
      </Col>
      <Col
        className={styles["dashboard__col"]}
        xs={24}
        sm={24}
        md={11}
        lg={10}
        xl={12}
      >
        <div className={styles["dashboard__col__center"]}>
          <div className={styles["dashboard__col__center__title"]}>
            ACCOUNT DETAILS
          </div>
          <Row className={styles["dashboard__col__center__row"]}>
            <Col
              className={styles["dashboard__col__center__row__col"]}
              xs={7}
              sm={7}
              md={7}
              lg={7}
              xl={7}
            >
              <div className={styles["dashboard__col__center__row__col-left"]}>
                <div>First name</div>
                <div>Last name</div>
                <div>Gender</div>
                <div>Email</div>
                <div>Date of Birth</div>
                <div>Password</div>
              </div>
            </Col>
            <Col
              className={styles["dashboard__col__center__row__col"]}
              xs={7}
              sm={7}
              md={7}
              lg={7}
              xl={7}
            >
              {" "}
              <div className={styles["dashboard__col__center__row__col-right"]}>
                <div>
                  {accountDetail
                    ? accountDetail?.name?.split(" ").slice(-1).join(" ")
                    : ""}
                </div>
                <div>
                  {" "}
                  {accountDetail
                    ? accountDetail?.name?.split(" ").slice(0, 1)
                    : ""}
                </div>
                <div>none</div>
                <div>{accountDetail ? accountDetail.email : ""}</div>
                <div>none</div>
                <div>
                  {accountDetail
                    ? accountDetail.password === true
                      ? "*************"
                      : ""
                    : ""}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles["dashboard__col__center__btn-bottom"]}>
          EDIT ACCOUNT DETAILS
        </div>
      </Col>
      <Col
        className={styles["dashboard__col"]}
        xs={24}
        sm={24}
        md={11}
        lg={10}
        xl={12}
      >
        <div className={styles["dashboard__col__center"]}>
          <div className={styles["dashboard__col__center__title"]}>
            REWARDS ACCUMULATED
          </div>
          <Row className={styles["dashboard__col__center__row"]}>
            <Col
              className={styles["dashboard__col__center__row__col__main-right"]}
              xs={24}
              sm={24}
              md={7}
              lg={7}
              xl={7}
            >
              <div
                className={
                  styles["dashboard__col__center__row__col__membership"]
                }
              >
                <div
                  className={
                    styles["dashboard__col__center__row__col__membership-title"]
                  }
                >
                  Membership:
                </div>
                <div>80091324708043</div>
              </div>
            </Col>
            <Col
              className={styles["dashboard__col__center__row__col"]}
              xs={24}
              sm={24}
              md={14}
              lg={14}
              xl={14}
            >
              <Row
                className={styles["dashboard__col__center__row__col__point"]}
              >
                <Col
                  className={
                    styles["dashboard__col__center__row__col__point__col"]
                  }
                  xs={24}
                  sm={24}
                  md={7}
                  lg={7}
                  xl={7}
                >
                  <div
                    className={
                      styles[
                        "dashboard__col__center__row__col__point__col__left"
                      ]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__row__col__point__col__left__number"
                        ]
                      }
                    >
                      640
                    </div>
                    <div
                      className={
                        styles[
                          "dashboard__col__center__row__col__point__col__left-point"
                        ]
                      }
                    >
                      points
                    </div>
                  </div>
                </Col>
                <Col
                  className={
                    styles["dashboard__col__center__row__col__point__col"]
                  }
                  xs={24}
                  sm={24}
                  md={9}
                  lg={9}
                  xl={9}
                >
                  <div
                    className={
                      styles[
                        "dashboard__col__center__row__col__point__col__left-right"
                      ]
                    }
                  >
                    <div
                      className={
                        styles[
                          "dashboard__col__center__row__col__point__col__left__number"
                        ]
                      }
                    >
                      Points Earned
                    </div>
                    <div
                      className={
                        styles[
                          "dashboard__col__center__row__col__point__col__left-point"
                        ]
                      }
                    >
                      1 points = $1
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className={styles["dashboard__col__center__btn-bottom"]}>
          VIEW ALL
        </div>
      </Col>
    </Row>
  );
};
export default Dashboard;
