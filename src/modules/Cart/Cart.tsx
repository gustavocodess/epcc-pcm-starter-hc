import { Button, Col, Divider, Input, Progress, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { ReactComponent as DeliverIcon } from "src/assets/images/icons/deliver-icon.svg";
import { LoadingIndicator } from "src/components/LoadingIndicator/LoadingIndicator";
import { loadingType } from "src/components/LoadingIndicator/LoadingIndicatorType";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import {
  addPromoCode,
  deleteProductInCart,
  selectCart,
  updateProductToCart,
  removePromotionError,
} from "./CartSlice";
import PaymentMethods from "src/assets/images/Checkout/payment-method.png";

// styles
import styles from "./Cart.module.scss";
import { correctFreeShipping, formatMoney } from "src/utils/helper";

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  let history = useHistory();

  const cartState = useAppSelector(selectCart);
  const {
    cart,
    cartOnlyProduct,
    promotionError,
    cartPriceDisplay,
    loading,
  } = cartState;
  const [cartCurrent, setCartCurrent] = useState(cartOnlyProduct);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    dispatch(removePromotionError());
  }, [dispatch]);

  useEffect(() => {
    cartOnlyProduct && setCartCurrent(cartOnlyProduct);
  }, [cartOnlyProduct]);


  useEffect(() => {
    if (cart) {
      const promoCodeFilter: any = cart.find(
        (item: any) => item.type === "promotion_item"
      );
      if (promoCodeFilter && !promoCode) {
        setPromoCode(promoCodeFilter.sku);
      }
    }
  }, [cart, promoCode]);

  const subTotal = useMemo(() => {
    if (cartOnlyProduct && Array.isArray(cartOnlyProduct)) {
      return cartOnlyProduct.reduce((pre, item) => {
        return pre + item.unit_price.amount * item.quantity;
      }, 0);
    }

    return 0;
  }, [cartOnlyProduct]);

  const shippingFee = useMemo(() => {
    if (cart && Array.isArray(cart)) {
      return cart
        .filter((item: any) => item.sku === "shipping-fee")
        .reduce((pre, item) => {
          return pre + item.unit_price.amount * item.quantity;
        }, 0);
    }

    return 0;
  }, [cart]);

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

  const onInputBlur = (id: string) => {
    const index = cart.findIndex((product: any) => product.id === id);

    const quantity =
      index !== -1
        ? cartCurrent[index].quantity <= 0
          ? cart[index].quantity
          : cartCurrent[index].quantity
        : 1;

    setCartCurrent((pre: any) => {
      const newCart = JSON.parse(JSON.stringify(pre));

      if (index !== -1) {
        newCart[index].quantity = quantity;
      }

      return newCart;
    });

    dispatch(updateProductToCart({ id, quantity }));
  };

  const onRemoveProduct = (id: string) => {
    dispatch(deleteProductInCart(id));
  };

  const onAddPromoCode = () => {
    if (promoCode === "") {
      return;
    }

    dispatch(addPromoCode(promoCode));
  };

  return (
    <>
      {loading ? (
        <LoadingIndicator type={loadingType.FULLPAGE}></LoadingIndicator>
      ) : (
        <Row className={styles["cart"]}>
          <Col xl={24} className={styles["cart-container"]}>
            <Col
              xs={24}
              sm={24}
              md={18}
              lg={18}
              xl={18}
              className={styles["cart-col__center"]}
            >
              {Array.isArray(cart) && cart.length === 0 ? (
                <div className={styles["cart-empty"]}>
                  Your shopping bag is empty
                </div>
              ) : (
                <Row>
                  <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                    {shippingFee ? (
                      <>
                        <div className={styles["cart-freeshipping"]}>
                          Spend{" "}
                          <span
                            className={styles["cart-freeshipping__hightlight"]}
                          >
                            {subTotal < correctFreeShipping()
                              ? formatMoney(correctFreeShipping() - subTotal)
                              : 0}
                          </span>{" "}
                          more for free shipping
                        </div>
                        <div className={styles["cart-freeshipping__progress"]}>
                          <Progress
                            percent={
                              subTotal < correctFreeShipping()
                                ? (subTotal / correctFreeShipping()) * 100
                                : 100
                            }
                            strokeColor="#ff246a"
                            showInfo={false}
                            size="small"
                          />
                          {subTotal < correctFreeShipping() && (
                            <DeliverIcon
                              className={styles["cart-freeshipping__icon"]}
                              style={{
                                left: `${
                                  (subTotal / correctFreeShipping()) * 100 - 1.5
                                }%`,
                              }}
                            ></DeliverIcon>
                          )}
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    <div className={styles["cart-left__title"]}>
                      Shopping Bag
                    </div>

                    <div className={styles["cart-table"]}>
                      <Row className={styles["cart-table__header"]}>
                        <Col xs={5} className={styles["cart-col_first"]}>
                          Products
                        </Col>
                        <Col xs={10} className={styles["cart-col"]}>
                          Description
                        </Col>
                        <Col xs={3} className={styles["cart-col"]}>
                          Price
                        </Col>
                        <Col xs={3} className={styles["cart-col"]}>
                          Quantity
                        </Col>
                        <Col xs={3} className={styles["cart-col"]}>
                          Total
                        </Col>
                      </Row>
                      {Array.isArray(cartCurrent) &&
                        cartCurrent.map((item, index) => {
                          return (
                            <Row
                              className={styles["cart-table__item"]}
                              key={index}
                            >
                              <Col xs={5} className={styles["cart-col_first"]}>
                                <img
                                  src={item?.image?.href}
                                  className={styles["cart__product__col__img"]}
                                  alt="Cart"
                                />
                              </Col>
                              <Col xs={10} className={styles["cart-col"]}>
                                <p
                                  className={styles["product-name"]}
                                  onClick={() =>
                                    history.push(`/product/${item.product_id}`)
                                  }
                                >
                                  {item.name}
                                </p>
                                <p className={styles["cart-desc"]}>
                                  {item.description}
                                </p>
                              </Col>
                              <Col xs={3} className={styles["cart-col"]}>
                                <p>{formatMoney(item.unit_price.amount)}</p>
                              </Col>
                              <Col xs={3} className={styles["cart-col"]}>
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
                              </Col>
                              <Col xs={3} className={styles["cart-col"]}>
                                <div className={styles["cart-col__action"]}>
                                  <p>
                                    {formatMoney(
                                      item?.unit_price?.amount *
                                        (cartOnlyProduct?.[index]
                                          ? cartOnlyProduct?.[index]?.quantity
                                          : item.quantity)
                                    )}
                                  </p>
                                  <p
                                    className={styles["remove-button"]}
                                    onClick={() => onRemoveProduct(item.id)}
                                  >
                                    Remove
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          );
                        })}
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Row>
                      <Col xs={24}>
                        <div className={styles["cart-summary"]}>
                          <div className={styles["one-line"]}>
                            <p>SUBTOTAL</p>
                            <p> {formatMoney(subTotal)}</p>
                          </div>
                          <div className={styles["one-line"]}>
                            <p>Shipping</p>
                            <p>
                              {shippingFee
                                ? `${formatMoney(shippingFee)}`
                                : "Free"}
                            </p>
                          </div>

                          <div className={styles["one-line"]}>
                            <p>Discount</p>
                            <p>
                              {cartPriceDisplay?.discount
                                ? cartPriceDisplay?.discount?.formatted
                                : "$0"}
                            </p>
                          </div>

                          <div className={styles["total"]}>
                            <p>ORDER TOTAL</p>
                            <p>
                              {" "}
                              {cartPriceDisplay?.without_tax
                                ? cartPriceDisplay?.without_tax?.formatted
                                : "$0"}
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24}>
                        <div className={styles["cart-checkout"]}>
                          <div className={styles["cart-promo"]}>
                            <Input
                              className={styles["promo-input"]}
                              placeholder="ENTER PROMO CODE"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              onFocus={() => {
                                dispatch(removePromotionError());
                              }}
                            ></Input>
                            <Button
                              className={styles["cart-promo__button"]}
                              onClick={onAddPromoCode}
                            >
                              Apply
                            </Button>
                          </div>
                          {promotionError && (
                            <div className="error-message">
                              Invalid promotion code
                            </div>
                          )}

                          <Divider></Divider>

                          <Button
                            className={`${styles["--button"]} ${styles["--checkout"]}`}
                            onClick={() => history.push("/checkout")}
                          >
                            SECURE CHECKOUT
                          </Button>
                          <Button
                            className={`${styles["--button"]}`}
                            onClick={() => history.push("/")}
                          >
                            CONTINUE SHOPPING
                          </Button>

                          <div className={`${styles["payment-methods__text"]}`}>
                            PAYMENT METHODS
                          </div>
                          <img src={PaymentMethods} alt="payment-methods"></img>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Col>
          </Col>
        </Row>
      )}
    </>
  );
};
