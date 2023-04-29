import { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { houseProjectsAPI } from '../../api/api';

export type HouseProject = {
  id: number,
  name: string,
  description: string,
  area: number,
  price: number,
  datePublication: Date,
  amountFloors: number,
  isPublished: boolean,
  images: string[],
  userId: number | null
}

export interface HouseProjectSliceState {
  items: HouseProject[],
  amountPages: number,
  status: "loading" | "success" | "error"
}

export const fetchProjects = createAsyncThunk('houseProjects/houseProject', async (params) => {
  const { currentPage, sortType, category, searchValue, isPublished } = params;
  const data = await houseProjectsAPI.getProjects(currentPage, sortType, category, searchValue, isPublished, 6);
  return data;
});

export const addProject = createAsyncThunk('houseProjects/addProject', async (params) => {
  try {
    const houseProject = await houseProjectsAPI.addProject(params);
    return houseProject;
  } catch (error) {
    return error.response.data;
  }
});

export const updateProject = createAsyncThunk('houseProjects/updateProject', async (params) => {
  try {
    // params {id: houseId, data: houseProject}
    const houseProject = await houseProjectsAPI.updateProject(params);
    return houseProject;
  } catch (error) {
    return error.response.data;
  }
});

export const deleteProject = createAsyncThunk('houseProjects/deleteProject', async (params) => {
  try {
    const houseProject = await houseProjectsAPI.deleteProject(params);
    return houseProject;
  } catch (error) {
    return error.response.data;
  }
});

const initialState: HouseProjectSliceState = {
  items: [],
  amountPages: 0,
  status: 'loading', // loading | success | error
};

let houseProjectSlice = createSlice({
  name: 'houseProject',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<HouseProject[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: {
    [fetchProjects.pending]: (state) => {
      state.items = [];
      state.status = 'loading';
    },
    [fetchProjects.fulfilled]: (state, action) => {
      state.items = action.payload.items;
      state.amountPages = action.payload.amountPages;
      state.status = 'success';
    },
    [fetchProjects.pending]: (state) => {
      state.items = [];
      state.status = 'error';
    },

    [addProject.fulfilled]: (state, action) => {
      if (action.payload?.isPublished) {
        state.items = [...state.items, action.payload];
      }
    },

    [updateProject.fulfilled]: (state, action) => {
      if (action.payload?.isPublished) {
        state.items = [...state.items.filter(el => el.id !== action.payload.id), action.payload];
      }
    },
  },
});

export const { setItems } = houseProjectSlice.actions;

export default houseProjectSlice.reducer;
