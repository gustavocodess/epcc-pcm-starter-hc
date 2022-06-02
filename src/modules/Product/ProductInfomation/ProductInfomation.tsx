import heart from "src/assets/images/home-page/heart.png";
import React, { FC, useState, useEffect } from "react";
import styles from "./ProductInfomation.module.scss";
import Slider from "react-slick";
import { Row, Col, Rate, Button, Input, Tooltip } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import { useMediaQuery } from "react-responsive";

import { Link, useHistory } from "react-router-dom";
import { ProductInformationProps } from "./ProductInformationType";
import { useAppDispatch, useAppSelector } from "src/hooks/hooks";
import {
  addProductToCart,
  removeCartError,
  selectCart,
} from "src/modules/Cart/CartSlice";
import Coupon from "../ProductDetail/Coupon/Coupon";
import { addPromoItemToCart } from "src/modules/Cart/cartService";
import useMounted from "src/hooks/mounted";
import { formatMoney } from "src/utils/helper";

let sliderRef: any = [];
let sliderRef2: any = [];

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }: any) => (
  <div
    {...props}
    aria-hidden="true"
    aria-disabled={currentSlide === 0 ? true : false}
    type="button"
  >
    <UpOutlined className={styles["root__arrow-icon"]} />
  </div>
);

export const ProductInfomation: FC<ProductInformationProps> = ({
  listImage,
  data,
  type,
  productId,
  productPrice,
  promo,
  variations,
  variationMatrix,
}) => {
  const isMounted = useMounted();
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const [quantitySelected, setQuantitySelected] = useState(1);
  const [selected, setSelected] = useState<any>({});
  const [isChecked, setIsChecked] = useState(false);

  let history = useHistory();
  const dispatch = useAppDispatch();
  const [nav, setNav] = useState<any>(null);
  const [nav2, setNav2] = useState<any>(null);

  const cartState = useAppSelector(selectCart);
  const { cartError } = cartState;

  // check variation
  useEffect(() => {
    if (!productId || isChecked) {
      return;
    }

    if (variations.length > 0) {
      const mapVariation = variationMatrix.find((x: any) =>
        x.includes(productId)
      );

      if (mapVariation && mapVariation.length - 1 === variations.length) {
        const attr: any = {};
        for (let index = 0; index < variations.length; index++) {
          const variation = variations[index];
          for (let j = 0; j < mapVariation.length - 1; j++) {
            const id = mapVariation[j];
            const a = variation.options.find((x: any) => x.id === id);

            if (a) {
              attr[variation.id] = id;
              break;
            }
          }
        }

        setSelected({
          ...selected,
          ...attr,
        });
      } else {
        setSelected({
          ...selected,
          [variations[0].id]: variations[0].options[0].id,
        });
      }
    }

    setIsChecked(true);
  }, [variations, selected, variationMatrix, productId, isChecked]);

  useEffect(() => {
    if (isMounted.current) {
      setNav(sliderRef);
      setNav2(sliderRef2);
      dispatch(removeCartError());
    }
  }, [dispatch, isMounted]);

  const onSelect = (key: string, value: string) => {
    const clone = {
      ...selected,
      [key]: value,
    };

    let select = "";
    if (Object.keys(clone).length === variations.length) {
      const selectValue = [];
      for (let index = 0; index < Object.keys(clone).length; index++) {
        const variationId = Object.keys(clone)[index];
        selectValue.push(clone[variationId]);
      }

      for (let i = 0; i < variationMatrix.length; i++) {
        const element = variationMatrix[i];
        const checked = selectValue.every((x) => element.includes(x));

        if (checked) {
          select = element[element.length - 1];
          break;
        }
      }
    }

    if (select) {
      history.push(`/product/${select}`);
    } else {
      setSelected({
        ...selected,
        [key]: value,
      });
    }
  };

  const settings = {
    infinite: false,
    speed: 500,
    vertical: isDesktopOrLaptop ? true : false,
    slidesToShow: 1,
    slidesToScroll: 1,
    focusOnSelect: true,
    nextArrow: <></>,
    prevArrow: (
      <SlickArrowLeft
        onClick={() => {
          sliderRef.slickPrev();
        }}
      ></SlickArrowLeft>
    ),
    beforeChange: (current: number, next: number) => {
      setSlideIndex(next);
    },
  };

  const settingsMain = {
    infinite: false,
    speed: 500,
    vertical: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    // focusOnSelect: true,
    nextArrow: <></>,
    prevArrow: <></>,
  };

  const handleAddToCart = async () => {
    if (!productId) {
      return;
    }

    await dispatch(
      addProductToCart({
        productId: productId,
        quantity: quantitySelected,
      })
    ).then((res: any) => {
      if (!res.error) {
        applyPromotionCode();
        history.push("/cart");
      }
    });
  };

  const applyPromotionCode = async () => {
    try {
      if (promo["promotion-code"]) {
        await addPromoItemToCart(promo["promotion-code"]);
      }
    } catch (err) {}
  };

  if (!data) {
    return (
      <Row className={styles.root} align="stretch">
      <p className={styles["root__category-name"]}>
        Please select a product.
      </p>
    </Row>
    )
  }

  return (
    <Row className={styles.root} align="stretch">
      <Col xs={24} xl={2}>
        <div className={styles.slider}>
          {isDesktopOrLaptop && slideIndex !== 0 && (
            <div
              className={styles.root__arrow}
              onClick={() => {
                sliderRef.slickPrev();
              }}
            >
              <UpOutlined className={styles["root__arrow-icon"]} />
            </div>
          )}
          <Slider
            asNavFor={nav2}
            className={`${styles["root__slider-mini"]} product-slider`}
            ref={(slider) => (sliderRef = slider)}
            {...settings}
          >
            {listImage.map((image, index) => {
              return (
                <div key={index}>
                  <img src={image.path} alt="" width="100%" />
                </div>
              );
            })}
          </Slider>
          {isDesktopOrLaptop &&
            listImage.length > 2 &&
            slideIndex !== listImage.length - 1 && (
              <div
                className={styles.root__arrow}
                onClick={() => {
                  sliderRef.slickNext();
                }}
              >
                <DownOutlined className={styles["root__arrow-icon"]} />
              </div>
            )}
        </div>
      </Col>
      <Col xs={20} xl={10} className={styles["root__main-image"]}>
        <Slider
          asNavFor={nav}
          ref={(slider) => (sliderRef2 = slider)}
          {...settingsMain}
          swipeToSlide={true}
        >
          {listImage.map((image, index) => {
            return (
              <div key={index}>
                <img
                  src={image.path}
                  alt=""
                  height="100%"
                  className={styles["root__product-image"]}
                />
              </div>
            );
          })}
        </Slider>
        <div>
          <img src={heart} className={styles["heart-icon"]} alt="heart"></img>
        </div>
      </Col>
      <Col xs={24} xl={10} className={styles["root__info"]}>
        <div>
          <Tooltip title={data.description} color="black">
            <p className={styles["root__category-name"]} dangerouslySetInnerHTML={{ __html: data.description }} />
          </Tooltip>
          <h1 className={styles["root__product-name"]}>{data.name}</h1>
          <Rate disabled allowHalf defaultValue={3.5} /> 3.5 (5 reviews)
          {productPrice.priceSale ? (
            <div className={styles["price-sale"]}>
              <p className={styles.root__price}>
                {formatMoney(productPrice.priceSale)}
              </p>
              <p className={styles["root__price-sale"]}>
                {formatMoney(productPrice.price)}
              </p>
              <div className={styles["percent"]}>
                {Math.round(
                  ((productPrice.price - productPrice.priceSale) /
                    productPrice.price) *
                    100
                )}
                %
              </div>
            </div>
          ) : (
            <p className={styles.root__price}>
              {formatMoney(productPrice.price)}
            </p>
          )}
          {Object.keys(variations).length > 0 ? (
            <>
              {variations.map((variation: any, i: any) => {
                if (variation.name === "Colour" || variation.name === "Color") {
                  return (
                    <div key={i}>
                      <span>Color:</span>
                      <div className={styles["root__variant-container"]}>
                        {variation.options.map((item: any, index: any) => {
                          return (
                            <div
                              className={`${styles["variant"]} ${
                                selected[variation.id] === item.id
                                  ? styles["variant-color__selected"]
                                  : ""
                              }`}
                              key={index}
                              style={{
                                backgroundColor: item.name,
                              }}
                              onClick={() => onSelect(variation.id, item.id)}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (!Array.isArray(variation.options)) {
                  return <div key={i}></div>;
                }

                return (
                  <div key={i}>
                    <span>{variation.name}:</span>
                    <div className={styles["root__variant-container"]}>
                      {variation.options.map((item: any, index: any) => {
                        return (
                          <div
                            className={`${styles["variant"]} ${
                              selected[variation.id] === item.id
                                ? styles["variant-size__selected"]
                                : ""
                            }`}
                            key={index}
                            onClick={() => onSelect(variation.id, item.id)}
                          >
                            {item.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            ""
          )}
          <div className={styles["error-message"]}>{cartError}</div>
          <Row className={styles["root__purchase"]}>
            <Col xs={8} className={styles["root__qty-container"]}>
              <p className={styles["root__qty-text"]}>Qty:</p>
              <Input
                value={Number(quantitySelected).toString()}
                className="ant-dropdown-link"
                onChange={(e) => {
                  setQuantitySelected(Number(e.target.value));
                }}
                style={{ width: "65px" }}
                type="number"
                min="1"
              ></Input>
            </Col>
            <Col xs={16} className={styles["root__button-group"]}>
              {quantitySelected <= 0 ? (
                <div className="error-message">
                  Quantity must greater than 0
                </div>
              ) : (
                ""
              )}
              <Button
                className={`${styles["root__button"]} ${styles["root__button--add-to-cart"]}`}
                onClick={handleAddToCart}
                disabled={
                  quantitySelected <= 0 ||
                  Object.keys(selected).length < variations.length
                }
              >
                ADD TO CART
              </Button>
              {type === "modal" ? (
                <Link to={`/product/${productId}`}>
                  <p className={styles["root__see-product"]}>
                    SEE FULL PRODUCT DETAILS
                  </p>
                </Link>
              ) : (
                <Button
                  //onClick={() => history.push("/checkout")}
                  className={`${styles["root__button"]} ${styles["root__button--pickup"]}`}
                >
                  FIND A STORE FOR PICKUP
                </Button>
              )}
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: "10px" }}>
          <Coupon data={promo} />
        </div>
      </Col>
    </Row>
  );
};
