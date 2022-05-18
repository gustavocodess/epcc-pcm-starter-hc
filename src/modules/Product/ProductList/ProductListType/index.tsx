import { Link } from "react-router-dom";
import { Col, Pagination, Row } from "antd";
import ProductListTypeModal from "./../ProductListTypeModal/index";
import React, { useEffect, FC } from "react";
import styles from "./../ProductList.module.scss";
import { useAppSelector, useAppDispatch } from "src/hooks/hooks";
import { fetchBrand, selectProductList } from "./ProductListSlice";
import { ProductItem } from "src/modules/Product/ProductItem/ProductItem";
import { LoadingIndicator } from "src/components/LoadingIndicator/LoadingIndicator";
import { loadingType } from "src/components/LoadingIndicator/LoadingIndicatorType";
import { BRAND } from "src/config";

interface ProductListTypeChildProps {
  onShowSizeChange: (current: number, pageSize: number) => void;
  ModalItemFunc: (status: boolean) => void;
  modalItem: boolean;
  categoryName: string;
  products: Array<any>;
  loading: boolean | undefined;
  isShowBrand: boolean;
  pageSize: number;
  currentPage: number;
  total: number;
  onPageSizeChange: Function;
  onPageChange: Function;
}

const ProductListTypeChild: FC<ProductListTypeChildProps> = ({
  modalItem,
  ModalItemFunc,
  categoryName,
  loading,
  isShowBrand,
  products,
  pageSize,
  currentPage,
  total,
  onPageSizeChange,
  onPageChange,
}) => {
  function handleChange(value: string): void {
    console.log(`selected ${value}`);
  }

  const dispatch = useAppDispatch();
  const productListState = useAppSelector(selectProductList);
  const { brand }: any = productListState;

  const [quickViewProduct, setQuickViewProduct] = React.useState<string>("");

  useEffect(() => {
    dispatch(fetchBrand(BRAND));
  }, [dispatch]);

  // const isWomenCategory = useMemo((): boolean => {
  //   if (breadcrumb)
  //     return breadcrumb.some((item: any) => {
  //       return item?.payload?.attributes?.name === "Women";
  //     });
  //   return false;
  // }, [breadcrumb]);

  return (
    <div
      className={`${styles["product-list__parent__col__right"]} ${styles.root}`}
    >
      <div className={styles["product-list__parent__col__right__title"]}>
        {categoryName}
      </div>
      {isShowBrand && (
        <Row className={styles["product-list__parent__col__right-type"]}>
          {brand &&
            brand["component-details"]?.map((item: any, index: number) => {
              return (
                <Col
                  key={index}
                  className={
                    styles["product-list__parent__col__right__col-type"]
                  }
                  xs={24}
                  sm={11}
                  md={11}
                  lg={4}
                  xl={4}
                >
                  <div className={styles.root__brand}>
                    <Link to={item["cta-uri"]}>
                      <img
                        className={styles["image"]}
                        src={item["image-uri"]}
                        alt="ProductList"
                        width="110px"
                        height="110px"
                      />
                      <p className={styles["root__brand-name"]}>
                        {item["text-1"]}
                      </p>
                    </Link>
                  </div>
                </Col>
              );
            })}
        </Row>
      )}
      <div className={styles["product-list__parent__col__title"]}>
        <p
          className={styles["product-list__parent__col__title-bold"]}
          style={{ padding: "0rem 0.5rem" }}
        >
          Results: {total} item{total > 1 ? "s" : ""}
        </p>
        <div> | </div>
        <div className={styles["root__pagesize-container"]}>View</div>
        <div
          className={
            styles[`root__pagesize${pageSize === 10 ? "-active" : "-inactive"}`]
          }
          onClick={() => onPageSizeChange(10)}
          style={{
            cursor: "pointer",
          }}
        >
          10
        </div>
        <div
          className={
            styles[`root__pagesize${pageSize === 20 ? "-active" : "-inactive"}`]
          }
          onClick={() => onPageSizeChange(20)}
          style={{
            cursor: "pointer",
          }}
        >
          20
        </div>
      </div>
      <Row
        className={styles["product-list__parent__col__right__bottom"]}
        align="top"
      >
        {products && !loading ? (
          products.map((product: any, index: number) => {
            const { attributes, id, meta, main_images } = product;
            const { name, description } = attributes;

            const price = {
              priceSale: meta.original_price
                ? attributes?.price?.USD?.amount
                : null,
              price: meta.original_price
                ? meta?.original_price?.USD?.amount
                : attributes?.price?.USD?.amount,
            };

            return (
              <Col
                key={index}
                className={
                  styles["product-list__parent__col__right__bottom__col"]
                }
                xs={24}
                sm={24}
                md={8}
                lg={8}
                xl={8}
              >
                <div className={styles["root__product-container"]}>
                  <div
                    className={styles["root__quick-view"]}
                    onClick={() => {
                      setQuickViewProduct(id);
                      ModalItemFunc(!modalItem);
                    }}
                  >
                    QUICK VIEW
                  </div>
                  <ProductItem
                    name={name}
                    sub={description}
                    price={price}
                    productId={product.id}
                    image={main_images?.link?.href}
                    variations={product?.meta?.variations || []}
                  />
                </div>
              </Col>
            );
          })
        ) : (
          <LoadingIndicator
            type={loadingType.COMPONENT}
            size={{ width: "100%", height: "300px" }}
          />
        )}
        <Col span={24}>
          {products?.length === 0 && loading === false && (
            <p className={styles["root__no-product-found"]}>No product found</p>
          )}
        </Col>
      </Row>
      <Row className={styles["product-list__parent__col__right__pagination"]}>
        <Col
          className={
            styles["product-list__parent__col__right__pagination__col"]
          }
          xs={24}
          sm={24}
          md={5}
          lg={5}
          xl={5}
        >
          <div
            className={
              styles["product-list__parent__col__right__pagination__col-left"]
            }
          >
            <div
              className={
                styles[
                  "product-list__parent__col__right__pagination__col__parent-left"
                ]
              }
            >
              View
            </div>
            <div
              className={
                styles[
                  `product-list__parent__col__right__pagination__col__parent${
                    pageSize === 10 ? "-active" : "-inactive"
                  }`
                ]
              }
              onClick={() => onPageSizeChange(10)}
              style={{
                cursor: "pointer",
              }}
            >
              10
            </div>
            <div
              className={
                styles[
                  `product-list__parent__col__right__pagination__col__parent${
                    pageSize === 20 ? "-active" : "-inactive"
                  }`
                ]
              }
              onClick={() => onPageSizeChange(20)}
              style={{
                cursor: "pointer",
              }}
            >
              20
            </div>
          </div>
        </Col>
        <Col
          className={
            styles["product-list__parent__col__right__pagination__col"]
          }
          xs={24}
          sm={24}
          md={18}
          lg={18}
          xl={18}
        >
          <Pagination
            className={
              styles[
                "product-list__parent__col__right__pagination__col__parent"
              ]
            }
            onShowSizeChange={(size: number) => {
              onPageSizeChange(size);
            }}
            current={currentPage}
            total={total}
            defaultPageSize={pageSize}
            onChange={(page) => onPageChange(page)}
            pageSizeOptions={["10", "20"]}
            pageSize={pageSize}
          />
        </Col>
      </Row>
      {modalItem && (
        <ProductListTypeModal
          ModalItemFunc={ModalItemFunc}
          handleChange={handleChange}
          modalItem={modalItem}
          productId={quickViewProduct}
        />
      )}
    </div>
  );
};
export default ProductListTypeChild;
