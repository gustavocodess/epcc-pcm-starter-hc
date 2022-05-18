import { ReactElement } from "react";

export interface DescriptionItemProps {
  title: string;
  content: string | ReactElement;
  defaultState?: boolean;
}

export interface ProductDescriptionProps {
  title: string;
  details: Object;
}
