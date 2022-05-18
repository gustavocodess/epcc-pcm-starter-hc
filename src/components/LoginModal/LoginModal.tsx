import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import { Modal, Form, Input, Button } from "antd";
import {
  onLogin,
  selectCustomer,
  clearError,
} from "../../../src/modules/Customer/CustomerSlice";
import { getAccount } from "../../../src/modules/Account/AccountSlice";
import styles from "./LoginModal.module.scss";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { getCustomerToken } from "src/modules/Customer/customerService";
import { getCartId } from "src/modules/Cart/cartService";
import { mergeCartIntoCart } from "src/modules/Cart/CartSlice";
import { fetchListCart } from "src/modules/AppHeader/AppHeaderService";

function LoginModal(props: any) {
  const dispatch = useAppDispatch();
  let { showModal, closeModal } = props;
  const customerState = useAppSelector(selectCustomer);
  const { error } = customerState;

  const [form] = Form.useForm();
  //for modal
  const [isModalVisible, setIsModalVisible] = useState(showModal);
  const [errorState, setErrorState] = useState<string>();

  const handleOk = () => {
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  const mergeCart = React.useCallback(async () => {
    const { token } = getCustomerToken();
    const cartId = getCartId();
    const listCart: any = await fetchListCart(token);
    const prevCartId = listCart?.data?.[1]?.id;
    if (prevCartId === cartId) return;
    await dispatch(mergeCartIntoCart({ cartId, prevCartId }));
  }, [dispatch]);

  const handleLogin = useCallback(
    async (formValues: any) => {
      try {
        const errorOrResult: any = await dispatch(
          onLogin({
            email: formValues.email,
            password: formValues.password,
          })
        );
        await dispatch(
          getAccount({
            email: formValues.email,
            password: formValues.password,
          })
        );

        if (errorOrResult?.error?.message !== "Rejected") {
          form.resetFields();
          closeModal();
          mergeCart();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [form, dispatch, closeModal, mergeCart]
  );

  useEffect(() => {
    setIsModalVisible(showModal);
  }, [showModal]);

  useEffect(() => {
    if (error) {
      setErrorState(error);
      setTimeout(() => {
        setErrorState("");
        dispatch(clearError());
      }, 3000);
    }
  }, [error, dispatch]);

  return (
    <div>
      <Modal
        className={styles["modal_style"]}
        title="Login"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="error-message">{errorState}</div>
        <Form onFinish={handleLogin} form={form}>
          <Form.Item
            name="email"
            label={<p className={styles.label}>Email</p>}
            required
            rules={[
              {
                required: true,
                message: "Please input your email",
              },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input
              placeholder="Email"
              size="large"
              prefix={<MailOutlined />}
              onFocus={() => dispatch(clearError())}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={<p className={styles.label}>Password</p>}
            required
          >
            <Input
              type="password"
              placeholder="Password"
              size="large"
              prefix={<LockOutlined />}
              onFocus={() => dispatch(clearError())}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className={styles["btn_login"]}
              size="large"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default LoginModal;
