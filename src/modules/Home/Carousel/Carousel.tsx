import React, { useState } from "react";
import styles from "./Carousel.module.scss";
import { useAppSelector } from "src/hooks/hooks";
import { ReactComponent as ArrowLeftIcon } from "src/assets/images/icons/arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "src/assets/images/icons/arrow-right.svg";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { config } from "src/config";

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
    <ArrowLeftIcon className={styles["container__arrow_left-slider"]} />
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
    <ArrowRightIcon className={styles["container__arrow_right-slider"]} />
  </div>
);

export default function Carousel() {
  const [, setSlideIndex] = useState<number | undefined>(0);

  const { item } = useAppSelector((state) => state.carousel);

  const settings = {
    infinite: true,
    speed: 1600,
    slidesToShow: 1,
    slidesToScroll: 1,
    focusOnSelect: true,
    dots: true,
    autoplay: true,
    autoplaySpeed: config.autoplaySpeed,
    customPaging: (i: number) => {
      return <div className="carousel-dot"></div>;
    },
    beforeChange: (_current: number, next: number) => {
      setSlideIndex(next);
    },
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };

  return (
    <div className={styles["container-slider"]}>
      <Slider {...settings} swipeToSlide={true}>
        {item["component-details"]
          .slice()
          .sort(function (a: any, b: any) {
            return a.order - b.order;
          })
          .map((item: any, index: number) => {
            return (
              <div key={index}>
                <div className={styles["slide__parent"]}>
                  <img
                    className={styles["image"]}
                    alt="CarouselImage"
                    src={item["image-uri"]}
                  />
                  <div className={styles["slide-title"]}>{item["text-1"]}</div>
                  <div className={styles["slide-description"]}>
                    {item["text-2"]}
                  </div>
                  <div className={styles["slide-btn"]}>
                    <Link to="/path-to-details-page">{item["cta-text"]}</Link>
                  </div>
                </div>
              </div>
            );
          })}
      </Slider>
      {/* <div>
        <LeftOutlined
          onClick={prevSlide}
          className={styles["container__arrow_left-slider"]}
        />
      </div>
      <div>
        <RightOutlined
          onClick={nextSlide}
          className={styles["container__arrow_right-slider"]}
        />
      </div> */}

      {/* <div className={styles["container-dots"]}>
        {item["component-details"].map((item: any, index: number) => (
          <div
            key={index}
            onClick={() => moveDot(index + 1)}
            className={
              slideIndex === index + 1 ? styles["active"] : styles["dot"]
            }
          ></div>
        ))}
      </div> */}
    </div>
  );
}
