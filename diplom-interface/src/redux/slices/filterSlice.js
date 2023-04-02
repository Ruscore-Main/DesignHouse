import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchValue: '',
  category: null,
  currentPage: 1,
  sortType: { name: 'Названию (ASC)', sort: 'name', order: 'asc' },
};

let filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setSortType(state, action) {
      state.sortType = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    resetFilters(state) {
      state.searchValue = "";
      state.category = null;
      state.currentPage = 1;
    }
  },
});

export const { setSearchValue, setCategory, setSortType, setCurrentPage, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;
