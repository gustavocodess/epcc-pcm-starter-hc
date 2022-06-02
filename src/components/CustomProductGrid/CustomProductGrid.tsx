import React, { useEffect } from 'react';
import { List } from 'antd'
import { getProductDetail } from 'src/modules/Product/productService';
import { ProductItem } from 'src/modules/Product/ProductItem/ProductItem';
import useProductGrid from 'src/hooks/productGrid';
interface CustomProductGridProps {
  'products list': string[];
}

export const CustomProductGrid: React.FC<CustomProductGridProps> = (props) => {
  const productMap = useProductGrid()

  const productIdsList = props['products list']

  async function fetchProduct(productId: string) {
    const productData = await getProductDetail(productId);
    productMap.add(productData?.data, productId)
  }

  useEffect(() => {
    if (productIdsList && productIdsList.length) {
      productIdsList.forEach((productId) => {
        if (!productMap.getMap()[productId]) {
          fetchProduct(productId)
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIdsList?.join(',')])
  

  Object.keys(productMap.getMap()).map(key => {
    if (!productIdsList.includes(key)) {
      productMap.deleteProduct(key)
    }
  })

  const mapToDisplay = productMap.getMap()

  const productsList = productIdsList?.filter(key => mapToDisplay[key]).map((key) => (mapToDisplay[key]))

  // console.log('PRODUCTS LIST ', productsList)

  // console.log('PRODUCT IDS ', productIdsList)

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
