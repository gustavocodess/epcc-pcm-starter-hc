import { useState } from "react";

export function useProductGrid() {
  const [productsMap, setProductsMap] = useState({} as Record<string, moltin.CartItem>);

  function addProduct(product: moltin.CartItem, productId: string) {
    setProductsMap((currentMap) => {
      return {
        ...currentMap,
        [productId]: {...product}
      }
    })
    return productsMap
  }

  function deleteProduct(productId: string) {
    const newMap = productsMap
    delete newMap[productId]

    setProductsMap(newMap)
    return productsMap
  }

  return {
    getMap: () => productsMap,
    add: (product: moltin.CartItem, productId: string) => addProduct(product, productId),
    deleteProduct: (productId: string) => deleteProduct(productId),
  };
}

export default useProductGrid;
