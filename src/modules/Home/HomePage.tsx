import React, { useEffect } from "react";
import Carousel from "./Carousel/Carousel";
import OnSales from "./OnSales/OnSales";
import BestSelling from "./BestSelling/BestSelling";
import Featured from "./Featured/Featured";
import Category from "./Category/Category";
import Trending from "./Trending/Trending";
import Assurance from "./Assurance/Assurance";
import styles from "./HomePage.module.scss";
import { useAppSelector, useAppDispatch } from "src/hooks/hooks";
import { LoadingIndicator } from "src/components/LoadingIndicator/LoadingIndicator";
import { loadingType } from "src/components/LoadingIndicator/LoadingIndicatorType";
import { fetchCarousel } from "./Carousel/CarouselSlice";
import { fetchOnSales } from "./OnSales/OnSalesSlice";
import { fetchBestSelling } from "./BestSelling/BestSellingSlice";
import {
  fetchFeaturedItem,
  fetchPromotion,
} from "./Featured/FeaturedItemSlice";
import { fetchCategory } from "./Category/CategorySlice";
import {
  CAROUSEL,
  ONSALES,
  BEST_SELLING,
  FEATURED_ITEMS,
  SHOP_BY_CATEGORY,
  PROMOTION,
} from "src/config";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { item: carouselItem, loading: carouselLoading } = useAppSelector(
    (state) => state.carousel
  );
  const { item: onSalesItem, loading: onSalesLoading } = useAppSelector(
    (state) => state.onSale
  );
  const { item: bestSellingItem, loading: bestSellingLoading } = useAppSelector(
    (state) => state.bestSelling
  );
  const {
    item: featuredItem,
    loading: featuredLoading,
    promotion,
  } = useAppSelector((state) => state.featuredItem);
  const { item: categoryItem, loading: categoryLoading } = useAppSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(fetchCarousel(CAROUSEL));
    dispatch(fetchOnSales(ONSALES));
    dispatch(fetchBestSelling(BEST_SELLING));
    dispatch(fetchFeaturedItem(FEATURED_ITEMS));
    dispatch(fetchCategory(SHOP_BY_CATEGORY));
    dispatch(fetchPromotion(PROMOTION));
  }, [dispatch]);

  const isLoading =
    carouselLoading ||
    onSalesLoading ||
    bestSellingLoading ||
    featuredLoading ||
    categoryLoading;

  if (
    isLoading ||
    !carouselItem ||
    !onSalesItem ||
    !bestSellingItem ||
    !featuredItem ||
    !promotion ||
    !categoryItem
  ) {
    return <LoadingIndicator type={loadingType.FULLPAGE} />;
  }

  return (
    <div className={styles["parent"]}>
      <Carousel />
      <OnSales />
      <BestSelling />
      <Featured />
      <Category />
      <Trending />
      <Assurance />
    </div>
  );
};
export default HomePage;
