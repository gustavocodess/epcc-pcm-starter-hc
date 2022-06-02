import React, { FC, useMemo } from "react";
import styles from "./ProductItem.module.scss";
import { Row, Col, Tooltip, Skeleton } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { formatMoney } from "src/utils/helper";

export const ProductItem: FC<any> = (props) => {
  const { name, sub, productId, price, variations, image } = props;

  const variationFormat = useMemo(() => {
    if (Array.isArray(variations)) {
      const colorIndex = variations.findIndex(
        (x: any) => x.name === "Color" || x.name === "Colour"
      );

      const colorInfo = variations[colorIndex];

      if (colorIndex >= 0) {
        const result = [...variations];
        result.splice(colorIndex, 1);
        result.unshift(colorInfo);
        return result;
      }

      return [...variations];
    }

    return [];
  }, [variations]);

  return (
    <div className={styles.root}>
      <Link to={`/product/${productId}`}>
        <div className={styles["root__product-image-container"]}>
          {image ? (
            <img
              className={styles["root__product-image"]}
              src={image}
              alt="ProductList"
              height="100%"
              style={{ width: 'auto', margin: 'auto' }}
            />
          ) : (
            <Skeleton.Image
              className={styles["root__product-image"]}
              style={{ width: "auto", height: "100%" }}
            />
          )}
        </div>
      </Link>
      <Row className={styles.root__action}>
        <Col className={styles.root__variant} span="auto">
          {Array.isArray(variationFormat) && variationFormat.length > 0 ? (
            <>
              {variationFormat.slice(0, 1).map((variation: any, i: any) => {
                if (variation.name === "Colour" || variation.name === "Color") {
                  return (
                    <div key={i}>
                      <span>Color:</span>
                      <div className={styles["root__variant-container"]}>
                        {variation.options.map((item: any, index: any) => {
                          return (
                            <div
                              className={`${styles["variant"]}`}
                              key={index}
                              style={{
                                backgroundColor: item.name,
                              }}
                              onClick={() => {}}
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
                            className={`${styles["variant"]}`}
                            key={index}
                            onClick={() => {}}
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
        </Col>
        <Col span="auto">
          <HeartOutlined className={styles.root__heart} />
        </Col>
      </Row>
      <Tooltip title={name || "Nyon"}>
        <Link to={`/product/${productId}`}>
          <p className={styles["root__product-name"]}>{name || "Nyon"}</p>
        </Link>
      </Tooltip>
      <Tooltip title={sub || "Casual USB Charging Multifunctional"}>
        <p className={styles["root__product-description"]} dangerouslySetInnerHTML={{ __html: sub }} />
      </Tooltip>
      <Row align="middle">
        <Col span="auto">
          <span className={styles["root__product-price"]}>
            {price.priceSale ? (
              <>{formatMoney(price.priceSale)}</>
            ) : (
              <>{formatMoney(price.price)}</>
            )}
          </span>
          {price.priceSale && (
            <span className={styles["root__product-price-sale"]}>
              {formatMoney(price.price)}
            </span>
          )}
        </Col>
        {price.priceSale && (
          <Col span="auto">
            <div className={styles["root__product-sale"]}>
              {Math.round(
                ((price.price - price.priceSale) / price.price) * 100
              )}
              %
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};
