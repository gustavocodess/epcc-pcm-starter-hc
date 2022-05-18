import { Col, Row } from "antd";
import React, { useState, useEffect } from "react";
import ProductListLeft from "./ProductListLeft";
import styles from "./ProductList.module.scss";
import { ExpandProps } from "src/interfaces/ProductList";
import ProductListTypeChild from "./ProductListType";
import ProductListType from "./config";
import { useParams, withRouter } from "react-router-dom";
import { useAppSelector } from "src/hooks/hooks";
import { selectProductList } from "./ProductListType/ProductListSlice";
import { Breadcrumb } from "src/components/Breadcrumb/Breadcrumb";
import { getProductListByCategoryId } from "../productService";
import useQuery from "src/hooks/query";
import { getNodeDetail } from "./ProductListType/ProductListService";
import { WOMEN_NODE_ID } from "src/config";

interface DataProps {
  value: string;
}
interface ProductListTypeFilterProps {
  name: string;
  status: boolean;
  data: DataProps[];
}

type CategoryIdParams = {
  categorySlug?: string;
  hierarchySlug?: string;
};

const ProductList = () => {
  const query: any = useQuery();

  const [pageSize, setPageSize] = useState<number>(
    query?.pageSize && !isNaN(query?.pageSize) ? Number(query.pageSize) : 10
  );

  const [currentPage, setCurrentPage] = useState<number>(
    query?.currentPage && !isNaN(query?.currentPage)
      ? Number(query.currentPage)
      : 1
  );
  const [total, setTotal] = useState(0);

  const { categorySlug, hierarchySlug } = useParams<CategoryIdParams>();
  const [productList, setProductlist] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [isShowBrand, setIsShowBrand] = useState<boolean>(false);

  const productListState = useAppSelector(selectProductList);
  const { breadcrumb, breadcrumbLoading }: any = productListState;

  const [arrayFilter, setArrayFilter] = useState<ProductListTypeFilterProps[]>([
    ...ProductListType.ProductListTypeFilter,
  ]);
  const [slider, setSlider] = useState<any>([0, 200]);
  const [modalItem, setModalItem] = useState<boolean>(false);
  const [expand, setExpand] = useState<ExpandProps>({
    categories: false,
    colors: false,
    materials: false,
    bag_type: false,
    capacity: false,
    style: false,
    brand: false,
    price_range: false,
  });

  const ModalItemFunc = (status: boolean): void => {
    setModalItem(status);
  };

  function onChange(value: string): void {}

  const onChangeCategory = (checkedValues: string[]): void => {};

  const handleSlider = (e: number[]): void => {
    setSlider(e);
  };

  function onShowSizeChange(current: number, pageSize: number): void {
    console.log(current, pageSize);
  }

  const handleExpand = (values: any, index: number): void => {
    const array = [...arrayFilter];
    array[index] = { ...values, status: !values.status };
    setArrayFilter([...array]);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        setCategoryName("");
        setIsShowBrand(false);
        setProductlist([]);
        setTotal(0);

        const { data, total }: any = await getProductListByCategoryId(
          categorySlug || hierarchySlug || "",
          pageSize,
          currentPage
        );

        const categoryName = await getNodeDetail(
          categorySlug || hierarchySlug || ""
        );

        setCategoryName(categoryName?.data?.attributes?.name);
        setIsShowBrand(
          categoryName?.data?.relationships?.hierarchy?.data?.id ===
            WOMEN_NODE_ID
        );
        setProductlist(data);
        setTotal(total);
      } catch (err) {
        setProductlist([]);
        setTotal(0);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [currentPage, pageSize, categorySlug, hierarchySlug]);

  const changeUrl = (pageSize: any, page: any) => {
    var newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      `?pageSize=${pageSize}&currentPage=${page}`;

    window.history.pushState({ path: newurl }, "", newurl);
    window.scrollTo(0, 0);
  };

  const onPageSizeChange = (size: any) => {
    setPageSize(size);
    setCurrentPage(1);
    changeUrl(size, 1);
  };

  const onPageChange = (page: any) => {
    setCurrentPage(page);
    changeUrl(pageSize, page);
  };

  return (
    <Row className={styles["product-list"]}>
      <Col
        xs={24}
        sm={24}
        md={18}
        lg={18}
        xl={18}
        className={styles["product-list"]}
        style={{ flexDirection: "column", alignItems: "flex-start" }}
      >
        <Row className={styles["product-list__parent"]}>
          <Col>
            {!breadcrumbLoading && breadcrumb ? (
              <Breadcrumb
                items={breadcrumb.map((item: any, index: number) => {
                  if (index !== breadcrumb.length - 1)
                    return {
                      title: item?.payload?.attributes?.name,
                      path: `/category/${item?.payload?.id}`,
                    };
                  else {
                    return {
                      title: item?.payload?.attributes?.name,
                    };
                  }
                })}
              />
            ) : (
              <Breadcrumb items={[]} />
            )}
          </Col>
        </Row>
        <Row className={styles["product-list__parent"]}>
          <Col
            xs={24}
            sm={24}
            md={6}
            lg={6}
            xl={6}
            className={styles["product-list__parent__col"]}
          >
            <ProductListLeft
              slider={slider && slider.length > 0 ? slider : []}
              handleSlider={handleSlider}
              onChangeCategory={onChangeCategory}
              expand={expand}
              arrayFilter={arrayFilter}
              handleExpand={handleExpand}
              setExpand={setExpand}
              onChange={onChange}
              categoryName={categoryName}
              breadcrumb={breadcrumb}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={17}
            lg={17}
            xl={17}
            className={styles["product-list__parent__col"]}
          >
            <ProductListTypeChild
              ModalItemFunc={ModalItemFunc}
              modalItem={modalItem}
              onShowSizeChange={onShowSizeChange}
              categoryName={categoryName}
              products={productList}
              loading={loading}
              isShowBrand={isShowBrand}
              total={total}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default withRouter(ProductList);
