import React, { FC, useState } from "react";
import styles from "./PlaceOrderModal.module.scss";
import { Button, Input, Modal } from "antd";
import { useAppSelector, useAppDispatch } from "src/hooks/hooks";
import {
  clearCart,
  selectCart,
  deleteAllProductInCart,
  addProductToCart,
} from "src/modules/Cart/CartSlice";
import {
  selectCheckout,
  setBillingAddress,
  setPaymentToken,
  setSameAddress,
  setShippingAddress,
  setPaymentMethod,
  changeMaxStep,
  changeStep,
  setCardPayment,
  CheckoutStep,
} from "../CheckoutSlice";
import { onSetGuest } from "src/modules/Customer/CustomerSlice";
import { useHistory } from "react-router";
import moment from "moment";
import { formatMoney } from "src/utils/helper";

const PlaceOrderModal: FC<{
  createAt: string | undefined;
  orderId: string | undefined;
  isOpenPlaceOrderModal: boolean | undefined;
  onCancel: () => void;
}> = ({ createAt, orderId, isOpenPlaceOrderModal, onCancel }) => {
  const cartState = useAppSelector(selectCart);
  const { cart, cartOnlyProduct } = cartState;
  const history = useHistory();
  const checkout = useAppSelector(selectCheckout);
  const dispatch = useAppDispatch();
  const [cartCurrent] = useState(cartOnlyProduct);
  const { shippingAddress, billingAddress: bAddress } = checkout;

  const handleContinueShipping = async () => {
    dispatch(setShippingAddress(null));
    dispatch(onSetGuest(""));
    dispatch(setPaymentMethod(null));
    dispatch(setSameAddress(true));
    dispatch(setBillingAddress(null));
    dispatch(setPaymentToken(""));
    dispatch(changeStep(CheckoutStep.SIGNIN_AND_REGISTER));
    dispatch(changeMaxStep(CheckoutStep.SIGNIN_AND_REGISTER));
    dispatch(setCardPayment(false));
    dispatch(clearCart());
    dispatch(deleteAllProductInCart());
    history.push(`/`);
  };

  const handleReorder = async () => {
    await dispatch(setShippingAddress(null));
    await dispatch(onSetGuest(""));
    await dispatch(setPaymentMethod(null));
    await dispatch(setSameAddress(true));
    await dispatch(setBillingAddress(null));
    await dispatch(setPaymentToken(""));
    await dispatch(changeStep(CheckoutStep.SIGNIN_AND_REGISTER));
    await dispatch(changeMaxStep(CheckoutStep.SIGNIN_AND_REGISTER));
    await dispatch(setCardPayment(false));
    await dispatch(clearCart());
    await dispatch(deleteAllProductInCart());
    for (let i = 0; i < cartOnlyProduct.length; i++) {
      await dispatch(
        addProductToCart({
          productId: cartOnlyProduct[i].product_id,
          quantity: cartOnlyProduct[i].quantity,
        })
      );
    }
    history.push("/cart");
  };

  const billingAddress = bAddress || shippingAddress;
  return (
    <Modal
      visible={isOpenPlaceOrderModal}
      onCancel={() => {
        handleContinueShipping();
        onCancel();
      }}
      footer={<></>}
      className={styles.modal}
    >
      <div className={styles.root_modal}>
        <div className={styles.root}>
          <h1 className={styles.root__title}>
            Your Order Was Placed Successfully
          </h1>
          <p>Thank you for your order</p>
          <h1 className={styles.root__sub_title}>Order number: {orderId}</h1>
          <p>Placed at: {moment(createAt).format("DD MMM YYYY")}</p>
          <div className={styles.root__shipping_address}>
            <div className={styles["address"]}>
              {" "}
              <h1 className={styles.root__title}>Shipping Address</h1>
              <div className={styles["address__bottom"]}>
                <div className={styles["address__bottom__title"]}>
                  {`${shippingAddress?.firstName} ${shippingAddress?.lastName}`}
                </div>
                <div>{shippingAddress?.streetAddress}</div>
                {shippingAddress?.extendedAddress && (
                  <div>{shippingAddress?.extendedAddress}</div>
                )}
                <div>{`${shippingAddress?.country} ${shippingAddress?.postalCode}`}</div>
                <div style={{ display: "flex" }}>
                  {shippingAddress?.phoneNumber}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.root__billing_address}>
            <div className={styles["address"]}>
              <h1 className={styles.root__title}>Billing Address</h1>
              <div
                className={styles["address__bottom"]}
                style={{ marginTop: "0px" }}
              >
                <div className={styles["address__bottom__title"]}>
                  {`${billingAddress?.firstName} ${billingAddress?.lastName}`}
                </div>
                <div>{billingAddress?.streetAddress}</div>
                {billingAddress?.extendedAddress && (
                  <div>{billingAddress?.extendedAddress}</div>
                )}
                <div>{`${billingAddress?.country} ${billingAddress?.postalCode}`}</div>
                <div style={{ display: "flex" }}>
                  {billingAddress?.phoneNumber}
                </div>
              </div>
            </div>
          </div>
          <div className={styles["checkout__parent__col__right__bottom"]}>
            <div
              className={styles["checkout__parent__col__right__bottom-title"]}
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
          <Button
            className={styles["root__button_reorder"]}
            size="large"
            onClick={handleReorder}
          >
            RE-ORDER
          </Button>
          <Button
            className={styles["root__button_continue_shopping"]}
            onClick={handleContinueShipping}
            size="large"
          >
            CONTINUE SHOPPING
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PlaceOrderModal;
