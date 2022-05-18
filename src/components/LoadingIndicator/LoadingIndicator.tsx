import React, { FC } from "react";
import styles from "./LoadingIndicator.module.scss";
import { LoadingIndicatorProps, loadingType } from "./LoadingIndicatorType";

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ type, size }) => {
  return (
    <div
      className={styles.root}
      style={{
        height:
          type === loadingType.FULLPAGE ? "100vh" : size?.height || "unset",
        width: type === loadingType.FULLPAGE ? "100vw" : size?.width || "unset",
      }}
    >
      <div></div>
    </div>
  );
};
