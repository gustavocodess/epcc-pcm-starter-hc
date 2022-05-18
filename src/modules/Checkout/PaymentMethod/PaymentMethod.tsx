import React, { FC, useEffect, useState } from "react";
import styles from "./PaymentMethod.module.scss";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Form, Button } from "antd";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import {
  changeStep,
  CheckoutStep,
  selectCheckout,
  setCardPayment,
  setPaymentMethod,
  setPaymentToken,
} from "../CheckoutSlice";
import { ErrorMessage } from "./ErrorMessage/ErrorMessage";
import VisaIcon from "../../../assets/images/Checkout/visa.png";
import MasterIcon from "../../../assets/images/Checkout/mastercard.png";
import AmexIcon from "../../../assets/images/Checkout/american-express.png";

export const PaymentMethod: FC<any> = ({ isEdit, setIsEdit }) => {
  const [form] = Form.useForm();
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useAppDispatch();
  const checkout = useAppSelector(selectCheckout);
  const { shippingAddress, billingAddress } = checkout;
  const [error, setError] = useState<any>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethodState] = useState<any>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    if (cardComplete) {
      setProcessing(true);
      dispatch(setCardPayment(true));
    }

    const cardElement = elements.getElement(CardElement);
    try {
      if (cardElement) {
        const payload = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });
        dispatch(setPaymentMethod(payload));
        if (shippingAddress) {
          const token = await stripe.createToken(cardElement, {
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            address_line1: shippingAddress.streetAddress,
            address_line2: shippingAddress.extendedAddress,
            address_city: shippingAddress.city,
            address_country: shippingAddress.country,
            address_state: shippingAddress.state,
            address_zip: shippingAddress.postalCode,
          });
          dispatch(setPaymentToken(token.token?.id));
          dispatch(changeStep(CheckoutStep.PLACE_ORDER));
        }
        setProcessing(false);

        if (payload.error) {
          setError(payload.error);
        } else {
          setPaymentMethodState(payload.paymentMethod);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isEdit) {
      setCardComplete(false);
      setError(false);
      setPaymentMethodState(null);
      dispatch(changeStep(CheckoutStep.PAYMENT));
      dispatch(setCardPayment(false));
      setIsEdit(false);
    }
  }, [isEdit, dispatch, setIsEdit]);

  useEffect(() => {
    setPaymentMethodState(null);
  }, [shippingAddress, billingAddress]);

  if (paymentMethod) {
    let paymentLogo = "";

    const paymentBrand = paymentMethod?.card?.brand;

    if (paymentBrand === "mastercard") {
      paymentLogo = MasterIcon;
    }

    if (paymentBrand === "visa") {
      paymentLogo = VisaIcon;
    }

    if (paymentBrand === "amex") {
      paymentLogo = AmexIcon;
    }

    return (
      <div className={styles.root__success}>
        <div className={styles.root__content}>
          {paymentLogo ? (
            <img src={paymentLogo} alt="payment-brand" width={40}></img>
          ) : (
            "Stripe card"
          )}
          : {`**** **** **** ${paymentMethod.card?.last4} `}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Form form={form} onFinish={handleSubmit}>
        <CardElement
          className={styles.root__form}
          onChange={async (e) => {
            setError(e.error);
            setCardComplete(e.complete);
          }}
          options={{
            hidePostalCode: true,
          }}
        />
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        <Button
          htmlType="submit"
          className={styles.root__submit}
          loading={processing}
          disabled={!cardComplete}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};
