import { Col, Row, Collapse, Button, Modal, Input, notification } from "antd";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Checkout5 from "../../assets/images/Checkout/Checkout5.png";
import Checkout6 from "../../assets/images/Checkout/Checkout6.png";
import Checkout7 from "../../assets/images/Checkout/Checkout7.png";
import Checkout8 from "../../assets/images/Checkout/Checkout8.png";
import styles from "./Checkout.module.scss";
import { ShippingAddress } from "./ShippingAddress/ShippingAddress";
import { BillingAddress } from "./ShippingAddress/BillingAddress";
import { SignInAndRegister } from "./SignInAndRegister/SignInAndRegister";
import { getCartId } from "src/modules/Cart/cartService";
import { PaymentMethod } from "./PaymentMethod/PaymentMethod";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  createOrder,
  selectCheckout,
  createPayment,
  CheckoutStep,
  changeStep,
  setShippingAddress,
  setPaymentMethod,
  setPaymentToken,
  changeMaxStep,
  setCardPayment,
  setBillingAddress,
  setSameAddress,
} from "./CheckoutSlice";
import { useHistory } from "react-router-dom";
import {
  addPromoCode,
  clearCart,
  fetchCart,
  fetchMultiCart,
  selectCart,
  updateProductToCart,
  removePromotionError,
  deleteAllProductInCart,
} from "src/modules/Cart/CartSlice";
import { selectCustomer } from "src/modules/Customer/CustomerSlice";
import { Options } from "./Options/Options";
import { LoadingIndicator } from "../../components/LoadingIndicator/LoadingIndicator";
import { loadingType } from "../../components/LoadingIndicator/LoadingIndicatorType";
import { getCustomerToken } from "../Customer/customerService";
import PlaceOrderModal from "./PlaceOrderModal/PlaceOrderModal";
import { STRIPE_ID } from "src/config";
import { formatMoney } from "src/utils/helper";

const stripePromise = loadStripe(STRIPE_ID);

const availablePaymentMethod = ["visa"];

const Checkout = () => {
  const { Panel } = Collapse;
  const [panel, setPanel] = useState(false);
  const [paymentMethodType, setPaymentMethodType] = useState<string>("");
  const history = useHistory();
  const [isEditShippingAddress, setIsEditShippingAddress] = useState<boolean>(
    false
  );
  const [isEditBillingAddress, setIsEditBillingAddress] = useState<boolean>(
    false
  );
  const [isEditCard, setIsEditCard] = useState<boolean>(false);
  const [isOpenPlaceOrderModal, setOpenPlaceOrderModal] = useState<boolean>(
    false
  );
  const [createAt, setCreateAt] = useState<string>();
  const [orderId, setOrderId] = useState<string>();
  const checkoutState: any = useAppSelector(selectCheckout);
  const dispatch = useAppDispatch();

  const handleOpenPaymentMethod = useCallback(
    (paymentType: string) => {
      if (
        availablePaymentMethod.findIndex((item) => item === paymentType) === -1
      ) {
        notification.error({
          message: "Error when select payment method",
          description: "This payment method is not yet support",
        });
      }
      if (paymentMethodType === paymentType) setPaymentMethodType("");
      else setPaymentMethodType(paymentType);
    },
    [paymentMethodType]
  );

  const callback = useCallback(
    (key: string | string[]): void => {
      if (!Array.isArray(key) && (key as any) <= checkoutState.maxStep)
        dispatch(changeStep(key as any));

      if (!Array.isArray(key) && (key as any) > checkoutState.maxStep) {
        Modal.error({
          title: "Error when change step",
          content: "Please complete current step before swicth to next step",
        });
      }
      //style for active tag
      const itemActiveHeader: any = document.querySelector(
        ".ant-collapse .ant-collapse-item-active .ant-collapse-header"
      );

      if (itemActiveHeader) {
        itemActiveHeader.style.backgroundColor = "black";
        itemActiveHeader.style.color = "white";
      }
      setTimeout(() => {
        const itemInactiveHeaderList: Element[] = [];
        //find parent tag
        const collpaseElement: any = document.querySelector(".ant-collapse");

        //retrieve all children of collpaseElement which have no className = "ant-collapse-item-active"
        if (collpaseElement) {
          const collapseItem: Element[] = collpaseElement.children;

          if (collapseItem) {
            for (let i = 0; i <= collapseItem.length - 1; i++) {
              if (
                collapseItem[i].classList.contains(
                  "ant-collapse-item-active"
                ) === false
              ) {
                itemInactiveHeaderList.push(collapseItem[i]);
              }
            }
          }
          itemInactiveHeaderList.forEach((item: any) => {
            item.firstChild.style.backgroundColor = "white";
            item.firstChild.style.color = "black";
          });
        }
      });

      setPanel(!panel);
    },
    [checkoutState.maxStep, dispatch, panel]
  );

  const [promotionErrorState, setPromotionError] = useState<string>();

  const customerState = useAppSelector(selectCustomer);
  const cartState = useAppSelector(selectCart);

  const {
    cart,
    cartOnlyProduct,
    promotionError,
    cartPriceDisplay,
    loading,
  } = cartState;
  const [cartCurrent, setCartCurrent] = useState(cartOnlyProduct);
  const [promoCodeInput, setPromoCodeInput] = useState<string | undefined>("");

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
    const promotionCode = cart.find((item) => {
      return item.type === "promotion_item";
    });
    setPromoCodeInput(promotionCode?.sku);
  }, [cart]);

  useEffect(() => {
    setPromotionError(promotionError);
    setTimeout(() => {
      setPromotionError("");
    }, 6000);
  }, [promotionError]);

  const customer: any = customerState.customer;
  const customerId: string = customer.id;
  const guest: any = customerState.guest;

  const cartId: string = getCartId();

  const handlePlaceOrder = useCallback(async () => {
    const {
      shippingAddress,
      billingAddress,
      isSameAddress,
    } = checkoutState as any;
    try {
      const sAddress = {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        line_1: shippingAddress.streetAddress,
        line_2: shippingAddress.extendedAddress,
        city: shippingAddress.city,
        county: shippingAddress.state || "",
        country: shippingAddress.country,
        postcode: shippingAddress.postalCode,
        phone_number: shippingAddress.phoneNumber,
        instruction: shippingAddress.instruction,
      };

      const bAddress =
        !isSameAddress && billingAddress
          ? {
              first_name: billingAddress.firstName,
              last_name: billingAddress.lastName,
              line_1: billingAddress.streetAddress,
              line_2: billingAddress.extendedAddress,
              city: billingAddress.city,
              county: billingAddress.state || "",
              country: billingAddress.country,
              postcode: billingAddress.postalCode,
              phone_number: billingAddress.phoneNumber,
              instruction: billingAddress.instruction,
            }
          : { ...sAddress };
      const customer = customerId
        ? { id: customerId }
        : {
            email: guest.email,
            name: `${bAddress.first_name} ${bAddress.last_name}`,
          };
      const createOrderData = {
        customer,
        shipping_address: { ...sAddress },
        billing_address: { ...bAddress },
      };
      const order = await dispatch(
        createOrder({ cartId, data: createOrderData })
      );

      const orderPayload: any = order.payload;

      const orderId = orderPayload.data.id;
      const createdAt = orderPayload.data.meta.timestamps.created_at;
      setCreateAt(createdAt);
      setOrderId(orderId);
      if (orderId && checkoutState.paymentToken) {
        const createPaymentData = {
          gateway: "stripe",
          method: "purchase",
          payment: checkoutState.paymentToken,
        };
        const payment = await dispatch(
          createPayment({ orderId, data: createPaymentData })
        );
        if (guest.email) {
          if (order && payment) setOpenPlaceOrderModal(true);
          return;
        } else {
          if (order && payment) {
            dispatch(setShippingAddress(null));
            dispatch(setPaymentMethod(null));
            dispatch(setSameAddress(true));
            dispatch(setBillingAddress(null));
            dispatch(setPaymentToken(""));
            dispatch(changeStep(CheckoutStep.SIGNIN_AND_REGISTER));
            dispatch(changeMaxStep(CheckoutStep.SIGNIN_AND_REGISTER));
            dispatch(setCardPayment(false));
            dispatch(clearCart());
            dispatch(deleteAllProductInCart());
            history.push(`/thankyou/${orderId}`);
          }
        }
      }
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "error occur when place order" + error,
      });
    }
    //eslint-disable-next-line
  }, [
    customerId,
    cartId,
    checkoutState.paymentToken,
    checkoutState.shippingAddress,
  ]);

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
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subTotal = useMemo(() => {
    if (cartOnlyProduct && Array.isArray(cartOnlyProduct)) {
      return cartOnlyProduct.reduce((pre, item) => {
        return pre + item.unit_price.amount * item.quantity;
      }, 0);
    }

    return 0;
  }, [cartOnlyProduct]);

  const onAddPromoCode = () => {
    if (promoCodeInput === "" || promoCodeInput === undefined) {
      return;
    }

    dispatch(addPromoCode(promoCodeInput));
  };

  const collapse = useMemo(() => {
    const listActive: Array<any> = Object.keys(CheckoutStep)
      .map((key: any) => CheckoutStep[key])
      .filter((value) => value <= checkoutState.checkoutStep);

    return (
      <Collapse
        // accordion
        className={styles["checkout__parent__col__left__expand__child"]}
        //defaultActiveKey={[checkoutState.checkoutStep]}
        activeKey={listActive}
        onChange={callback}
      >
        <Panel
          className={styles["checkout__parent__col__left__expand__child__item"]}
          showArrow={false}
          header={
            <div
              className={styles["root__header-step"]}
              style={{
                color:
                  checkoutState.checkoutStep ===
                  CheckoutStep.SIGNIN_AND_REGISTER
                    ? "white"
                    : "black",
                background:
                  checkoutState.checkoutStep ===
                  CheckoutStep.SIGNIN_AND_REGISTER
                    ? "black"
                    : "#f1f1f1",
              }}
            >
              <p className={styles["root__header-title"]}>
                1. {guest.email ? "GUEST" : "SIGN IN / REGISTER"}
              </p>
            </div>
          }
          key={CheckoutStep.SIGNIN_AND_REGISTER}
        >
          <SignInAndRegister></SignInAndRegister>
        </Panel>
        <Panel
          className={styles["checkout__parent__col__left__expand__child__item"]}
          showArrow={false}
          header={
            <div
              className={styles["root__header-step"]}
              style={{
                color:
                  checkoutState.checkoutStep === CheckoutStep.ADDRESS
                    ? "white"
                    : "black",
                background:
                  checkoutState.checkoutStep === CheckoutStep.ADDRESS
                    ? "black"
                    : "#f1f1f1",
              }}
            >
              <p className={styles["root__header-title"]}>
                2. SHIPPING ADDRESS & METHOD
              </p>
              {checkoutState.checkoutStep > CheckoutStep.ADDRESS &&
                !checkoutState.billingAddress && (
                  <p
                    className={styles["root__header-edit"]}
                    onClick={() => {
                      setIsEditShippingAddress(true);
                      // dispatch(setPaymentMethod(null));
                      // dispatch(setPaymentToken(""));
                      // dispatch(setCardPayment(false));
                      // dispatch(changeStep(CheckoutStep.ADDRESS));
                      // dispatch(changeMaxStep(CheckoutStep.ADDRESS));
                    }}
                  >
                    Edit
                  </p>
                )}
            </div>
          }
          key={CheckoutStep.ADDRESS}
        >
          {
            <>
              <ShippingAddress
                isEdit={isEditShippingAddress}
                setIsEdit={setIsEditShippingAddress}
                type="shipping"
              ></ShippingAddress>
              {checkoutState.shippingAddress && (
                <BillingAddress
                  isEdit={isEditBillingAddress}
                  setIsEdit={setIsEditBillingAddress}
                  type="billing"
                ></BillingAddress>
              )}
            </>
          }
        </Panel>
        <Panel
          className={styles["checkout__parent__col__left__expand__child__item"]}
          showArrow={false}
          header={
            <div
              className={styles["root__header-step"]}
              style={{
                color:
                  checkoutState.checkoutStep === CheckoutStep.OPTIONS
                    ? "white"
                    : "black",
                background:
                  checkoutState.checkoutStep === CheckoutStep.OPTIONS
                    ? "black"
                    : "#f1f1f1",
              }}
            >
              <p className={styles["root__header-title"]}>
                3. DELIVERY & GIFT OPTIONS
              </p>
              {checkoutState.checkoutStep > CheckoutStep.OPTIONS && (
                <p className={styles["root__header-edit"]}>Edit</p>
              )}
            </div>
          }
          key={CheckoutStep.OPTIONS}
        >
          <Options />
        </Panel>
        <Panel
          className={styles["checkout__parent__col__left__expand__child__item"]}
          showArrow={false}
          header={
            <div
              className={styles["root__header-step"]}
              style={{
                color:
                  checkoutState.checkoutStep === CheckoutStep.PAYMENT
                    ? "white"
                    : "black",
                background:
                  checkoutState.checkoutStep === CheckoutStep.PAYMENT
                    ? "black"
                    : "#f1f1f1",
              }}
            >
              <p className={styles["root__header-title"]}>4. PAYMENT METHODS</p>
              {checkoutState.checkoutStep > CheckoutStep.PAYMENT && (
                <p
                  className={styles["root__header-edit"]}
                  onClick={() => setIsEditCard(true)}
                >
                  Edit
                </p>
              )}
            </div>
          }
          key={CheckoutStep.PAYMENT}
        >
          <div className={styles["payment"]}>
            <div className={styles["payment__title"]}>
              Select your payment:{" "}
            </div>
            <div className={styles["payment__bottom__parent"]}>
              <div className={styles["payment__bottom"]}>
                <div
                  className={styles["payment__bottom__item"]}
                  onClick={() => handleOpenPaymentMethod("afterPay")}
                  style={{
                    border:
                      paymentMethodType === "afterPay" ? "3px solid black" : "",
                  }}
                >
                  <div>
                    <img
                      className={styles["payment__bottom__item__img"]}
                      src={Checkout5}
                      alt="Pay"
                    />
                  </div>
                  <div>0% interest, 3 payments</div>
                </div>
                <div
                  className={styles["payment__bottom__item"]}
                  onClick={() => handleOpenPaymentMethod("visa")}
                  style={{
                    border:
                      paymentMethodType === "visa" ? "3px solid black" : "",
                  }}
                >
                  <div>
                    <img
                      className={styles["payment__bottom__item__img-visa"]}
                      src={Checkout6}
                      alt="Visa"
                    />
                  </div>
                  <div>Credit/Debit Card</div>
                </div>
                <div
                  className={styles["payment__bottom__item"]}
                  onClick={() => handleOpenPaymentMethod("paypal")}
                  style={{
                    border:
                      paymentMethodType === "paypal" ? "3px solid black" : "",
                  }}
                >
                  <div>
                    <img
                      className={styles["payment__bottom__item__img-paypal"]}
                      src={Checkout7}
                      alt="Paypal"
                    />
                  </div>
                  <div>Paypal</div>
                </div>
                <div
                  className={styles["payment__bottom__item-finish"]}
                  onClick={() => handleOpenPaymentMethod("gift")}
                  style={{
                    border:
                      paymentMethodType === "gift" ? "3px solid black" : "",
                  }}
                >
                  <div>
                    <img
                      className={styles["payment__bottom__item__img-gift"]}
                      src={Checkout8}
                      alt="Gift"
                    />
                  </div>
                  <div>Gift Card</div>
                </div>
              </div>
            </div>
            {paymentMethodType === "visa" && (
              <Elements stripe={stripePromise}>
                <PaymentMethod isEdit={isEditCard} setIsEdit={setIsEditCard} />
              </Elements>
            )}
          </div>
        </Panel>
      </Collapse>
    );
  }, [
    checkoutState.checkoutStep,
    callback,
    Panel,
    handleOpenPaymentMethod,
    isEditShippingAddress,
    isEditBillingAddress,
    isEditCard,
    paymentMethodType,
    checkoutState.shippingAddress,
    checkoutState.billingAddress,
    guest.email,
    //dispatch,
  ]);

  if (loading)
    return <LoadingIndicator type={loadingType.FULLPAGE}></LoadingIndicator>;

  if (Array.isArray(cart) && cart.length === 0) {
    return (
      <Row className={`${styles["checkout"]} ${styles.root}`}>
        <Col
          className={styles["checkout"]}
          xs={24}
          sm={24}
          md={18}
          lg={18}
          xl={18}
        >
          <div className={styles["cart-empty"]}>Your shopping bag is empty</div>
        </Col>
      </Row>
    );
  }

  return (
    <Row className={`${styles["checkout"]} ${styles.root}`}>
      <PlaceOrderModal
        createAt={createAt}
        orderId={orderId}
        isOpenPlaceOrderModal={isOpenPlaceOrderModal}
        onCancel={() => setOpenPlaceOrderModal(false)}
      />

      <Col
        className={styles["checkout"]}
        xs={24}
        sm={24}
        md={18}
        lg={18}
        xl={18}
      >
        <div className={styles["checkout__parent__col__left_title"]}>
          Secure Checkout
        </div>
        <Row className={styles["checkout__parent"]}>
          <Col
            className={styles["checkout__parent__col"]}
            xs={24}
            sm={24}
            md={14}
            lg={14}
            xl={14}
          >
            <div className={styles["checkout__parent__col__left"]}>
              <div className={styles["checkout__parent__col__left__expand"]}>
                {collapse}
              </div>
            </div>
          </Col>
          <Col
            className={styles["checkout__parent__col"]}
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
          >
            <div className={styles["checkout__parent__col__right"]}>
              <div className={styles["checkout__parent__col__right__item"]}>
                <div>SUBTOTAL</div>
                <div>{formatMoney(subTotal)}</div>
              </div>
              <div className={styles["checkout__parent__col__right__item"]}>
                <div>Shipping</div>
                <div>
                  {Array.isArray(cart) &&
                    formatMoney(
                      cart
                        .filter((x: any) => x.sku === "shipping-fee")
                        .reduce((pre, current) => {
                          return pre + current.value.amount;
                        }, 0)
                    )}
                </div>
              </div>

              {cartPriceDisplay?.discount && (
                <div className={styles["checkout__parent__col__right__item"]}>
                  <div>Discount</div>
                  <div>{cartPriceDisplay?.discount?.formatted}</div>
                </div>
              )}

              <div className={styles["checkout__parent__col__right-total"]}>
                <div>ORDER TOTAL</div>
                <div>
                  {cartPriceDisplay?.without_tax
                    ? cartPriceDisplay?.without_tax?.formatted
                    : "$0"}
                </div>
              </div>

              <div className={styles["cart-checkout"]}>
                <div className={styles["cart-promo"]}>
                  <Input
                    placeholder="ENTER PROMO CODE"
                    style={{ lineHeight: "32px" }}
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
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
                {promotionErrorState && (
                  <div className="error-message">Invalid promotion code</div>
                )}
              </div>
              <div
                style={{ width: "100%", marginTop: "0.5rem", height: "50px" }}
              >
                <Button
                  disabled={
                    checkoutState.checkoutStep < CheckoutStep.PLACE_ORDER
                  }
                  onClick={handlePlaceOrder}
                  className={styles["root__place-order-button"]}
                >
                  PLACE ORDER
                </Button>
              </div>
              <div className={styles["checkout__parent__col__right__bottom"]}>
                <div
                  className={
                    styles["checkout__parent__col__right__bottom-title"]
                  }
                >
                  Items in the Order (
                  {Array.isArray(cart)
                    ? cart
                        .filter((x) => x.sku !== "shipping-fee")
                        .reduce((pre, current) => {
                          return pre + current.quantity;
                        }, 0)
                    : 0}
                  )
                </div>
                {cartCurrent.map((item, index) => {
                  return (
                    <div
                      className={
                        styles["checkout__parent__col__right__bottom__product"]
                      }
                      key={index}
                    >
                      <div>
                        <img
                          src={item?.image?.href}
                          className={
                            styles[
                              "checkout__parent__col__right__bottom__product-img"
                            ]
                          }
                          alt="Checkout"
                        />
                      </div>
                      <div
                        className={
                          styles[
                            "checkout__parent__col__right__bottom__product-right"
                          ]
                        }
                      >
                        <div
                          className={
                            styles[
                              "checkout__parent__col__right__bottom__product__parent-right"
                            ]
                          }
                        >
                          <div
                            className={
                              styles[
                                "checkout__parent__col__right__bottom__product__title-right"
                              ]
                            }
                          >
                            {item.name}
                          </div>
                          <div
                            className={
                              styles[
                                "checkout__parent__col__right__bottom__product__des-right"
                              ]
                            }
                          >
                            {item.description}
                          </div>
                        </div>
                        <div
                          className={
                            styles[
                              "checkout__parent__col__right__bottom__product__select-right"
                            ]
                          }
                        >
                          <div
                            className={
                              styles[
                                "checkout__parent__col__right__bottom__product__select__child__main-right"
                              ]
                            }
                          >
                            <Input
                              value={Number(item.quantity).toString()}
                              className="ant-dropdown-link"
                              disabled
                              onChange={(e) =>
                                updateProductQuantity(
                                  item.product_id,
                                  Number(e.target.value)
                                )
                              }
                              onBlur={() => onInputBlur(item.id)}
                              style={{ width: "65px" }}
                              type="number"
                              min="1"
                            ></Input>
                          </div>
                          <div
                            className={
                              styles[
                                "checkout__parent__col__right__bottom__product__select__price-right"
                              ]
                            }
                          >
                            {formatMoney(item?.unit_price?.amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default Checkout;
