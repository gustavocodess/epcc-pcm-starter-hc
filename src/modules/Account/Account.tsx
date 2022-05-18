import { Col, Row } from "antd";
import React from "react";
import { Switch, Route, useRouteMatch, NavLink } from "react-router-dom";
import styles from "./Account.module.scss";
import Dashboard from "./Dashboard/Dashboard";
import Orders from "./Orders/Orders";
import OrderDetail from "./OrderDetail/OrderDetail";

const Account = () => {
  let { path, url } = useRouteMatch();

  return (
    <Row className={styles["account__parent"]}>
      <Col
        className={styles["account__parent"]}
        xs={24}
        sm={24}
        md={18}
        lg={18}
        xl={18}
      >
        <Row className={styles["account"]}>
          <Col
            className={styles["account__col"]}
            xs={24}
            sm={24}
            md={11}
            lg={3}
            xl={3}
          >
            <div className={styles["account__col-left"]}>
              <div className={styles["account__col__title-left"]}>
                MY ACCOUNT
              </div>
              <div className={styles["account__col__parent-left"]}>
                <NavLink
                  to={`${url}`}
                  exact
                  className={(isActive) =>
                    isActive
                      ? styles["account__col__normal__active-left"]
                      : styles["account__col__normal-left"]
                  }
                >
                  DASHBOARD
                </NavLink>
              </div>
              <div className={styles["account__col__parent-left"]}>
                <NavLink
                  to={`${url}/orders`}
                  className={(isActive) =>
                    isActive
                      ? styles["account__col__normal__active-left"]
                      : styles["account__col__normal-left"]
                  }
                >
                  ORDERS
                </NavLink>
              </div>
              <div className={styles["account__col__parent-left"]}>
                <div className={styles["account__col__normal-left"]}>
                  WISHLIST
                </div>
              </div>
              <div className={styles["account__col__parent-left"]}>
                <div className={styles["account__col__normal-left"]}>
                  PURCHASED ITEMS
                </div>
              </div>

              <div className={styles["account__col__parent-left"]}>
                <div className={styles["account__col__normal-left"]}>
                  POINTS HISTORY
                </div>
              </div>
              <div className={styles["account__col__parent-left"]}>
                <div className={styles["account__col__normal-left"]}>
                  ACCOUNT DETAILS
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={18} lg={21} xl={21}>
            <Switch>
              <Route exact path={path} component={Dashboard}></Route>
              <Route exact path={`${path}/orders`} component={Orders}></Route>
              <Route
                exact
                path={`${path}/orders/:orderId`}
                component={OrderDetail}
              ></Route>
            </Switch>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default Account;
