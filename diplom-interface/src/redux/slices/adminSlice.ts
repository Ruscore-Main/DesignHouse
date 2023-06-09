import { User, Request } from './userSlice';
import { HouseProject, Status } from './houseProjectSlice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { adminAPI, houseProjectsAPI } from '../../api/api';

// types
export interface AdminSliceState {
  projects: HouseProject[];
  users: User[];
  requests: Request[];
  status: Status;
  amountPages: number;
}

type FetchAdminProjectsArgs = {
  currentPage: number;
  searchValue: string;
  isPublished: string | null;
};

type FetchUsersArgs = {
  searchValue: string;
  role: string | null;
  page: number;
};

type FetchRequestsArgs = {
  searchValue: string;
  category: string | null;
  page: number;
};

// AsyncActions
export const fetchAdminProjects = createAsyncThunk<
  { items: HouseProject[]; amountPages: number },
  FetchAdminProjectsArgs
>
('admin/fetchAdminProjects', async (params) => {
  const { currentPage, searchValue, isPublished } = params;
  const data = await houseProjectsAPI.getProjects(
    currentPage,
    { name: '', sort: 'name' },
    null,
    searchValue,
    isPublished,
    10,
  );
  return data;
});

export const fetchRequests = createAsyncThunk<
  { items: Request[]; amountPages: number },
  FetchRequestsArgs
>('admin/fetchRequests', async (params) => {
  const data = await adminAPI.getRequests({ limit: '10', ...params, page: params.page.toString() });
  return data;
});

export const deleteRequest = createAsyncThunk<Request, Request>(
  'admin/deleteRequest',
  async (params) => {
    const data = await adminAPI.deleteRequest(params);
    return data;
  },
);

export const fetchUsers = createAsyncThunk<{ items: User[]; amountPages: number }, FetchUsersArgs>(
  'admin/fetchUsers',
  async (params) => {
    const data = await adminAPI.getUsers({ limit: '10', ...params, page: params.page.toString() });
    return data;
  },
);

export const deleteUser = createAsyncThunk<User, User>('admin/deleteUser', async (params) => {
  const data = await adminAPI.deleteUser(params);
  return data;
});

// State
const initialState: AdminSliceState = {
  projects: [],
  users: [],
  requests: [],
  status: Status.loading,
  amountPages: 0,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAdminProjects.pending, (state) => {
      state.projects = [];
      state.status = Status.loading;
    });
    builder.addCase(fetchAdminProjects.fulfilled, (state, action) => {
      state.projects = action.payload.items;
      state.amountPages = action.payload.amountPages;
      state.status = Status.success;
    });
    builder.addCase(fetchAdminProjects.rejected, (state) => {
      state.projects = [];
      state.status = Status.error;
    });

    builder.addCase(fetchRequests.pending, (state) => {
      state.requests = [];
      state.status = Status.loading;
    });
    builder.addCase(fetchRequests.fulfilled, (state, action) => {
      state.requests = action.payload.items;
      state.amountPages = action.payload.amountPages;
      state.status = Status.success;
    });
    builder.addCase(fetchRequests.rejected, (state) => {
      state.requests = [];
      state.status = Status.error;
    });

    builder.addCase(fetchUsers.pending, (state) => {
      state.users = [];
      state.status = Status.loading;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload.items;
      state.amountPages = action.payload.amountPages;
      state.status = Status.success;
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.users = [];
      state.status = Status.error;
    });
  },
});

export default adminSlice.reducer;
