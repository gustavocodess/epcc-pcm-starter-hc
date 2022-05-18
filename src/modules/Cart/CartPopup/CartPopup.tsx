import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import styles from "./CartPopup.module.scss";
import { Row, Col, Popover, Input } from "antd";
import cart_main from "src/assets/images/home-page/cart-main.png";
import { getCartId } from "src/modules/Cart/cartService";

import { CheckOutlined, DropboxOutlined } from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks/hooks";
import {
  fetchCart,
  selectCart,
  updateProductToCart,
  removeCartError,
  deleteProductInCart,
  fetchMultiCart,
} from "../CartSlice";
import { selectCustomer } from "src/modules/Customer/CustomerSlice";
import { getCustomerToken } from "src/modules/Customer/customerService";
import { config } from "src/config";
import { LoadingIndicator } from "src/components/LoadingIndicator/LoadingIndicator";
import { loadingType } from "src/components/LoadingIndicator/LoadingIndicatorType";
import { formatMoney } from "src/utils/helper";

const CartPopup: React.FC = () => {
  let history = useHistory();
  const dispatch = useAppDispatch();
  const cartModal = useRef<any>(null);
  const location = useLocation();

  useEffect(() => {
    if (cartModal.current && cartModal.current?.state?.popupVisible === true) {
      cartModal.current.onClick();
    }
  }, [location]);

  const cartState = useAppSelector(selectCart);
  const {
    cart,
    cartError,
    cartOnlyProduct,
    cartPriceDisplay,
    loading,
  } = cartState;
  const [cartCurrent, setCartCurrent] = useState(cartOnlyProduct);

  const customerState = useAppSelector(selectCustomer);
  const { isLogin } = customerState;

  const getCart = useCallback(async () => {
    const cartId = getCartId();
    if (cartId) {
      await dispatch(fetchCart(cartId));
    }
  }, [dispatch]);

  const getCustomer = useCallback(async () => {
    const { customer, token } = getCustomerToken();
    if (!customer) {
      getCart();
      return;
    }

    if (token) {
      dispatch(fetchMultiCart(token));
    } else {
      getCart();
    }
  }, [dispatch, getCart]);

  useEffect(() => {
    getCustomer();
  }, [dispatch, getCustomer]);

  useEffect(() => {
    cartOnlyProduct && setCartCurrent(cartOnlyProduct);
  }, [cartOnlyProduct]);

  useEffect(() => {
    isLogin && getCustomer();
  }, [isLogin, getCustomer]);

  const totalPriceNoShippingFee = useMemo(() => {
    if (cartOnlyProduct) {
      return cartOnlyProduct.reduce((pre: any, current: any) => {
        return pre + current.value.amount;
      }, 0);
    }

    return 0;
  }, [cartOnlyProduct]);

  const updateProductQuantity = async (productId: string, quantity: number) => {
    setCartCurrent((pre: any) => {
      const newCart = JSON.parse(JSON.stringify(pre));

      const index = newCart.findIndex(
        (product: any) => product.product_id === productId
      );

      if (index !== -1) {
        newCart[index].quantity = quantity;
      }

      return newCart;
    });
  };

  const onInputBlur = useCallback(
    (id: string) => {
      const indexInCart = cart.findIndex((product: any) => product.id === id);
      const indexInCurrent = cartCurrent.findIndex(
        (product: any) => product.id === id
      );

      const quantity =
        indexInCart !== -1
          ? cartCurrent[indexInCurrent].quantity <= 0
            ? cart[indexInCart].quantity
            : cartCurrent[indexInCurrent].quantity
          : 1;

      setCartCurrent((pre: any) => {
        const newCart = JSON.parse(JSON.stringify(pre));

        if (indexInCurrent !== -1) {
          newCart[indexInCurrent].quantity = quantity;
        }

        return newCart;
      });

      dispatch(updateProductToCart({ id, quantity }));
    },
    [cart, cartCurrent, dispatch]
  );

  const onCartPopupVisibleChange = () => {
    dispatch(removeCartError());
  };

  const onRemoveProduct = useCallback(
    (id: string) => {
      dispatch(deleteProductInCart(id));
    },
    [dispatch]
  );

  const content = useMemo(() => {
    return (
      <div className={styles["cart"]}>
        {loading ? (
          <div>
            <LoadingIndicator
              type={loadingType.COMPONENT}
              size={{ width: "100%", height: "300px" }}
            ></LoadingIndicator>
          </div>
        ) : Array.isArray(cart) && cart.length === 0 ? (
          <div className={styles["cart-empty"]}>Your shopping bag is empty</div>
        ) : (
          <>
            <div className={styles["cart-confirm"]}>
              <CheckOutlined className={styles["cart-confirm__icon"]} />
              <div className={styles["cart-confirm__main"]}>Added to Bag</div>
            </div>
            <div className={styles["cart__quantity"]}>
              {Array.isArray(cart)
                ? cart
                    .filter((x) => x.sku !== "shipping-fee")
                    .reduce((pre, current) => {
                      return pre + current.quantity;
                    }, 0)
                : 0}{" "}
              items
            </div>
            <div className={styles["cart-wrapper"]}>
              {Array.isArray(cartCurrent) &&
                cartCurrent.map((item, index) => {
                  return (
                    <div key={index} className={styles["cart-product__wrap"]}>
                      <Row className={styles["cart__product"]}>
                        <Col
                          className={styles["cart__product__col"]}
                          xs={24}
                          sm={24}
                          md={8}
                          lg={8}
                          xl={8}
                        >
                          <img
                            src={item?.image?.href}
                            className={styles["cart__product__col__img"]}
                            alt="Cart"
                          />
                        </Col>
                        <Col
                          className={styles["cart__product__col"]}
                          xs={24}
                          sm={24}
                          md={15}
                          lg={15}
                          xl={15}
                        >
                          <div className={styles["cart__product__col__right"]}>
                            <div
                              className={
                                styles["cart__product__col__right__name"]
                              }
                            >
                              <div
                                className={
                                  styles[
                                    "cart__product__col__right__name__title"
                                  ]
                                }
                                onClick={() =>
                                  history.push(`/product/${item.product_id}`)
                                }
                              >
                                {item.name}
                              </div>
                              <div
                                className={
                                  styles["cart__product__col__right__name__des"]
                                }
                              >
                                {item.description}
                              </div>
                            </div>
                            <div
                              className={
                                styles["cart__product__col__right__money"]
                              }
                            >
                              {formatMoney(item.unit_price.amount)}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className={styles["cart-remove"]}>
                        <Col
                          className={styles["cart-remove__left"]}
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                        >
                          <div className={styles["cart-remove__left__main"]}>
                            <div>Qty:</div>
                            <Input
                              className={styles["quantity-input"]}
                              value={Number(item.quantity).toString()}
                              onChange={(e) =>
                                updateProductQuantity(
                                  item.product_id,
                                  Number(e.target.value)
                                )
                              }
                              onBlur={() => onInputBlur(item.id)}
                              type="number"
                              min="1"
                            ></Input>
                          </div>
                        </Col>
                        <Col
                          className={styles["cart-remove__left"]}
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                        >
                          <div
                            className={styles["cart-remove__left__text"]}
                            onClick={() => onRemoveProduct(item.id)}
                          >
                            Remove
                          </div>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
            </div>
            <div className={styles["cart-error"]}>{cartError}</div>
            {totalPriceNoShippingFee < config.freeShipping && (
              <div className={styles["cart-discount"]}>
                <div>
                  <DropboxOutlined className={styles["cart-discount__icon"]} />
                </div>
                <div className={styles["cart-discount__text"]}>
                  You're only ${config.freeShipping - totalPriceNoShippingFee}{" "}
                  away from free shipping!
                </div>
              </div>
            )}
            {cartPriceDisplay?.discount?.amount !== 0 ? (
              <div className={styles["cart__discount"]}>
                <div>Discount</div>
                <div>{cartPriceDisplay.discount.formatted}</div>
              </div>
            ) : (
              ""
            )}

            <div className={styles["cart__total"]}>
              <div>Total</div>
              <div>
                {cartPriceDisplay?.without_tax
                  ? cartPriceDisplay?.without_tax?.formatted
                  : "$0"}
              </div>
            </div>
            <Row className={styles["cart__btn"]}>
              <Col
                className={styles["cart__btn__col"]}
                xs={24}
                sm={24}
                md={11}
                lg={11}
                xl={11}
              >
                <div
                  className={styles["cart__btn__col__left"]}
                  onClick={() => history.push("/cart")}
                >
                  VIEW BAG
                </div>
              </Col>
              <Col
                className={styles["cart__btn__col"]}
                xs={24}
                sm={24}
                md={11}
                lg={11}
                xl={11}
              >
                {" "}
                <div
                  onClick={() => history.push("/checkout")}
                  className={styles["cart__btn__col__right"]}
                >
                  CHECKOUT
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }, [
    cart,
    cartError,
    cartCurrent,
    cartPriceDisplay,
    history,
    loading,
    onInputBlur,
    onRemoveProduct,
    totalPriceNoShippingFee,
  ]);

  return (
    <div className={styles["cart-popup__wrapper"]}>
      <Popover
        trigger={["click"]}
        placement="bottomRight"
        title={content}
        overlayClassName="cart-popover"
        onVisibleChange={onCartPopupVisibleChange}
        ref={cartModal}
      >
        <img className={styles.image} src={cart_main} alt="Cart" />
        {Array.isArray(cartOnlyProduct) && cartOnlyProduct.length > 0 ? (
          <div className={styles["cart_quantity"]}>
            {cartOnlyProduct.reduce((pre, current) => {
              return pre + current.quantity;
            }, 0)}
          </div>
        ) : (
          ""
        )}
      </Popover>
    </div>
  );
};

export default CartPopup;
