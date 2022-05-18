import {
  getTopNavigater,
  getTopNavigaterNode,
  getTopNavigaterNodeItem,
} from "src/modules/Home/EPComponentService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Component {
  id: string;
  data: any;
  children?: Array<Component>;
}

interface HomePageState {
  topNavigator: {
    current: string;
    currentNode: string;
    currentSubNode: string;
    children: Array<Component>;
    loading: boolean;
    dropdown: any;
    megaDropdown: any;
    loadingLeaf: boolean;
    listLeaf: any;
  };
}

const initialState: HomePageState = {
  topNavigator: {
    current: "",
    currentNode: "",
    currentSubNode: "",
    children: [],
    loading: false,
    dropdown: [],
    megaDropdown: [],
    loadingLeaf: false,
    listLeaf: [],
  },
};

export const fetchTopNavigator = createAsyncThunk(
  "homePage/fecthTopNavigator",
  async (_, thunkAPI) => {
    const response = await getTopNavigater();
    return response;
  }
);

export const fetchTopNavigatorNode = createAsyncThunk(
  "homePage/fecthTopNavigatorNode",
  async (hierarchyId: string, thunkAPI) => {
    const response = await getTopNavigaterNode(hierarchyId);
    return { value: response, hierarchyId };
  }
);

export const fetchTopNavigatorNodeItem = createAsyncThunk(
  "homePage/fecthTopNavigatorNodeItem",
  async (nodeId: string, thunkAPI) => {
    const response = await getTopNavigaterNodeItem(nodeId);
    return { value: response, nodeId };
  }
);

export const fetchTopNavigatorLeafItem = createAsyncThunk(
  "homePage/fecthTopNavigatorLeafItem",
  async (nodeId: string, thunkAPI) => {
    const response = await getTopNavigaterNodeItem(nodeId);
    return { value: response, nodeId };
  }
);

export const topNavigatorSlice = createSlice({
  name: "homePage/navigator",
  initialState,
  reducers: {
    changeCurrent: (state, action) => {
      state.topNavigator.current = action.payload;
    },
    changeCurrentNode: (state, action) => {
      state.topNavigator.currentNode = action.payload;
    },
    changeCurrentSubNode: (state, action) => {
      state.topNavigator.currentSubNode = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchTopNavigator.pending, (state, action) => {
        state.topNavigator.loading = true;
      })
      .addCase(fetchTopNavigator.fulfilled, (state, action: any) => {
        // Add user to the state array
        state.topNavigator.loading = false;

        if (action?.payload?.data && Array.isArray(action.payload.data)) {
          action.payload.data.forEach((item: any, index: number) => {
            const itemComponent: Component = {
              id: item.id,
              data: item,
            };
            state.topNavigator.children.push(itemComponent);
          });
        }
      })
      .addCase(fetchTopNavigatorNode.pending, (state, action) => {
        state.topNavigator.loading = true;
      })
      .addCase(fetchTopNavigatorNode.fulfilled, (state, action) => {
        state.topNavigator.loading = false;
        const itemDropdown = {
          hierarchyId: action.payload.hierarchyId,
          value: action.payload.value,
        };
        if (
          !state.topNavigator.dropdown.find(
            (item: any) => item.hierarchyId === itemDropdown.hierarchyId
          )
        )
          state.topNavigator.dropdown.push(itemDropdown);
      })
      .addCase(fetchTopNavigatorNodeItem.pending, (state, action) => {
        state.topNavigator.loading = true;
      })
      .addCase(fetchTopNavigatorNodeItem.fulfilled, (state, action) => {
        state.topNavigator.loading = false;
        const nodeItem = {
          nodeId: action.payload.nodeId,
          value: action.payload.value,
        };
        if (
          !state.topNavigator.megaDropdown.find(
            (item: any) => item.nodeId === nodeItem.nodeId
          )
        )
          state.topNavigator.megaDropdown.push(nodeItem);
      })
      .addCase(fetchTopNavigatorLeafItem.pending, (state, action) => {
        state.topNavigator.loading = true;
      })
      .addCase(fetchTopNavigatorLeafItem.fulfilled, (state, action) => {
        state.topNavigator.loading = false;
        const leafItem = {
          nodeId: action.payload.nodeId,
          value: action.payload.value,
        };
        if (
          !state.topNavigator.listLeaf.find(
            (item: any) => item.nodeId === leafItem.nodeId
          )
        )
          state.topNavigator.listLeaf.push(leafItem);
      });
  },
});

export const { changeCurrent, changeCurrentNode, changeCurrentSubNode } =
  topNavigatorSlice.actions;

export default topNavigatorSlice.reducer;
