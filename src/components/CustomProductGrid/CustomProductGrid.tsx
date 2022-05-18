import React, { useEffect, useRef, useState } from 'react';
import { List } from 'antd'
import { getProductDetail } from 'src/modules/Product/productService';
import { ProductItem } from 'src/modules/Product/ProductItem/ProductItem';
interface CustomProductGridProps {
  'products list': string[];
}

export const CustomProductGrid: React.FC<CustomProductGridProps> = (props) => {
  const [productsMap, setProductsMap] = useState ({} as Record<string, moltin.CartItem>);
  const prevMapRef = useRef({} as Record<string, moltin.CartItem>);

  const productIdsList = props['products list']

  async function fetchProduct(productId: string) {
    const productData = await getProductDetail(productId);
    const newMap = { ...prevMapRef.current, [productId]: { ...productData.data}}
    setProductsMap(newMap)
  }

  useEffect(() => {
    prevMapRef.current = productsMap;
  }, [productsMap])

  useEffect(() => {
    if (productIdsList && productIdsList.length) {
      productIdsList.forEach((productId) => {
        if (!productsMap[productId]) {
          fetchProduct(productId)
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIdsList?.join(',')])


  const mapToDisplay = productsMap

  Object.keys(productsMap).map(key => {
    if (!productIdsList.includes(key)) {
      delete mapToDisplay[key]
    }
  })

  const productsList = productIdsList.filter(key => mapToDisplay[key]).map((key) => (mapToDisplay[key]))

  return (
    <div>
      <List
        grid={{ gutter: 24, column: 3 }}
        dataSource={productsList}
        renderItem={product => (
          <List.Item key={product.id}>
            <ProductItem
              name={product?.attributes?.name}
              sub={product?.attributes?.description}
              price={{ price: product?.attributes?.price?.USD?.amount || 0 }}
              productId={product.id}
              image={product?.image}
              // @ts-ignore
              variations={product?.meta?.variations || []}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
