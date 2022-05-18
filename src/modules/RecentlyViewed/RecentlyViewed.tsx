import React, { FC, useState } from "react";
import styles from "./RecentlyViewed.module.scss";
import Slider from "react-slick";
import { ProductItem } from "src/components/ProductItem/ProductItem";

import { useMediaQuery } from "react-responsive";
import { getViewedList } from "./RecentlyViewedService";

export const RecentlyViewed: FC = () => {
  const [slideIndex, setSlideIndex] = useState<number | undefined>(0);
  const [viewedList] = useState(getViewedList());

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
    <div className={styles.root}>
      <h1 className={styles.root__title}>Recently Viewed</h1>
      <Slider {...settings} className={`${styles.root__slider} viewed__slider`}>
        {viewedList.map((x: any, index: any) => {
          return (
            <div key={index}>
              <ProductItem data={x} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};
