import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { houseProjectsAPI } from "api/api";

export const fetchAdminProjects = createAsyncThunk('admin/fetchAdminProjects', async (params) => {
  const { currentPage, searchValue, isPublished } = params;
  const data = await houseProjectsAPI.getProjects(currentPage, 'name', null, searchValue, isPublished, 10);
  return data;
});


const initialState = {
  projects: [],
  users: [],
  requests: [],
  status: 'loading',
  amountPages: 0
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    
  },
  extraReducers: {
    [fetchAdminProjects.pending]: (state) => {
      state.projects = [];
      state.status = 'loading';
    },
    [fetchAdminProjects.fulfilled]: (state, action) => {
      state.projects = action.payload.items;
      state.amountPages = action.payload.amountPages;
      state.status = 'success';
    },
    [fetchAdminProjects.pending]: (state) => {
      state.projects = [];
      state.status = 'error';
    },
  }
});


export default adminSlice.reducer;
