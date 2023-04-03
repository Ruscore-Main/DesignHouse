import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchValue: "",
  isPublished: null,
  currentPage: 1,
};

const adminFilterSlice = createSlice({
  name: "adminFilter",
  initialState,
  reducers: {
    setAdminSearchValue(state, action) {
      state.currentPage = 1;
      state.searchValue = action.payload;
    },
    setAdminCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setIsPublished(state, action) {
      state.currentPage = 1;
      state.isPublished = action.payload;
    }
  },
});

export const { setAdminSearchValue, setAdminCurrentPage, setIsPublished } = adminFilterSlice.actions;

export default adminFilterSlice.reducer;
