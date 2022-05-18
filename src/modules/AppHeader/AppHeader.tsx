import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./AppHeader.module.scss";
import { Row, Col, Dropdown, Popover, Button, Divider } from "antd";
import { BuilderComponent, builder } from '@builder.io/react'
import OnSales2 from "src/assets/images/home-page/OnSales2.png";
import OnSales3 from "src/assets/images/home-page/OnSales3.png";
import user from "src/assets/images/home-page/user.png";
import userLogin from "src/assets/images/home-page/user-login.png";
import heart from "src/assets/images/home-page/heart.png";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks/hooks";
import {
  fetchTopNavigator,
  changeCurrent,
  fetchTopNavigatorNode,
  fetchTopNavigatorLeafItem,
  changeCurrentSubNode,
  changeCurrentNode,
  fetchTopNavigatorNodeItem,
} from "./AppHeaderSlice";
import { createCategoryUrl } from "src/utils/routes";
import {
  getCustomerInfo,
  selectCustomer,
  onLogout,
} from "src/modules/Customer/CustomerSlice";
import {
  clearCustomer,
  getCustomerToken,
} from "src/modules/Customer/customerService";
import LoginModal from "src/components/LoginModal/LoginModal";
import CartPopup from "../Cart/CartPopup/CartPopup";
import { clearCart, deleteAllProductInCart } from "../Cart/CartSlice";
import Logo from "../../assets/images/home-page/Logo.png";
import { safeLsSet } from "src/utils/safeLS";

export const AppHeader: React.FC = () => {
  const [announcement, setAnnouncement] = useState();
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [menuWidth, setMenuWidth] = useState<any>(0);
  const cartModal = useRef<any>(null);

  let history = useHistory();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const cartState = useAppSelector((state) => state.cart);
  const { cartOnlyProduct } = cartState

  const navigator = useAppSelector((state) => state.appHeader);
  const { topNavigator } = navigator;
  const {
    children,
    current,
    currentNode,
    dropdown,
    megaDropdown,
    listLeaf,
  } = topNavigator;


  useEffect(() => {
    async function fetchContent() {
      const itemsSlugs = cartOnlyProduct.map((item) => item.slug)

      const anouncementContent = await builder
        .get('announcement-bar', {
          cacheSeconds: 120,
          userAttributes: {
            cartItems: itemsSlugs.map((item: any) => item),
            product: cartOnlyProduct.length ? cartOnlyProduct[0] : null,
          } as any,
        })
        .toPromise()
      setAnnouncement(anouncementContent)
    }
    fetchContent()
  }, [cartOnlyProduct])

  const onMenuVisibleChange = () => {
    if (menuWidth) {
      return;
    }

    const el = document.getElementById("menu");
    if (el) {
      setMenuWidth(`${el.offsetWidth}px`);
      return;
    }

    setMenuWidth("auto");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const transferToAccountPage = () => {
    history.push("/account");
  };

  useEffect(() => {
    if (cartModal.current && cartModal.current?.state?.popupVisible === true) {
      cartModal.current.onClick();
    }
    window.scrollTo(0, 0);
  }, [location]);

  const customerState = useAppSelector(selectCustomer);
  const { isLogin, customer } = customerState;

  const getCustomer = useCallback(async () => {
    const { customer, token } = getCustomerToken();
    if (!customer) {
      return;
    }
    dispatch(getCustomerInfo({ customer, token }));
  }, [dispatch]);

  useEffect(() => {
    isLogin && getCustomer();
  }, [isLogin, getCustomer]);

  useEffect(() => {
    const init = async () => {
      const result: any = await dispatch(fetchTopNavigator());
      if (
        result &&
        result.payload &&
        result.payload.data &&
        result.payload.data.length > 0
      ) {
        dispatch(changeCurrent(result?.payload?.data[0]?.id));
        for (let i = 0; i < result?.payload?.data.length; i++) {
          const resultNode: any = await dispatch(
            fetchTopNavigatorNode(result?.payload?.data[i]?.id)
          );
          for (let j = 0; j < resultNode?.payload?.value?.data.length; j++) {
            const resultNodeItem: any = await dispatch(
              fetchTopNavigatorNodeItem(resultNode?.payload?.value?.data[j].id)
            );
            for (
              let k = 0;
              k < resultNodeItem?.payload?.value?.data.length;
              k++
            ) {
              await dispatch(
                fetchTopNavigatorLeafItem(
                  resultNodeItem?.payload?.value?.data[k]?.id
                )
              );
            }
          }
        }
      }
    };

    init();
    getCustomer();
  }, [dispatch, getCustomer]);

  const megaItem = megaDropdown.filter((subDropdown: any) => {
    return subDropdown.nodeId === currentNode;
  })[0]?.value.data;

  const handleLogout = () => {
    dispatch(onLogout());
    clearCustomer();
    safeLsSet("mcart", "");
    dispatch(clearCart());
    dispatch(deleteAllProductInCart());
    history.push("/");
    setVisible(false);
  };

  const content =
    customer && customer.email ? (
      <div className={styles.logout}>
        <p className={styles.name}>{customer.name}</p>
        <p className={styles.email}>{customer.email}</p>
        <Divider className={styles.divider}></Divider>
        <Link to="/account">
          <p className={styles.account} onClick={() => setVisible(false)}>
            My account
          </p>
        </Link>
        <Button onClick={handleLogout} className={styles.logout} size="large">
          Logout
        </Button>
      </div>
    ) : (
      <></>
    );

  const menu =
    megaItem && megaItem.length > 0 ? (
      <div>
        <Row className={styles["menu"]} justify="start" gutter={[16, 16]}>
          <div className={styles["menu-right"]}>
            <Row>
              <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                {megaItem.slice(0, 1).map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <div className={styles["menu__parent"]}>
                        <div
                          className={styles["menu__parent__title"]}
                          onMouseOver={() => {
                            dispatch(changeCurrentSubNode(item.id));
                          }}
                        >
                          <Link
                            to={createCategoryUrl(item.id)}
                            onClick={() => {
                              setVisibleMenu(false);
                            }}
                          >
                            {item.attributes.name}
                          </Link>
                        </div>
                        {listLeaf
                          .filter((subListLeaf: any) => {
                            return subListLeaf.nodeId === item.id;
                          })[0]
                          ?.value.data.map((item: any, index: number) => {
                            return (
                              <div
                                className={styles["menu__parent__item"]}
                                key={index}
                              >
                                <Link
                                  to={createCategoryUrl(item.id)}
                                  onClick={() => {
                                    setVisibleMenu(false);
                                  }}
                                >
                                  {item.attributes.name}
                                </Link>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </Col>
              <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                {megaItem.slice(1, 6).map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <div className={styles["menu__parent"]}>
                        <div
                          className={styles["menu__parent__title"]}
                          onMouseOver={() => {
                            dispatch(changeCurrentSubNode(item.id));
                          }}
                        >
                          <Link
                            to={createCategoryUrl(item.id)}
                            onClick={() => {
                              setVisibleMenu(false);
                            }}
                          >
                            {item.attributes.name}
                          </Link>
                        </div>
                        {listLeaf
                          .filter((subListLeaf: any) => {
                            return subListLeaf.nodeId === item.id;
                          })[0]
                          ?.value.data.map((item: any, index: number) => {
                            return (
                              <div
                                className={styles["menu__parent__item"]}
                                key={index}
                              >
                                <Link
                                  to={createCategoryUrl(item.id)}
                                  onClick={() => {
                                    setVisibleMenu(false);
                                  }}
                                >
                                  {item.attributes.name}
                                </Link>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </Col>
              <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                {megaItem.slice(6).map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <div className={styles["menu__parent"]}>
                        <div
                          className={styles["menu__parent__title"]}
                          onMouseOver={() => {
                            dispatch(changeCurrentSubNode(item.id));
                          }}
                        >
                          <Link
                            to={createCategoryUrl(item.id)}
                            onClick={() => {
                              setVisibleMenu(false);
                            }}
                          >
                            {item.attributes.name}
                          </Link>
                        </div>
                        {listLeaf
                          .filter((subListLeaf: any) => {
                            return subListLeaf.nodeId === item.id;
                          })[0]
                          ?.value.data.map((item: any, index: number) => {
                            return (
                              <div
                                className={styles["menu__parent__item"]}
                                key={index}
                              >
                                <Link
                                  to={createCategoryUrl(item.id)}
                                  onClick={() => {
                                    setVisibleMenu(false);
                                  }}
                                >
                                  {item.attributes.name}
                                </Link>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </Col>
            </Row>
          </div>
          <div className={styles["menu-image"]}>
            <div className={styles["menu__img__left"]}>
              <div className={styles["menu__img__left__content"]}>
                <img
                  className={styles["menu__img__left__content__parent"]}
                  src={OnSales3}
                  alt="MENU"
                />
                <div className={styles["menu__img__left__content-top"]}>
                  GET THE SPRING LOOK
                </div>
                <div>
                  <div className={styles["menu__img__left__content-center"]}>
                    15% OFF
                  </div>
                </div>
                <div className={styles["menu__img__left__content-bottom"]}>
                  Selected items
                </div>
              </div>
              <div className={styles["menu__img__left-btn"]}>SHOP NOW</div>
            </div>
          </div>
          <div className={styles["menu-image"]}>
            <div className={styles["menu__img__left"]}>
              <div className={styles["menu__img__left__content"]}>
                <img
                  className={styles["menu__img__left__content__parent"]}
                  src={OnSales2}
                  alt="MENU"
                />
                <div className={styles["menu__img__left__content-top"]}>
                  GET THE SPRING LOOK
                </div>
                <div>
                  <div className={styles["menu__img__left__content-center"]}>
                    15% OFF
                  </div>
                </div>
                <div className={styles["menu__img__left__content-bottom"]}>
                  Selected items
                </div>
              </div>
              <div className={styles["menu__img__left-btn"]}>SHOP NOW</div>
            </div>
          </div>
        </Row>
      </div>
    ) : (
      <></>
    );

  return (
    <>
      <Row className={styles["header"]}>
        <Col
          className={styles["header-center"]}
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
        >
          <div className={styles["header__top"]}>
            <BuilderComponent
              content={announcement}
              model="announcement-bar"
            />
          </div>
        </Col>
        <Col
          className={styles["header__title-center"]}
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
        >
          <Col
            className={styles["header-center"]}
            xs={24}
            sm={24}
            md={18}
            lg={18}
            xl={18}
          >
            <Row className={styles["header__title"]}>
              <Col
                className={styles["header__title__left-width"]}
                xs={24}
                sm={24}
                md={8}
                lg={8}
                xl={8}
              >
                <div className={styles["menu-lv1"]}>
                  {children.map((item, index) => {
                    return (
                      <div
                        onMouseMove={() => {
                          dispatch(changeCurrent(item.data.id));
                          //dispatch(fetchTopNavigatorNode(item.data.id));
                        }}
                        className={
                          styles[
                            `header__title__sex${
                              item.data.id === current ? "__active" : ""
                            }-width`
                          ]
                        }
                        key={index}
                      >
                        <Link to={createCategoryUrl(item.data.id)}>
                          {item.data.attributes.name}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={8}
                lg={8}
                xl={8}
                className={styles["header__title-width"]}
              >
                <div
                  onClick={() => history.push("/")}
                  className={styles["header__title__center-width"]}
                >
                  <img src={Logo} alt="logo" />
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={8}
                lg={8}
                xl={8}
                className={styles["header__title-width"]}
              >
                <div className={styles["header__title__right-width"]}>
                  <div>
                    {customer && customer.email ? (
                      <Popover
                        content={content}
                        placement="bottomRight"
                        trigger="click"
                        visible={visible}
                      >
                        <div
                          onClick={() => {
                            const { customer, token } = getCustomerToken();

                            if (!customer && !token) setShowModal(true);
                            setVisible((visible) => !visible);
                          }}
                        >
                          <img
                            className={styles["user-icon"]}
                            src={userLogin}
                            alt="User"
                          />
                        </div>
                      </Popover>
                    ) : (
                      <img
                        onClick={() => {
                          const { customer, token } = getCustomerToken();

                          if (!customer && !token) setShowModal(true);
                        }}
                        className={styles["user-icon"]}
                        src={user}
                        alt="User"
                      />
                    )}
                  </div>
                  <div>
                    <img
                      className={styles["user-icon"]}
                      src={heart}
                      alt="Heart"
                    />
                  </div>
                  <div>
                    <CartPopup></CartPopup>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Col>
        <Col
          className={styles["header__bottom-center"]}
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
        >
          <Col
            className={styles["header__bottom__col-center"]}
            id="menu"
            xs={24}
            sm={24}
            md={18}
            lg={18}
            xl={18}
          >
            <Row className={styles["header__menu-center"]} justify="center">
              <Dropdown
                overlay={menu}
                trigger={["hover"]}
                visible={visibleMenu}
                onVisibleChange={(flag) => {
                  onMenuVisibleChange();
                  setVisibleMenu(flag);
                }}
                placement="bottomLeft"
                overlayStyle={{
                  width: menuWidth,
                }}
              >
                <div className={styles["header__menu__left-center"]}>
                  {dropdown
                    .filter((subDropdown: any) => {
                      return subDropdown.hierarchyId === current;
                    })[0]
                    ?.value.data.map((item: any, index: number) => {
                      return (
                        <div
                          className={
                            currentNode === item.id
                              ? styles[
                                  "header__menu__left__items__active-center"
                                ]
                              : styles["header__menu__left__items-center"]
                          }
                          onMouseOver={() => {
                            dispatch(changeCurrentNode(item.id));
                          }}
                          key={index}
                        >
                          <Link
                            to={createCategoryUrl(item.id)}
                            onClick={() => {
                              setVisibleMenu(false);
                            }}
                          >
                            {item.attributes.name}
                          </Link>
                        </div>
                      );
                    })}
                </div>
              </Dropdown>
              <Col
                className={styles["header__menu__right-center"]}
                xs={24}
                sm={24}
                md={6}
                lg={6}
                xl={6}
              >
                <input
                  className={styles["header__menu__right__input-center"]}
                />
                <div>
                  <SearchOutlined
                    className={styles["header__menu__right__icon-center"]}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
      <LoginModal
        transfer={transferToAccountPage}
        showModal={showModal}
        closeModal={closeModal}
      />
    </>
  );
};
