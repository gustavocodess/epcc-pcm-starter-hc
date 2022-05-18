import { Form, Checkbox } from "antd";
import React, { useState, useEffect } from "react";
import { AddressModal } from "src/components/Modal/AddressModal";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import styles from "../Checkout.module.scss";
import {
  selectCheckout,
  changeStep,
  CheckoutStep,
  setSameAddress,
  setPaymentMethod,
  setPaymentToken,
  setCardPayment,
} from "../CheckoutSlice";

export const BillingAddress: React.FC<any> = ({ isEdit, setIsEdit, type }) => {
  const [, setAddAddress] = useState<number>(1);
  const [, setShowModal] = useState(false);

  const checkout = useAppSelector(selectCheckout);
  const dispatch = useAppDispatch();
  const { isSameAddress, billingAddress } = checkout;

  useEffect(() => {
    if (
      checkout.shippingAddress &&
      (checkout.billingAddress || checkout.isSameAddress) &&
      checkout.checkoutStep < CheckoutStep.PAYMENT
    ) {
      dispatch(changeStep(CheckoutStep.PAYMENT));
    }
  });

  return (
    <>
      <div style={{ marginLeft: "2rem" }}>
        <div className={styles["address__bottom__title"]}>Billing Address</div>
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
      </div>
      {!isSameAddress &&
        (!billingAddress || isEdit ? (
          <div
            className={
              styles["checkout__parent__col__left__expand__child-step2"]
            }
          >
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
                setEdit={setIsEdit}
                handleClose={() => setShowModal(false)}
                handleAddAddress={() => {
                  setAddAddress(2);
                }}
                type="billing"
                address={billingAddress}
              ></AddressModal>
            </div>
          </div>
        ) : (
          <div className={styles["address"]}>
            <div
              className={styles["address__bottom"]}
              style={{ marginTop: "0px" }}
            >
              <div className={styles["address__bottom__title"]}>
                {`${billingAddress.firstName} ${billingAddress.lastName}`}
              </div>
              <div>{billingAddress.streetAddress}</div>
              {billingAddress.extendedAddress && (
                <div>{billingAddress.extendedAddress}</div>
              )}
              <div>{`${billingAddress.country} ${billingAddress.postalCode}`}</div>
              <div style={{ display: "flex" }}>
                {billingAddress.phoneNumber}{" "}
                <span
                  className={styles["address__change"]}
                  onClick={() => {
                    dispatch(setPaymentMethod(null));
                    dispatch(setPaymentToken(""));
                    dispatch(setCardPayment(false));
                    setIsEdit(true);
                  }}
                >
                  Change
                </span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
