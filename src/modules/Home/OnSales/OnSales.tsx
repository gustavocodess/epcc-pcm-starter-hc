import { ReactComponent as ArrowLeftIcon } from "src/assets/images/icons/arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "src/assets/images/icons/arrow-right.svg";

import { Col, Row } from "antd";
import React, { useState } from "react";
import styles from "./OnSales.module.scss";
import { useAppSelector } from "src/hooks/hooks";
import { OnSalesItem } from "./OnSalesItem/OnSalesItem";

import Slider from "react-slick";

const slideToShow = 4;

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }: any) => (
  <div
    {...props}
    className={
      "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
    }
    aria-hidden="true"
    aria-disabled={currentSlide === 0 ? true : false}
    type="button"
  >
    <ArrowLeftIcon className={styles["root__arrow-left"]} />
  </div>
);

const SlickArrowRight = ({ currentSlide, slideCount, ...props }: any) => (
  <div
    {...props}
    className={
      "slick-next slick-arrow" +
      (currentSlide === slideCount - 1 ? " slick-disabled" : "")
    }
    aria-hidden="true"
    aria-disabled={currentSlide === slideCount - 1 ? true : false}
    type="button"
  >
    <ArrowRightIcon className={styles["root__arrow-right"]} />
  </div>
);

const OnSales = () => {
  const [, setSlideIndex] = useState<number>(0);

  const { item, loading } = useAppSelector((state) => state.onSale);

  if (!item || loading) {
    return <div className={styles["container-slider"]}>Loading ...</div>;
  }

  let dataSlider = item["component-details"];

  const initLenght = dataSlider.length;

  if (initLenght <= slideToShow) dataSlider = [...dataSlider, ...dataSlider];

  const settings = {
    infinite: true,
    speed: 500,
    vertical: false,
    slidesToShow: initLenght > 4 ? 4 : initLenght,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    beforeChange: (_current: number, next: number) => {
      setSlideIndex(next);
    },
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };

  return (
    <Row className={styles.root} justify="center">
      <Col xs={24} sm={24} md={16} lg={16} xl={16}>
        <div className={styles.root__title}>On Sale Right Now</div>
        <Slider {...settings} className={styles.root__slider}>
          {dataSlider &&
            dataSlider.length > 0 &&
            dataSlider.map((values: any, index: number) => {
              return (
                <OnSalesItem
                  key={index}
                  image={values["image-uri"]}
                  name={values["text-1"]}
                  link={values["cta-uri"]}
                  text={values["cta-text"]}
                />
              );
            })}
        </Slider>
      </Col>
    </Row>
  );
};
export default OnSales;
