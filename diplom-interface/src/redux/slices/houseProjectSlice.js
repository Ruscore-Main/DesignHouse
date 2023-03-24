import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { houseProjectsAPI } from '../../api/api';

export const fetchProjects = createAsyncThunk('pizzas/houseProject', async (params) => {
  const { currentPage, sortType, category, searchValue } = params;
  const data = await houseProjectsAPI.getProjects(currentPage, sortType, category, searchValue);
  return data;
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
  },
});

export const { setItems } = houseProjectSlice.actions;

export default houseProjectSlice.reducer;
