import { Col, Row, Form, Checkbox } from "antd";
import React, { useState, useEffect } from "react";
import { AddressModal } from "src/components/Modal/AddressModal";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import { selectCart } from "src/modules/Cart/CartSlice";
import { formatMoney } from "src/utils/helper";
import styles from "../Checkout.module.scss";
import {
  selectCheckout,
  changeStep,
  CheckoutStep,
  setSameAddress,
} from "../CheckoutSlice";

export const ShippingAddress: React.FC<any> = ({ isEdit, setIsEdit, type }) => {
  const [, setAddAddress] = useState<number>(1);
  const [, setShowModal] = useState(false);
  const [line, setLine] = useState<number>(1);

  const checkout = useAppSelector(selectCheckout);
  const cartState = useAppSelector(selectCart);
  const dispatch = useAppDispatch();
  const { shippingAddress, isSameAddress, billingAddress } = checkout;
  const { cart } = cartState;

  useEffect(() => {
    if (
      checkout.shippingAddress &&
      (checkout.billingAddress || checkout.isSameAddress) &&
      checkout.checkoutStep < CheckoutStep.PAYMENT
    ) {
      dispatch(changeStep(CheckoutStep.PAYMENT));
    }
  });

  const shippingFee = () => {
    return (
      Array.isArray(cart) &&
      cart
        .filter((x: any) => x.sku === "shipping-fee")
        .reduce((pre, current) => {
          return pre + current.value.amount;
        }, 0)
    );
  };

  return (
    <>
      <div style={{ marginLeft: "2rem" }}>
        <div className={styles["address__bottom__title"]}>Shipping Address</div>
        {type === "billing" && (
          <Form style={{ width: "100%" }}>
            <Form.Item name="isSame">
              <Checkbox
                defaultChecked={isSameAddress}
                onChange={(e) => {
                  dispatch(setSameAddress(e.target.checked));
                }}
                value={isSameAddress}
              >
                Same as Shipping Address
              </Checkbox>
            </Form.Item>
          </Form>
        )}
      </div>
      {((!isSameAddress && type === "billing") || type === "shipping") &&
        (!shippingAddress || isEdit ? (
          <div
            className={
              styles["checkout__parent__col__left__expand__child-step2"]
            }
          >
            <Row
              className={
                styles["checkout__parent__col__left__expand__child__row-step2"]
              }
            >
              <Col
                onClick={() => setLine(1)}
                className={
                  styles[
                    "checkout__parent__col__left__expand__child__row__col-step2"
                  ]
                }
                xs={7}
                sm={7}
                md={7}
                lg={7}
                xl={7}
              >
                SHIP TO ADDRESS
              </Col>
              <Col
                onClick={() => setLine(2)}
                className={
                  styles[
                    "checkout__parent__col__left__expand__child__row__col-step2"
                  ]
                }
                xs={15}
                sm={15}
                md={15}
                lg={15}
                xl={15}
              >
                SELF COLLECTION
              </Col>
            </Row>
            <Row
              className={
                styles[
                  "checkout__parent__col__left__expand__child__row__line-step2"
                ]
              }
            >
              <Col
                className={
                  line === 1
                    ? styles[
                        "checkout__parent__col__left__expand__child__row__col__active-step2"
                      ]
                    : styles[
                        "checkout__parent__col__left__expand__child__row__col-step2"
                      ]
                }
                xs={8}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              ></Col>
              <Col
                className={
                  line === 2
                    ? styles[
                        "checkout__parent__col__left__expand__child__row__col__active-step2"
                      ]
                    : styles[
                        "checkout__parent__col__left__expand__child__row__col-step2"
                      ]
                }
                xs={16}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              ></Col>
            </Row>
            <div
              onClick={() => {
                setShowModal(true);
              }}
              className={
                styles[
                  "checkout__parent__col__left__expand__child__add__parent-step2"
                ]
              }
            >
              <AddressModal
                isEdit={isEdit}
                type={"shipping"}
                setEdit={setIsEdit}
                handleClose={() => setShowModal(false)}
                handleAddAddress={() => {
                  setAddAddress(2);
                }}
                address={shippingAddress}
              ></AddressModal>
            </div>
          </div>
        ) : (
          <div className={styles["address"]}>
            <Row className={styles["address__row"]}>
              <Col
                className={styles["address__row__col"]}
                xs={24}
                sm={24}
                md={15}
                lg={15}
                xl={15}
              >
                <div className={styles["address__row__col-left"]}>
                  <div>Standard Shipping</div>
                  <div>6-14 business days</div>
                </div>
              </Col>
              <Col
                className={styles["address__row__col"]}
                xs={24}
                sm={24}
                md={7}
                lg={7}
                xl={7}
              >
                <div className={styles["address__row__col__right"]}>
                  Shipping:{" "}
                  {shippingFee() !== 0
                    ? `${formatMoney(shippingFee() || 0)}`
                    : "Free"}
                </div>
              </Col>
            </Row>

            <div className={styles["address__bottom"]}>
              <div className={styles["address__bottom__title"]}>
                {`${shippingAddress.firstName} ${shippingAddress.lastName}`}
              </div>
              <div>{shippingAddress.streetAddress}</div>
              {shippingAddress.extendedAddress && (
                <div>{shippingAddress.extendedAddress}</div>
              )}
              <div>{`${shippingAddress.country} ${shippingAddress.postalCode}`}</div>
              <div style={{ display: "flex" }}>
                {shippingAddress.phoneNumber}
                {billingAddress && (
                  <span
                    className={styles["address__change"]}
                    onClick={() => {
                      setIsEdit(true);
                    }}
                  >
                    Change
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
