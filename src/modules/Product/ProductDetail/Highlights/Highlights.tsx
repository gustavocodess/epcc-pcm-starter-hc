import React, { FC, useMemo } from "react";
import styles from "./Highlights.module.scss";
import { Row, Col } from "antd";
import { ProductHighlightProps } from "./HighlightsType";

import { useMediaQuery } from "react-responsive";

export const Highlights: FC<ProductHighlightProps> = ({ data }) => {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });

  const format = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return [];
    }

    const keys = Object.keys(data);
    let isEmpty = true;
    for (let i = 0; i < keys.length; i++) {
      const element = data[keys[i]];
      if (element) {
        isEmpty = false;
        break;
      }
    }

    if (isEmpty) {
      return [];
    }

    return [
      {
        image: data["product-highlight-image-1"],
        title: data["product-highlight-title-1"],
        content: data["product-highlight-text-1"],
      },
      {
        image: data["product-highlight-image-2"],
        title: data["product-highlight-title-2"],
        content: data["product-highlight-text-2"],
      },
      {
        image: data["product-highlight-image-3"],
        title: data["product-highlight-title-3"],
        content: data["product-highlight-text-3"],
      },
    ];
  }, [data]);

  if (format.length === 0) {
    return <></>;
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.root__title}>Highlights</h1>
      <Row gutter={[isDesktopOrLaptop ? 24 : 0, 16]}>
        {format.map((highlight, index) => {
          return (
            <Col xs={24} sm={12} md={12} lg={8} xl={8} key={index}>
              <img src={highlight.image} alt="hightlight" width="100%" />

              <p className={styles["root__section-title"]}>{highlight.title}</p>
              <p className={styles["root__section-content"]}>
                {highlight.content}
              </p>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
