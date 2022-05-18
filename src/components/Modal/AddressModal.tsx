import { Col, Input, Row, Button } from "antd";
import Form, { useForm } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import React, { useCallback, useState } from "react";
import {
  changeStep,
  CheckoutStep,
  selectCheckout,
  setPaymentMethod,
  setCardPayment,
  setPaymentToken,
  changeMaxStep,
  setShippingAddress,
  setBillingAddress,
} from "src/modules/Checkout/CheckoutSlice";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import styles from "./AddressModal.module.scss";
import { Select } from "antd";
import { COUNTRIES_LIST, USA_STATE_LIST } from "src/config";

const { Option } = Select;

interface NewAddressModalProps {
  handleClose: () => void;
  handleAddAddress: () => void;
  isEdit: boolean;
  setEdit: any;
  type?: "billing" | "shipping";
  address: any;
}

export const AddressModal: React.FC<NewAddressModalProps> = ({
  handleClose,
  isEdit,
  setEdit,
  type,
  address,
}) => {
  const [form] = useForm();
  const [isShowState, setShowState] = useState<boolean>(false);

  const sortedCountries = COUNTRIES_LIST.sort((a, b) => {
    if (a["value"] > b["value"]) {
      return 1;
    }
    return -1;
  });

  const sortedStates = USA_STATE_LIST.sort((a, b) => {
    if (a["name"] > b["name"]) {
      return 1;
    }
    return -1;
  });

  const dispatch = useAppDispatch();
  const checkoutState = useAppSelector(selectCheckout);

  const onGeneratePaymentToken = useCallback(
    async (formValues: any) => {
      try {
        const {
          firstName,
          lastName,
          streetAddress,
          extendedAddress,
          city,
          state,
          country,
          postalCode,
          phoneNumber,
          instruction,
        } = formValues;
        const address = {
          firstName,
          lastName,
          streetAddress,
          extendedAddress,
          city,
          ...(country === "US" && { state }),
          postalCode,
          country,
          phoneNumber,
          instruction,
        };

        if (type === "billing") {
          await dispatch(setBillingAddress(address));
          if (checkoutState.maxStep < CheckoutStep.OPTIONS)
            dispatch(changeStep(CheckoutStep.OPTIONS));
        } else {
          await dispatch(setShippingAddress(address));
        }
        if (handleClose) {
          handleClose();
        }
        if (setEdit) {
          setEdit(false);
        }
        if (isEdit) {
          dispatch(setPaymentMethod(null));
          dispatch(setPaymentToken(""));
          dispatch(setCardPayment(false));
          dispatch(changeStep(CheckoutStep.ADDRESS));
          dispatch(changeMaxStep(CheckoutStep.ADDRESS));
        }
      } catch (error) {}
      console.log(formValues);
    },
    [dispatch, handleClose, setEdit, checkoutState.maxStep, isEdit, type]
  );

  React.useEffect(() => {
    if (address?.state) setShowState(true);
    else setShowState(false);
  }, [address]);

  return (
    <Form
      form={form}
      onFinish={onGeneratePaymentToken}
      className={styles.root}
      initialValues={{
        firstName: isEdit && address ? address.firstName : "",
        lastName: isEdit && address ? address.lastName : "",
        streetAddress: isEdit && address ? address.streetAddress : "",
        extendedAddress: isEdit && address ? address.extendedAddress : "",
        city: isEdit && address ? address.city : "",
        postalCode: isEdit && address ? address.postalCode : "",
        phoneNumber: isEdit && address ? address.phoneNumber : "",
        instruction: isEdit && address ? address.instruction : "",
        ...(isEdit && address && { country: address.country }),
        ...(isEdit && address && { state: address.state }),
      }}
    >
      <Row gutter={20}>
        <Col xs={24} md={12}>
          <FormItem
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
              },
            ]}
            className={styles["form-email"]}
          >
            <Input placeholder="First Name" className={styles["form-input"]} />
          </FormItem>
        </Col>
        <Col xs={24} md={12}>
          <FormItem
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please input your last name!",
              },
            ]}
            className={styles["form-email"]}
          >
            <Input placeholder="Last Name" className={styles["form-input"]} />
          </FormItem>
        </Col>
        <Col xs={24} md={24}>
          <FormItem
            label="Street address"
            name="streetAddress"
            rules={[
              {
                required: true,
                message: "Please input your street address",
              },
            ]}
            className={styles["form-email"]}
          >
            <Input
              placeholder="Street address"
              className={styles["form-input"]}
            />
          </FormItem>
        </Col>
        <Col xs={24} md={24}>
          <FormItem
            label="Extended address"
            name="extendedAddress"
            rules={[
              {
                required: false,
              },
            ]}
            className={styles["form-email"]}
          >
            <Input
              placeholder="Extended address"
              className={styles["form-input"]}
            />
          </FormItem>
        </Col>
        <Col xs={24} md={12}>
          <FormItem
            label="City"
            name="city"
            rules={[
              {
                required: true,
                message: "Please input your city",
              },
            ]}
            className={styles["form-email"]}
          >
            <Input placeholder="City" className={styles["form-input"]} />
          </FormItem>
        </Col>
        <Col xs={24} md={12}>
          <FormItem
            label="State"
            name="state"
            className={styles["form-email"]}
            rules={[
              {
                required: isShowState ? true : false,
                message: "Please input your state",
              },
            ]}
            style={{
              display: isShowState ? "block" : "none",
            }}
          >
            <Select placeholder="State" className={styles["form-input"]}>
              {sortedStates.map((country) => (
                <Option key={country.code} value={country.code}>
                  {country["name"]}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xs={24} md={12}>
          <FormItem
            label="Postal code"
            name="postalCode"
            rules={[
              {
                required: true,
                message: "Please input your postal code",
              },
            ]}
            className={styles["form-email"]}
          >
            <Input placeholder="Postal code" className={styles["form-input"]} />
          </FormItem>
        </Col>
        <Col xs={24} md={12}>
          <FormItem
            label="Country"
            name="country"
            rules={[
              {
                required: true,
                message: "Please input your country",
              },
            ]}
            className={styles["form-country"]}
          >
            <Select
              placeholder="Country"
              className={styles["form-input"]}
              onChange={(e) => {
                setShowState(e === "US");
              }}
            >
              {sortedCountries.map((country) => (
                <Option key={country.key} value={country.key}>
                  {country["value"]}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xs={24} md={24}>
          <FormItem
            label="Phone number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your phone number",
              },
            ]}
            className={styles["form-email"]}
          >
            <Input
              placeholder="Phone number"
              className={styles["form-input"]}
            />
          </FormItem>
        </Col>
        <Col xs={24} md={24}>
          <FormItem
            label="Instruction"
            name="instruction"
            rules={[
              {
                required: false,
              },
            ]}
            className={styles["form-email"]}
          >
            <Input placeholder="Instruction" className={styles["form-input"]} />
          </FormItem>
        </Col>
        <Col xs={24} offset={0}>
          <Button htmlType="submit" style={{ width: "100%" }}>
            {isEdit
              ? "UPDATE"
              : type === "billing"
              ? "SAVE AND CONTINUE"
              : "CONTINUE TO BILLING INFORMATION"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
