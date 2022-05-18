export enum loadingType {
  FULLPAGE = "full",
  COMPONENT = "component",
}

export interface LoadingIndicatorProps {
  type: loadingType;
  size?: {
    width?: string;
    height?: string;
  };
}
