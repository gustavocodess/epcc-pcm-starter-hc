import { getComponent } from "src/modules/Home/EPComponentService";
import {
  getCatalogById,
  getNodeByCatalogId,
  getListOfNodeChildren,
  getProductsInCategory,
  getNodeBySlug,
  getNodeDetail,
  getPriceBook,
  getPriceById,
  getProductsInHeirarchy,
} from "./ProductListService";
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import type { RootState } from "src/store";
import { CATALOGID } from "src/config";

interface ProductListComponent {
  value: any;
  loading: boolean;
}

interface ProductListState {
  catalog: ProductListComponent;
  catalogNode: ProductListComponent;
  listNode: ProductListComponent;
  listProduct: ProductListComponent;
  categoryName: string;
  categoryTree: Array<string>;
  categoryChildren: Array<any>;
  categoryNameLoading: boolean;
  categoryChildrenLoading: boolean;
  brand: any;
  brandLoading: boolean;
  priceBook: any;
  priceBookLoading: boolean;
  breadcrumb: any;
  breadcrumbLoading: boolean;
  allProduct: any;
  allProductLoading: boolean | undefined;
}

const initialState: ProductListState = {
  catalog: {
    value: null,
    loading: false,
  },
  catalogNode: {
    value: null,
    loading: false,
  },
  listNode: {
    value: [],
    loading: false,
  },
  listProduct: {
    value: [],
    loading: false,
  },
  categoryName: "",
  categoryNameLoading: false,
  categoryTree: [],
  categoryChildren: [],
  categoryChildrenLoading: false,
  brand: null,
  brandLoading: false,
  priceBook: null,
  priceBookLoading: false,
  breadcrumb: null,
  breadcrumbLoading: false,
  allProduct: [],
  allProductLoading: undefined,
};

export const fetchCatalog = createAsyncThunk(
  "productList/category",
  async (categoryId: string, _thunkAPI) => {
    const response = await getCatalogById(categoryId);
    return response.data;
  }
);

export const fetchCatalogNode = createAsyncThunk(
  "productList/categoryNode",
  async (categoryId: string, _thunkAPI) => {
    const response = await getNodeByCatalogId(categoryId);
    return response.data;
  }
);

export const fetchNodeDetail = createAsyncThunk(
  "productList/nodeDetail",
  async (
    { catalogId = CATALOGID, nodeId }: { catalogId: string; nodeId: string },
    _thunkAPI
  ) => {
    const response = await getNodeDetail(nodeId);
    return response.data;
  }
);

export const fetchNodeDetailParent = createAsyncThunk(
  "productList/nodeDetailParent",
  async (
    { catalogId = CATALOGID, nodeId }: { catalogId: string; nodeId: string },
    _thunkAPI
  ) => {
    const response = await getNodeDetail(nodeId);
    return response.data;
  }
);

export const fetchAllBeadcrumb = createAsyncThunk(
  "productList/breadcrumb",
  async (node: any, _thunkAPI) => {
    let nodeTemp: any = node.payload;
    const parent = [node];
    while (nodeTemp?.relationships?.parent) {
      const result = await _thunkAPI.dispatch(
        fetchNodeDetailParent({
          catalogId: CATALOGID,
          nodeId: nodeTemp.relationships.parent.data.id,
        })
      );
      parent.unshift(result);
      nodeTemp = result.payload;
    }
    return parent;
  }
);

export const fetchAllProduct = createAsyncThunk(
  "productList/products",
  async (
    { catalogId = CATALOGID, nodeId }: { catalogId: string; nodeId: string },
    _thunkAPI
  ) => {
    const listProducts = [];
    const node = await _thunkAPI.dispatch(
      fetchListNodeChildren({ catalogId, nodeId: nodeId })
    );
    const product = await _thunkAPI.dispatch(
      fetchProductsInNode({ catalogId, nodeId: nodeId })
    );

    const productInHierarchy = await _thunkAPI.dispatch(
      fetchProductsInHierarchy({ catalogId, nodeId: nodeId })
    );

    listProducts.push(product.payload);
    listProducts.push(productInHierarchy.payload);
    if (node.payload.length > 0) {
      for (let i = 0; i < node.payload.length; i++) {
        const subNode = await _thunkAPI.dispatch(
          fetchListNodeChildren({
            catalogId,
            nodeId: node.payload[i]?.id,
          })
        );
        const product = await _thunkAPI.dispatch(
          fetchProductsInNode({
            catalogId,
            nodeId: node.payload[i]?.id,
          })
        );

        listProducts.push(product.payload);
        if (subNode.payload.length > 0) {
          for (let j = 0; j < subNode.payload.length; j++) {
            const subSubNode = await _thunkAPI.dispatch(
              fetchListNodeChildren({
                catalogId,
                nodeId: subNode.payload[i]?.id,
              })
            );
            const subProduct = await _thunkAPI.dispatch(
              fetchProductsInNode({
                catalogId,
                nodeId: subNode.payload[i]?.id,
              })
            );
            listProducts.push(subProduct.payload);
            if (subSubNode.payload.length > 0) {
              for (let k = 0; k < subSubNode.payload.length; k++) {
                const subSubProduct = await _thunkAPI.dispatch(
                  fetchProductsInNode({
                    catalogId,
                    nodeId: subSubNode.payload[i]?.id,
                  })
                );
                listProducts.push(subSubProduct.payload);
              }
            }
          }
        }
      }
    }
    return listProducts;
  }
);

export const fetchListNodeChildren = createAsyncThunk(
  "productList/listNode",
  async (
    { catalogId = CATALOGID, nodeId }: { catalogId: string; nodeId: string },
    _thunkAPI
  ) => {
    const responseNode = await getListOfNodeChildren(nodeId);
    return responseNode.data;
  }
);

export const fetchChildCategory = createAsyncThunk(
  "productList/childCategory",
  async (
    { catalogId, nodeId }: { catalogId: string; nodeId: string },
    _thunkAPI
  ) => {
    const responseNode = await getListOfNodeChildren(nodeId);
    return responseNode.data;
  }
);

export const fetchProductsInNode = createAsyncThunk(
  "productList/listProduct",
  async (
    { catalogId, nodeId }: { catalogId: string; nodeId: string },
    _thunkAPI
  ) => {
    const response = await getProductsInCategory(nodeId);
    return response;
  }
);
export const fetchProductsInHierarchy = createAsyncThunk(
  "productList/listProductHierarchy",
  async (
    { catalogId, nodeId }: { catalogId: string; nodeId: string },
    _thunkAPI
  ) => {
    const response = await getProductsInHeirarchy(nodeId);
    return response;
  }
);

export const fetchNodeBySlug = createAsyncThunk(
  "productList/nodeBySlug",
  async (slug: string, _thunkAPI) => {
    const response = await getNodeBySlug(slug);
    return response;
  }
);

export const fetchBrand = createAsyncThunk(
  "productList/brand",
  async (componentId: string, thunkAPI) => {
    const response = await getComponent(componentId);
    return response;
  }
);

export const fetchPriceBook = createAsyncThunk(
  "productList/priceBook",
  async (_thunkAPI) => {
    const response = await getPriceBook();
    return response.data;
  }
);

export const fetchPrice = createAsyncThunk(
  "productList/price",
  async (priceId: string, _thunkAPI) => {
    const response = await getPriceById(priceId);
    return response.data;
  }
);

export const fetchProductChildren = createAsyncThunk(
  "productList/children",
  async (productId: string, _thunkAPI) => {}
);

export const productListSlice = createSlice({
  name: "productList",
  initialState,
  reducers: {
    doneListProduct: (state, action) => {
      state.listProduct.loading = false;
    },
    clearAllProduct: (state) => {
      state.allProduct = [];
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ProductListState>) => {
    builder
      .addCase(fetchCatalog.pending, (state, _action: PayloadAction<any>) => {
        state.catalog.loading = true;
      })
      .addCase(fetchCatalog.fulfilled, (state, action: PayloadAction<any>) => {
        state.catalog.loading = false;
        state.catalog.value = action.payload;
      })
      .addCase(
        fetchCatalogNode.pending,
        (state, _action: PayloadAction<any>) => {
          state.catalogNode.loading = true;
        }
      )
      .addCase(
        fetchCatalogNode.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.catalogNode.loading = false;
          state.catalogNode.value = action.payload;
        }
      )
      .addCase(
        fetchListNodeChildren.pending,
        (state, _action: PayloadAction<any>) => {
          state.listNode.loading = true;
        }
      )
      .addCase(
        fetchListNodeChildren.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.listNode.loading = false;
          state.listNode.value.push(action.payload);
        }
      )
      .addCase(
        fetchChildCategory.pending,
        (state, _action: PayloadAction<any>) => {}
      )
      .addCase(
        fetchChildCategory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.categoryChildren = action.payload;
        }
      )
      .addCase(
        fetchProductsInNode.pending,
        (state, _action: PayloadAction<any>) => {
          state.listProduct.loading = true;
        }
      )
      .addCase(
        fetchProductsInNode.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.listProduct.loading = false;
        }
      )
      .addCase(
        fetchNodeBySlug.fulfilled,
        (state, action: PayloadAction<any>) => {}
      )
      .addCase(
        fetchNodeDetail.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.categoryName = action.payload.attributes.name;
        }
      )
      .addCase(fetchBrand.pending, (state, action: PayloadAction<any>) => {
        state.brandLoading = true;
      })
      .addCase(fetchBrand.fulfilled, (state, action: PayloadAction<any>) => {
        state.brandLoading = false;
        state.brand = action.payload.included;
      })
      .addCase(fetchPriceBook.pending, (state, action: PayloadAction<any>) => {
        state.priceBookLoading = true;
      })
      .addCase(
        fetchPriceBook.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.priceBookLoading = false;
          state.priceBook = action.payload;
        }
      )
      .addCase(
        fetchAllBeadcrumb.pending,
        (state, action: PayloadAction<any>) => {
          state.breadcrumbLoading = true;
        }
      )
      .addCase(
        fetchAllBeadcrumb.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.breadcrumbLoading = false;
          state.breadcrumb = action.payload;
        }
      )
      .addCase(fetchAllProduct.pending, (state, action: PayloadAction<any>) => {
        state.allProductLoading = true;
      })
      .addCase(
        fetchAllProduct.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allProductLoading = false;

          const { data, included } = action.payload[0];
          if (
            Array.isArray(data) &&
            data.length > 0 &&
            Array.isArray(included?.main_images)
          ) {
            const { main_images } = included;

            const newData = data.map((item: any, index: number) => {
              return {
                ...item,
                image: main_images[index]?.link?.href || "",
              };
            });
            state.allProduct = newData;
          } else {
            state.allProduct = [];
          }
        }
      );
  },
});

export const { doneListProduct, clearAllProduct } = productListSlice.actions;

export const selectProductList = (state: RootState) => state.productList;

export default productListSlice.reducer;
