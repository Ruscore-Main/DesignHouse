import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { houseProjectsAPI } from '../../api/api';

export const fetchProjects = createAsyncThunk('houseProjects/houseProject', async (params) => {
  const { currentPage, sortType, category, searchValue } = params;
  const data = await houseProjectsAPI.getProjects(currentPage, sortType, category, searchValue);
  return data;
});

export const addProject = createAsyncThunk('houseProjects/addProject', async (params) => {
  debugger;
  try {
    const houseProject = await houseProjectsAPI.addProject(params);
    return houseProject;
  } catch (error) {
    return error.response.data;
  }
});

const initialState = {
  items: [],
  amountPages: 0,
  status: 'loading', // loading | success | error
};

let houseProjectSlice = createSlice({
  name: 'houseProject',
  initialState,
  reducers: {
    setItems(state, action) {
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
  },
});

export const { setItems } = houseProjectSlice.actions;

export default houseProjectSlice.reducer;
