import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminAPI, houseProjectsAPI } from "api/api";

export const fetchAdminProjects = createAsyncThunk(
  "admin/fetchAdminProjects",
  async (params) => {
    const { currentPage, searchValue, isPublished } = params;
    const data = await houseProjectsAPI.getProjects(
      currentPage,
      "name",
      null,
      searchValue,
      isPublished,
      10
    );
    return data;
  }
);

export const fetchRequests = createAsyncThunk(
  "admin/fetchRequests",
  async (params) => {
    // params === { searchValue, category, currentPage };
    const data = await adminAPI.getRequests({limit: 10, ...params});
    return data;
  }
);

export const deleteRequest = createAsyncThunk(
  "admin/deleteRequest",
  async (params) => {
    const data = await adminAPI.deleteRequest(params);
    return data;
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params) => {
    // params === { searchValue, role, currentPage };
    const data = await adminAPI.getUsers({limit: 10, ...params});
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (params) => {
    const data = await adminAPI.deleteUser(params);
    return data;
  }
);

const initialState = {
  projects: [],
  users: [],
  requests: [],
  status: "loading",
  amountPages: 0,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchAdminProjects.pending]: (state) => {
      state.projects = [];
      state.status = "loading";
    },
    [fetchAdminProjects.fulfilled]: (state, action) => {
      state.projects = action.payload.items;
      state.amountPages = action.payload.amountPages;
      state.status = "success";
    },
    [fetchAdminProjects.rejected]: (state) => {
      state.projects = [];
      state.status = "error";
    },

    [fetchRequests.pending]: (state) => {
      state.requests = [];
      state.status = "loading";
    },
    [fetchRequests.fulfilled]: (state, action) => {
      state.requests = action.payload.items;
      state.amountPages = action.payload.amountPages;
      state.status = "success";
    },
    [fetchRequests.rejected]: (state) => {
      state.requests = [];
      state.status = "error";
    },

    [fetchUsers.pending]: (state) => {
      state.users = [];
      state.status = "loading";
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.users = action.payload.items;
      state.amountPages = action.payload.amountPages;
      state.status = "success";
    },
    [fetchUsers.rejected]: (state) => {
      state.users = [];
      state.status = "error";
    },
  },
});

export default adminSlice.reducer;
