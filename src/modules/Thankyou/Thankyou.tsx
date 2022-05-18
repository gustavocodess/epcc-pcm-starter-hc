import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Row, Skeleton } from "antd";
import styles from "./Thankyou.module.scss";
import Telephone from "src/assets/images/icons/telephone.png";
import { useHistory, useParams } from "react-router";
import { getOrderSummary } from "src/modules/Order/orderService";
import { LoadingIndicator } from "src/components/LoadingIndicator/LoadingIndicator";
import { loadingType } from "src/components/LoadingIndicator/LoadingIndicatorType";
import { getProductDetail } from "src/modules/Product/productService";
import { getCustomerToken } from "../Customer/customerService";
import { formatMoney } from "src/utils/helper";

const Thankyou = () => {
  const [orderSummary, setOrderSummary] = useState<any>({});
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [images, setImages] = useState<any>([]);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { orderId } = useParams<any>();

  const fetchData = useCallback(async () => {
    try {
      const { token } = getCustomerToken();
      if (!token) {
        history.push("/");
      }
      setLoading(true);
      const { data, included }: any = await getOrderSummary(orderId);
      setOrderSummary(data || {});
      setOrderDetail(included);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [orderId, history]);

  const fetchProductImage = useCallback(async () => {
    try {
      setImageLoading(true);
      const images = [];
      for (let index = 0; index < orderDetail.length; index++) {
        const element = orderDetail[index];

        const { included } = await getProductDetail(element.product_id);

        images.push({
          product_id: element.product_id,
          href: included?.main_images?.[0]?.link?.href,
        });
      }

      setImages(images);
    } catch (err) {
      console.log(err);
    } finally {
      setImageLoading(false);
    }
  }, [orderDetail]);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    fetchData();
  }, [orderId, fetchData]);

  useEffect(() => {
    if (orderDetail && Array.isArray(orderDetail) && orderDetail.length > 0) {
      fetchProductImage();
    }
  }, [orderDetail, fetchProductImage]);

  const orderItems = useMemo(() => {
    if (orderDetail && Array.isArray(orderDetail)) {
      return orderDetail.filter(
        (x: any) => x.type === "order_item" && x.sku !== "shipping-fee"
      );
    }

    return [];
  }, [orderDetail]);

  const subTotal = useMemo(() => {
    return orderItems.reduce((pre: any, item: any) => {
      return pre + item.unit_price.amount * item.quantity;
    }, 0);
  }, [orderItems]);

  const shippingFee = useMemo(() => {
    if (orderDetail && Array.isArray(orderDetail)) {
      const shippingFee = orderDetail.find(
        (x: any) => x.sku === "shipping-fee"
      );

      if (shippingFee && shippingFee.value) {
        return shippingFee.value.amount;
      }

      return 0;
    }

    return 0;
  }, [orderDetail]);

  const discount = useMemo(() => {
    if (orderDetail && Array.isArray(orderDetail)) {
      return (
        orderDetail
          .filter((item: any) => item.type === "promotion_item")
          .reduce((pre, item) => {
            return pre + item.unit_price.amount * item.quantity;
          }, 0) +
        orderDetail
          .filter((item: any) => item.type !== "promotion_item")
          .reduce((pre, item) => {
            if (!item.discounts || !Array.isArray(item.discounts)) {
              return pre;
            }

            return (
              pre +
              item.discounts.reduce((prev: any, discount: any) => {
                console.log(discount);

                return prev + Math.abs(discount?.amount?.amount);
              }, 0)
            );
          }, 0)
      );
    }

    return 0;
  }, [orderDetail]);

  return (
    <Row className={styles["thankyou"]}>
      {loading ? (
        <LoadingIndicator type={loadingType.FULLPAGE}></LoadingIndicator>
      ) : (
        <Col
          xs={24}
          sm={24}
          md={18}
          lg={18}
          xl={18}
          className={styles["thankyou"]}
        >
          {!orderSummary ||
          Object.keys(orderSummary).length === 0 ||
          orderId === "undefined" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
              }}
            >
              No data
            </div>
          ) : (
            <div>
              <Row className={styles["thankyou__parent"]}>
                <Col
                  xs={24}
                  sm={24}
                  md={14}
                  lg={14}
                  xl={14}
                  className={styles["thankyou__parent__col"]}
                >
                  <h1>Your Order Was Placed Successfully</h1>
                  <p>
                    Order Number: <u>{orderSummary?.id}</u>
                  </p>
                  <p>
                    Hi{" "}
                    {orderSummary?.customer ? orderSummary.customer.name : ""},
                    thanks for shopping with NewChic! A confirmation email will
                    be sent shortly to{" "}
                    <b>
                      {orderSummary?.customer
                        ? orderSummary.customer.email
                        : ""}{" "}
                    </b>
                    Please check your email for the confirmation receipts.
                  </p>

                  <div className={styles["thankyou__parent__col_child"]}>
                    {orderSummary.billing_address && (
                      <div>
                        <h1>BILLING ADDRESS</h1>
                        <p>
                          {orderSummary.billing_address.first_name +
                            " " +
                            orderSummary.billing_address.last_name}
                        </p>
                        <p>
                          {orderSummary.billing_address.company_name +
                            " " +
                            orderSummary.billing_address.line_1 +
                            " " +
                            orderSummary.billing_address.line_2}
                        </p>
                        <p>
                          {orderSummary.billing_address.country +
                            " " +
                            orderSummary.billing_address.postcode}
                        </p>
                        <p>{orderSummary.billing_address.phone_number}</p>
                      </div>
                    )}
                    {orderSummary.shipping_address && (
                      <div>
                        <h1>SHIPPING ADDRESS</h1>
                        <p>
                          {orderSummary.shipping_address.first_name +
                            " " +
                            orderSummary.shipping_address.last_name}
                        </p>
                        <p>
                          {orderSummary.shipping_address.company_name +
                            " " +
                            orderSummary.shipping_address.line_1 +
                            " " +
                            orderSummary.shipping_address.line_2}
                        </p>
                        <p>
                          {orderSummary.shipping_address.country +
                            " " +
                            orderSummary.shipping_address.postcode}
                        </p>
                        <p>{orderSummary.shipping_address.phone_number}</p>
                      </div>
                    )}
                    <div>
                      <h1>ESTIMATED ARRIVAL</h1>
                      <p>12-16 October</p>
                      <p>Standard Delivery</p>
                      <p>9am - 12pm</p>
                    </div>
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  lg={8}
                  xl={8}
                  className={styles["thankyou__parent__col"]}
                >
                  <div className={styles["thankyou__parent__col__right"]}>
                    <div>
                      <p>?</p>
                    </div>
                    <div>
                      <h1>Have some question?</h1>
                      <h1>Read our FAQ</h1>
                      <ul>
                        <li>
                          <a href="/#">How can I check my order details?</a>
                        </li>
                        <li>
                          <a href="/#">
                            I've ordered incorrectyly! Can I change my order?
                          </a>
                        </li>
                        <li>
                          <a href="/#">
                            How can I change the address to my order?
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={styles["thankyou__parent__col__right"]}>
                    <div
                      className={styles["thankyou__parent__col__phone__icon"]}
                    >
                      <img src={Telephone} alt="Phone" />
                    </div>
                    <div>
                      <h1>Want to talk to us instead?</h1>
                      <p>
                        Got more unanswered questions? Our support team can help
                        you +65 67980903
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <h1>ORDER SUMMARY</h1>
              <table className={styles["thankyou__parent__table"]}>
                <thead>
                  <tr>
                    <td>Items</td>
                    <td>Quantity</td>
                    <td>Total Price</td>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item: any, index: any) => (
                    <tr key={index}>
                      <td>
                        <div
                          className={styles["thankyou__parent__table__content"]}
                        >
                          <div
                            className={styles["thankyou__parent__table__image"]}
                          >
                            {imageLoading ? (
                              <Skeleton.Image></Skeleton.Image>
                            ) : (
                              <img
                                src={
                                  images.find(
                                    (x: any) => x.product_id === item.product_id
                                  )?.href
                                }
                                alt="item"
                              />
                            )}
                          </div>
                          <div
                            className={styles["thankyou__parent__table__info"]}
                          >
                            <p>{item.name}</p>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p>{item.quantity}</p>
                      </td>
                      <td>
                        <p>{formatMoney(item.value?.amount)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td>
                      <p>SUBTOTAL</p>
                      <p>Shipping</p>
                      <p>Discount</p>
                      <p>ORDER TOTAL</p>
                    </td>
                    <td>
                      <p>{formatMoney(subTotal)}</p>
                      <p>
                        {shippingFee ? `${formatMoney(shippingFee)}` : "Free"}
                      </p>
                      <p>{formatMoney(discount)}</p>
                      <p>{formatMoney(subTotal + shippingFee - discount)}</p>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Col>
      )}
    </Row>
  );
};
export default Thankyou;
