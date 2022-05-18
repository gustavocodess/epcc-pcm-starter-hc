export interface ExpandProps {
  categories: boolean;
  colors: boolean;
  materials: boolean;
  bag_type: boolean;
  capacity: boolean;
  style: boolean;
  brand: boolean;
  price_range: boolean;
}
export interface ProductListLeftProps {
  slider: any;
  handleExpand: (values: any, index: number) => void;
  handleSlider: (e: number[]) => void;
  onChangeCategory: (e: any) => void;
  onChange: (e: any) => void;
  arrayFilter: any;
  expand: ExpandProps;
  setExpand: any;
  categoryName: string;
  breadcrumb: Array<any>;
}
