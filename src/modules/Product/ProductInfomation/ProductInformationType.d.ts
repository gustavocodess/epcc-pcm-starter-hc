interface Image {
  path: string;
}

export interface ProductPrice {
  price: number;
  priceSale?: number | null;
}

export interface ProductInformationProps {
  listImage: Array<Image>;
  data: any;
  variations: Array<any>;
  variationMatrix: any;
  type?: string;
  productId?: string;
  productPrice: ProductPrice;
  promo?: any;
}
