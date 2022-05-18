import React from "react";
import styles from "./Promotion.module.scss";

export const Promotion = () => {
  return (
    <div className={styles["promotion"]}>
      <div className={styles["promotion__Left"]}>
        <p>
          GET 3$ OFF <b> {">"} </b>
        </p>
      </div>
      <div className={styles["promotion__Right"]}>
        <h1>
          Join now & <b>get $3 Off </b>
        </h1>
        <div className={styles["form__group"]}>
          <input type="text" />
          <button>Join & Save</button>
        </div>
      </div>
    </div>
  );
};
