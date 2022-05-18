import { Col, Divider, Input, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import FormItem from "antd/lib/form/FormItem";
import Form, { useForm } from "antd/lib/form/Form";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import {
  onLogin,
  onRegisterCustomer,
  selectCustomer,
  onSetGuest,
} from "src/modules/Customer/CustomerSlice";

import GG from "src/assets/images/Checkout/GG.png";
import Checkout3 from "src/assets/images/Checkout/Checkout3.png";
import styles from "./SignInAndRegister.module.scss";
import Loading from "src/components/Loading/Loading";
import { changeStep, CheckoutStep, changeMaxStep } from "../CheckoutSlice";

export const SignInAndRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoginState, setIsLoginState] = useState(true);
  const [form] = useForm();
  const [guestForm] = useForm();
  const { getFieldValue } = form;
  const [isOpenGuestForm, setOpenGuestForm] = useState<boolean>(false);

  const cartState = useAppSelector(selectCustomer);
  const { customer, error, loading, guest } = cartState;

  const onLoginClick = async () => {
    try {
      await form.validateFields();
    } catch (err) {
      return;
    }

    const email = form.getFieldValue("email");
    const password = form.getFieldValue("password");

    dispatch(
      onLogin({
        email,
        password,
      })
    );
  };

  const onRegister = async () => {
    if (isLoginState === false) {
      try {
        await form.validateFields();
      } catch (err) {
        return;
      }

      const firstName = getFieldValue("firstName");
      const lastName = getFieldValue("lastName");
      const email = form.getFieldValue("email");
      const password = form.getFieldValue("password");

      dispatch(
        onRegisterCustomer({
          name: `${firstName} ${lastName}`,
          email,
          password,
        })
      );
      return;
    }

    setIsLoginState(false);
  };

  const onCheckoutAsGuest = async (formValues: any) => {
    dispatch(onSetGuest(formValues.email));
    return;
  };

  useEffect(() => {
    if (customer.email || guest.email) {
      dispatch(changeStep(CheckoutStep.ADDRESS));
      dispatch(changeMaxStep(CheckoutStep.ADDRESS));
    }
  }, [customer, dispatch, guest]);

  return (
    <>
      {customer.email ? (
        <div className={styles["customer-email"]}>
          <span style={{ fontWeight: "bold" }}>Customer:</span> {customer.email}
        </div>
      ) : guest.email ? (
        <div className={styles["customer-email"]}>
          <span style={{ fontWeight: "bold" }}>Guest:</span> {guest.email}
        </div>
      ) : (
        <Row className={styles["signin-container"]}>
          <Col
            className={styles["signin-container__col"]}
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
          >
            <div className={styles["signin-title"]}>Welcome to NewChic</div>
            <div className={styles["signin-subtitle"]}>
              Enter your email address to sign in or register
            </div>
            <>
              <div className="error-message">{error}</div>
              <Form form={form} autoComplete="off">
                {!isLoginState && (
                  <>
                    <FormItem
                      label=""
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your first name!",
                        },
                      ]}
                      className={styles["form-email"]}
                    >
                      <Input
                        placeholder="First Name"
                        className={styles["form-input"]}
                      />
                    </FormItem>
                    <FormItem
                      label=""
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your last name!",
                        },
                      ]}
                      className={styles["form-email"]}
                    >
                      <Input
                        placeholder="Last Name"
                        className={styles["form-input"]}
                      />
                    </FormItem>
                  </>
                )}
                <FormItem
                  label=""
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email address!",
                    },
                    { type: "email", message: "Email address incorrect!" },
                  ]}
                  className={styles["form-email"]}
                >
                  <Input
                    placeholder="sample@newchic.com"
                    className={styles["form-input"]}
                  />
                </FormItem>
                <FormItem
                  label=""
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                  className={styles["form-email"]}
                >
                  <Input
                    placeholder="password"
                    className={styles["form-input"]}
                    type="password"
                  />
                </FormItem>
                {!isLoginState && (
                  <FormItem
                    label=""
                    name="passwordConfirmation"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Confirm password do not match!")
                          );
                        },
                      }),
                    ]}
                    className={styles["form-email"]}
                  >
                    <Input
                      placeholder="Password Confirmation"
                      className={styles["form-input"]}
                      type="password"
                    />
                  </FormItem>
                )}
              </Form>
              {isLoginState ? (
                <Row gutter={10} className={styles["form-button-group"]}>
                  <Col xs={24} md={12}>
                    <div
                      className={styles["form-button"]}
                      onClick={onLoginClick}
                    >
                      LOGIN
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className={styles["form-button"]} onClick={onRegister}>
                      REGISTER
                    </div>
                  </Col>
                </Row>
              ) : (
                <Row gutter={10} className={styles["form-button-group"]}>
                  <Col xs={24}>
                    <div className={styles["form-button"]} onClick={onRegister}>
                      REGISTER
                    </div>
                  </Col>
                </Row>
              )}
            </>

            <Divider>OR</Divider>
            <div className={styles["another-login__button"]}>
              <div>
                <img className={styles["img"]} src={Checkout3} alt="Facebook" />
              </div>
              <div>CONTINUE WITH FACEBOOK</div>
            </div>

            <div className={styles["another-login__button"]}>
              <div>
                <img className={styles["img"]} src={GG} alt="Google" />
              </div>
              <div>CONTINUE WITH GOOGLE</div>
            </div>
            <Divider>OR</Divider>
            <div
              className={styles["another-login__button"]}
              onClick={() =>
                setOpenGuestForm((openGuestForm) => !openGuestForm)
              }
            >
              <div>CHECKOUT AS GUEST</div>
            </div>
            <div
              style={{
                display: isOpenGuestForm ? "block" : "none",
              }}
            >
              <Form form={guestForm} onFinish={onCheckoutAsGuest}>
                <FormItem
                  label=""
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email address!",
                    },
                    { type: "email", message: "Email address incorrect!" },
                  ]}
                  className={styles["form-email"]}
                >
                  <Input
                    placeholder="sample@newchic.com"
                    className={styles["form-input"]}
                  />
                </FormItem>
                <FormItem>
                  <Button
                    htmlType="submit"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    Continue
                  </Button>
                </FormItem>
              </Form>
            </div>
          </Col>
        </Row>
      )}
      <Loading loading={loading}></Loading>
    </>
  );
};
