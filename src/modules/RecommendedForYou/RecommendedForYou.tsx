import React, { FC, useState } from "react";
import styles from "./RecommendedForYou.module.scss";
import Slider from "react-slick";
import { ProductItem } from "src/components/ProductItem/ProductItem";
import { useMediaQuery } from "react-responsive";

interface RecommendedForYouProps {
  productIds: Array<string>;
}

const RecommendedForYou: FC<RecommendedForYouProps> = ({ productIds }) => {
  const [slideIndex, setSlideIndex] = useState<number | undefined>(0);

  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const isTablet = useMediaQuery({ minWidth: 768 });
  const settings = {
    infinite: false,
    speed: 500,
    vertical: false,
    slidesToShow: isDesktopOrLaptop ? 4 : isTablet ? 3 : 2,
    slidesToScroll: 1,
    focusOnSelect: true,
    nextArrow: <></>,
    prevArrow: <></>,
    dots: true,
    customPaging: (i: number) => {
      return (
        <div
          className={styles.dots}
          style={{ backgroundColor: i === slideIndex ? "black" : "#c4c3c3" }}
        ></div>
      );
    },
    beforeChange: (current: number, next: number) => {
      setSlideIndex(next);
    },
  };
  return (
    <>
      {Array.isArray(productIds) && productIds.length > 0 ? (
        <div className={styles.root}>
          <h1 className={styles.root__title}>Recommended For You</h1>
          <Slider
            {...settings}
            className={`${styles.root__slider} viewed__slider`}
          >
            {productIds.map((x: any, index: any) => {
              return (
                <div key={index}>
                  <ProductItem data={{ id: x }} />
                </div>
              );
            })}
          </Slider>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default RecommendedForYou;
