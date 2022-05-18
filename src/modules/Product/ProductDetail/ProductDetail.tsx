import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetail.module.scss";
import { Row, Col } from "antd";
//import { Breadcrumb } from "src/components/Breadcrumb/Breadcrumb";
import { BuilderComponent } from '@builder.io/react'
import { ProductInfomation } from "../ProductInfomation/ProductInfomation";
import { Highlights } from "./Highlights/Highlights";
import { ProductDescription } from "./ProductDescription/ProductDescription";
import { Reviews } from "./Reviews/Reviews";
import { getImage, getProductDetail } from "src/modules/Product/productService";
import { ProductPrice } from "../ProductInfomation/ProductInformationType";
import { RecentlyViewed } from "src/modules/RecentlyViewed/RecentlyViewed";
import { setViewedList } from "src/modules/RecentlyViewed/RecentlyViewedService";
import RecommendedForYou from "src/modules/RecommendedForYou/RecommendedForYou";
import useMounted from "src/hooks/mounted";
import { formatProductMatrix } from "src/utils/helper";
import { LoadingIndicator } from "src/components/LoadingIndicator/LoadingIndicator";
import { loadingType } from "src/components/LoadingIndicator/LoadingIndicatorType";

type ProductSlugParams = {
  productSlug: string;
};

export const ProductDetail: FC = () => {
  const isMounted = useMounted();
  const [data, setData] = useState<any>();
  const [productParent, setProductParent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [heightLightData, setHeightData] = useState<any>({});
  const [recommended, setRecommended] = useState<any>([]);
  const [extensions, setExtensions] = useState<any>([]);
  const [productPrice, setProductPrice] = useState<ProductPrice>({
    price: 0,
    priceSale: 0,
  });
  const [productPromo, setProductPromo] = useState<any>({});

  const { productSlug } = useParams<ProductSlugParams>();
  const [listImage, setListImage] = useState<Array<any>>([]);
  const [variations, setVariations] = useState<Array<any>>([]);
  const [variationMatrix, setVariationMatrix] = useState({});

  const productDetail = useCallback(async () => {
    try {
      setLoading(true);
      setData(null);
      const { data }: any = await getProductDetail(productSlug);
      if (!isMounted.current) {
        return;
      }

      if (data) {
        setProductPrice({
          priceSale: data?.meta?.original_price
            ? data?.attributes?.price?.USD?.amount
            : null,
          price: data?.meta?.original_price
            ? data?.meta?.original_price?.USD?.amount
            : data?.attributes?.price?.USD?.amount,
        });

        const product = {
          id: productSlug,
          name: data.attributes.name,
          des: data.attributes.description,
          sku: data.attributes.sku,
        };

        // get variations
        if (data.meta?.variations) {
          setVariations(formatVariations(data.meta?.variations));
          setVariationMatrix(formatProductMatrix(data.meta?.variation_matrix));
        } else if (
          data.attributes?.base_product_id &&
          data.attributes?.base_product_id !== productSlug
        ) {
          const res: any = await getProductDetail(
            data.attributes?.base_product_id
          );

          const productParent = res.data;
          setProductParent(productParent);

          if (productParent && productParent.meta?.variations) {
            setVariations(formatVariations(productParent.meta?.variations));
            setVariationMatrix(
              formatProductMatrix(productParent.meta?.variation_matrix)
            );
          }
        }

        setViewedList(product);
      }

      const detail: any = data.attributes?.extensions;
      if (detail) {
        setHeightData(detail["products(product-highlight-template)"] || {});

        const recommended = detail["products(recommended-product-template)"];
        if (recommended) {
          let list: Array<any> = Object.keys(recommended)
            .filter((key) => recommended[key])
            .map((x) => recommended[x]);

          setRecommended(list);
        }

        if (detail["products(product-promotion)"]) {
          setProductPromo(detail["products(product-promotion)"]);
        }

        const restExtensions = [];
        for (const [key, value] of Object.entries(detail)) {
          if (
            key !== "products(product-highlight-template)" &&
            key !== "products(recommended-product-template)" &&
            key !== "products(product-promotion)"
          ) {
            restExtensions.push({
              key: "",
              value,
            });
          }
        }

        setExtensions(restExtensions);
      }

      setData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [productSlug, isMounted]);

  useEffect(() => {
    setListImage([]);
    productDetail();
  }, [productSlug, productDetail]);

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

  const productImage = useCallback(
    async (data: any) => {
      try {
        const listImageTemp: any = [];
        for (let i = 0; i < data.length; i++) {
          const image: any = await getImage(data[i].id);

          if (image?.link?.href) {
            listImageTemp.push({
              path: image.link.href,
            });
          }
        }

        if (isMounted.current) {
          setListImage(listImageTemp);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [isMounted]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const images =
      data?.relationships?.files?.data ||
      productParent?.relationships?.files?.data;
    if (images && Array.isArray(images)) {
      productImage(images);
    }
  }, [data, productParent, productImage]);

  return (
    <>
      {loading ? (
        <div className={styles.root}>
          <LoadingIndicator type={loadingType.FULLPAGE}></LoadingIndicator>
        </div>
      ) : !data || !data.attributes ? (
        <Row className={styles.root} justify="center">
          <div>
            Product is not available at the moment. Please check back again
            later.
          </div>
        </Row>
      ) : (
        <Row className={styles.root} justify="center">
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            {/* <Breadcrumb
              items={breadcrumb?.data?.map((item: any) => {
                return {
                  title: item.attributes.name,
                  path: `/category/${item.id}`,
                };
              })}
              current={data.attributes?.["name"]}
            /> */}
          </Col>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <ProductInfomation
              listImage={data?.image ? [{ path: data?.image }] : listImage}
              data={data.attributes}
              productId={productSlug}
              productPrice={productPrice}
              promo={productPromo}
              variations={variations}
              variationMatrix={variationMatrix}
            />
          </Col>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <Highlights data={heightLightData} />
          </Col>
          {Array.isArray(extensions)
            ? extensions.map((item, index) => {
                return (
                  <Col xs={24} sm={24} md={18} lg={18} xl={18} key={index}>
                    <ProductDescription title={item.key} details={item.value} />
                  </Col>
                );
              })
            : ""}
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <BuilderComponent
              model="product-info-section"
            />
          </Col>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <Reviews />
          </Col>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <RecommendedForYou productIds={recommended}></RecommendedForYou>
          </Col>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <RecentlyViewed />
          </Col>
        </Row>
      )}
    </>
  );
};
