import React from "react";
import style from "./Coupon.module.scss";

interface CouponProps {
  data: any;
}

const Coupon: React.FC<CouponProps> = ({ data }: CouponProps) => {
  return (
    <div>
      {data && Object.keys(data).length > 0 ? (
        <div className={style.coupon_wrapper}>
          <img src={data["promotion-image"]} width="100%" alt="" />
          <div className={style.outer}>
            {data["promotion-code"] && (
              <div className={style.inner}>
                <div className={style.content}>{data["promotion-code"]}</div>
              </div>
            )}
          </div>
          <div className={style.des}>{data["promotion-descriptions"]}</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Coupon;
