import React, { FC, useEffect, useState } from "react";
import styles from "./ProductItem.module.scss";
import { Row, Col, Tooltip, Skeleton } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getProductDetail } from "src/modules/Product/productService";
import useMounted from "src/hooks/mounted";
import { formatMoney } from "src/utils/helper";

export const ProductItem: FC<any> = (props) => {
  const { data } = props;
  const [productPrice, setProductPrice] = useState<any>();
  const [variations, setVariations] = useState<any>([]);
  const [productInfo, setProductInfo] = useState<any>({});
  const isMounted = useMounted();

  useEffect(() => {
    const init = async () => {
      if (!data.id) {
        return;
      }

      try {
        const response: any = await getProductDetail(data.id);

        const productDetail = response.data;

        if (productDetail && isMounted.current) {
          setProductInfo(productDetail);
          setProductPrice({
            priceSale: productDetail?.meta?.original_price
              ? productDetail?.attributes?.price?.USD?.amount
              : null,
            price: productDetail?.meta?.original_price
              ? productDetail?.meta?.original_price?.USD?.amount
              : productDetail?.attributes?.price?.USD?.amount,
          });

          // get variations
          if (productDetail.meta?.variations) {
            setVariations(formatVariations(productDetail.meta?.variations));
          } else if (
            productDetail.attributes?.base_product_id &&
            productDetail.attributes?.base_product_id !== data.id
          ) {
            const res: any = await getProductDetail(
              productDetail.attributes?.base_product_id
            );

            const productParent = res.data;

            if (productParent && productParent.meta?.variations) {
              setVariations(formatVariations(productParent.meta?.variations));
            }
          }
        }
      } catch (err) {
      } finally {
      }
    };
    init();
  }, [data.id, isMounted]);

  const formatVariations = (variations: any) => {
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
  };

  const salePrice = (currencies: number, sales: number): number => {
    if (!currencies || !sales) return 0;
    return 100 - Math.round((sales / currencies) * 100);
  };

  return (
    <div className={styles.root}>
      <Link to={`/product/${data.id}`}>
        <div className={styles["root__product-image-container"]}>
          {productInfo.image ? (
            <img
              className={styles["root__product-image"]}
              src={productInfo.image}
              alt="ProductList"
              width="100%"
            />
          ) : (
            <Skeleton.Image
              className={styles["root__product-image"]}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
      </Link>
      <Row className={styles.root__action}>
        <Col sm={22}>
          <Row>
            {Array.isArray(variations) && variations.length > 0 ? (
              <>
                {variations.slice(0, 1).map((variation: any, i: any) => {
                  if (
                    variation.name === "Colour" ||
                    variation.name === "Color"
                  ) {
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
          </Row>
        </Col>
        <Col sm={2}>
          <HeartOutlined className={styles.root__heart} />
        </Col>
      </Row>
      <Tooltip title={data.name}>
        <Link to={`/product/${data.id}`}>
          <p className={styles["root__product-name"]}>
            {productInfo?.attributes?.name}
          </p>
        </Link>
      </Tooltip>
      <Tooltip title={data.des}>
        <p className={styles["root__product-description"]}>
          {productInfo?.attributes?.description}
        </p>
      </Tooltip>
      <Row align="middle">
        <Col span="auto">
          <span className={styles["root__product-price"]}>
            {productPrice?.priceSale ? (
              <>{formatMoney(productPrice?.priceSale)}</>
            ) : (
              <>{formatMoney(productPrice?.price || 0)}</>
            )}
          </span>
          {productPrice?.priceSale && (
            <span className={styles["root__product-price-sale"]}>
              {formatMoney(productPrice?.price || 0)}
            </span>
          )}
        </Col>
        {productPrice?.priceSale ? (
          <Col span="auto">
            <div className={styles["root__product-sale"]}>
              {salePrice(productPrice?.price, productPrice?.priceSale)}%
            </div>
          </Col>
        ) : (
          ""
        )}
      </Row>
    </div>
  );
};
