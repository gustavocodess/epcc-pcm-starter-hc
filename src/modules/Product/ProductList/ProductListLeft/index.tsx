import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";
import { Checkbox, Col, Row, Select, Slider } from "antd";
import styles from "./../ProductList.module.scss";
import { ProductListLeftProps } from "src/interfaces/ProductList";
import { useAppSelector } from "src/hooks/hooks";
import { selectProductList } from "../ProductListType/ProductListSlice";
import { Link } from "react-router-dom";

const ProductListLeft: React.FC<ProductListLeftProps> = ({
  slider,
  handleSlider,
  arrayFilter,
  onChangeCategory,
  onChange,
  handleExpand,
}) => {
  const { Option } = Select;

  const productListState = useAppSelector(selectProductList);
  const [toggleCategory, setToggleCategory] = React.useState(false);

  const { categoryChildren } = productListState;

  return (
    <div className={styles["product-list__parent__col__left__top"]}>
      <div className={styles["product-list__parent__col__left__top__select"]}>
        <Select
          className={
            styles["product-list__parent__col__left__top__select-main"]
          }
          placeholder="Sort By"
          defaultValue="SortBy"
          bordered={false}
          onChange={onChange}
        >
          <Option value="SortBy">
            <div
              className={
                styles[
                  "product-list__parent__col__left__top__select__item-main"
                ]
              }
            >
              Sort By
            </div>
          </Option>
          <Option value="name">
            <div
              className={
                styles[
                  "product-list__parent__col__left__top__select__item-main"
                ]
              }
            >
              Name
            </div>
          </Option>
          <Option value="price">
            <div
              className={
                styles[
                  "product-list__parent__col__left__top__select__item-main"
                ]
              }
            >
              Price
            </div>
          </Option>
        </Select>
      </div>
      <div className={styles["product-list__parent__col__left__bottom"]}>
        <div
          className={styles["product-list__parent__col__left__bottom__title"]}
        >
          Filter By:{" "}
        </div>
        {categoryChildren.length > 0 && (
          <div
            className={styles["product-list__parent__col__left__bottom__item"]}
          >
            <div
              className={
                styles["product-list__parent__col__left__bottom__item__title"]
              }
              onClick={() =>
                setToggleCategory((toggleCategory) => !toggleCategory)
              }
            >
              <div>Categories</div>
              <div>
                {toggleCategory ? (
                  <MinusOutlined
                    className={
                      styles[
                        "product-list__parent__col__left__bottom__item__title-icon"
                      ]
                    }
                  />
                ) : (
                  <PlusOutlined
                    className={
                      styles[
                        "product-list__parent__col__left__bottom__item__title-icon"
                      ]
                    }
                  />
                )}
              </div>
            </div>
            {toggleCategory ? (
              <div
                className={
                  styles[
                    "product-list__parent__col__left__bottom__item__checkbox__group"
                  ]
                }
              >
                <Checkbox.Group
                  className={
                    styles[
                      "product-list__parent__col__left__bottom__item__checkbox__group"
                    ]
                  }
                  onChange={onChangeCategory}
                >
                  <Row>
                    {categoryChildren.length > 0 &&
                      categoryChildren.map(
                        (valuesData: any, indexData: number) => {
                          return (
                            <Col key={indexData} span={24}>
                              <Link
                                className={
                                  styles[
                                    "product-list__parent__col__left__bottom__item__category"
                                  ]
                                }
                                to={`/category/${valuesData.id}`}
                              >
                                {valuesData.attributes.name}
                              </Link>
                            </Col>
                          );
                        }
                      )}
                  </Row>
                </Checkbox.Group>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
        {arrayFilter &&
          arrayFilter.length > 0 &&
          arrayFilter.map((values: any, index: number) => {
            return (
              <div
                key={index}
                className={
                  styles["product-list__parent__col__left__bottom__item"]
                }
              >
                <div
                  onClick={() => handleExpand(values, index)}
                  className={
                    styles[
                      "product-list__parent__col__left__bottom__item__title"
                    ]
                  }
                >
                  <div>{values.name}</div>
                  <div>
                    {values.status ? (
                      <MinusOutlined
                        className={
                          styles[
                            "product-list__parent__col__left__bottom__item__title-icon"
                          ]
                        }
                      />
                    ) : (
                      <PlusOutlined
                        className={
                          styles[
                            "product-list__parent__col__left__bottom__item__title-icon"
                          ]
                        }
                      />
                    )}
                  </div>
                </div>
                {values.status ? (
                  <div
                    className={
                      styles[
                        "product-list__parent__col__left__bottom__item__checkbox__group"
                      ]
                    }
                  >
                    <Checkbox.Group
                      className={
                        styles[
                          "product-list__parent__col__left__bottom__item__checkbox__group"
                        ]
                      }
                      onChange={onChangeCategory}
                    >
                      <Row>
                        {values.data &&
                          values.data.length > 0 &&
                          values.data.map(
                            (valuesData: any, indexData: number) => {
                              return (
                                <Col key={indexData} span={24}>
                                  <Checkbox
                                    className={
                                      styles[
                                        "product-list__parent__col__left__bottom__item__checkbox"
                                      ]
                                    }
                                    value={valuesData.value}
                                  >
                                    {valuesData.value}
                                  </Checkbox>
                                </Col>
                              );
                            }
                          )}
                      </Row>
                    </Checkbox.Group>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        <div className={styles["slider"]}>
          <div>{`SG $${slider && slider.length > 0 ? slider[0] : "0"}`}</div>
          <Slider
            min={1}
            max={200}
            onChange={handleSlider}
            className={styles["slider"]}
            range
            defaultValue={slider}
            disabled={false}
          />
          <div className={styles["slider-right"]}>{`SG $${
            slider && slider.length > 0 ? slider[1] : "200"
          }`}</div>
        </div>
        <div className={styles["range"]}>
          <div className={styles["apply-range"]}>APPLY PRICE RANGE</div>
        </div>
      </div>
    </div>
  );
};
export default ProductListLeft;
