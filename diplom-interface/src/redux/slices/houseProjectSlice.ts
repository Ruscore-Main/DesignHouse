import { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { houseProjectsAPI } from '../../api/api';
import { SortItem } from 'components/SortPopup';

export enum Status {
  loading = "loading",
  success = "success",
  error = "error"
}

export type HouseProject = {
  id: number,
  name: string,
  description: string,
  area: number,
  price: number,
  datePublication: Date,
  amountFloors: number,
  isPublished: string | boolean | null ,
  images: string[],
  userId: number | null | undefined
}

export interface HouseProjectSliceState {
  items: HouseProject[],
  amountPages: number,
  status: Status
}

export type FetchProjectsArgs = {
  currentPage: number,
  sortType: SortItem,
  category: string | null,
  searchValue: string,
  isPublished: string | null
}
export const fetchProjects = createAsyncThunk('houseProjects/fetchProjects', async (params: FetchProjectsArgs) => {
  const { currentPage, sortType, category, searchValue, isPublished } = params;
  const data = await houseProjectsAPI.getProjects(currentPage, sortType, category, searchValue, isPublished, 6);
  return data;
});

export const addProject = createAsyncThunk('houseProjects/addProject', async (params: FormData) => {
  try {
    const houseProject = await houseProjectsAPI.addProject(params);
    return houseProject;
  } catch (error: any) {
    return error.response.data;
  }
});

export const updateProject = createAsyncThunk('houseProjects/updateProject', async (params: FormData) => {
  try {
    const houseProject = await houseProjectsAPI.updateProject(params);
    return houseProject;
  } catch (error: any) {
    return error.response.data;
  }
});

export const deleteProject = createAsyncThunk('houseProjects/deleteProject', async (params: HouseProject) => {
  try {
    const houseProject = await houseProjectsAPI.deleteProject(params);
    return houseProject;
  } catch (error: any) {
    return error.response.data;
  }
});

const initialState: HouseProjectSliceState = {
  items: [],
  amountPages: 0,
  status: Status.loading, // loading | success | error
};

let houseProjectSlice = createSlice({
  name: 'houseProject',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<HouseProject[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.items = [];
      state.status = Status.loading;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.amountPages = action.payload.amountPages;
      state.status = Status.success;
    });
    builder.addCase(fetchProjects.rejected, (state) => {
      state.items = [];
      state.status = Status.error;
    });

    builder.addCase(addProject.fulfilled, (state, action) => {
      if (action.payload?.isPublished) {
        state.items = [...state.items, action.payload];
      }
    });
    builder.addCase(updateProject.fulfilled, (state, action) => {
      if (action.payload?.isPublished) {
        state.items = [...state.items.filter(el => el.id !== action.payload.id), action.payload];
      }
    });
  },

});

export const { setItems } = houseProjectSlice.actions;

export default houseProjectSlice.reducer;
