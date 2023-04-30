import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminFilterSliceState {
  searchValue: string,
  isPublished: string | null,
  currentPage: number,
}

const initialState: AdminFilterSliceState = {
  searchValue: "",
  isPublished: null,
  currentPage: 1,
};

const adminFilterSlice = createSlice({
  name: "adminFilter",
  initialState,
  reducers: {
    setAdminSearchValue(state, action: PayloadAction<string>) {
      state.currentPage = 1;
      state.searchValue = action.payload;
    },
    setAdminCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setIsPublished(state, action: PayloadAction<string>) {
      state.currentPage = 1;
      state.isPublished = action.payload;
    }
  },
});

export const { setAdminSearchValue, setAdminCurrentPage, setIsPublished } = adminFilterSlice.actions;

export default adminFilterSlice.reducer;
