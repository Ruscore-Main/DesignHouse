import { PayloadAction } from '@reduxjs/toolkit';
import { SortItem } from './../../components/SortPopup';
import { createSlice } from '@reduxjs/toolkit';

export interface FilterSliceState {
  searchValue: string,
  category: string | null,
  currentPage: number,
  sortType: SortItem,
  role: string | null
}

const initialState: FilterSliceState = {
  searchValue: '',
  category: null,
  currentPage: 1,
  sortType: { name: 'Названию (ASC)', sort: 'name' },
  role: null
};

let filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchValue(state, action: PayloadAction<string>) {
      state.currentPage = 1;
      state.searchValue = action.payload;
    },
    setCategory(state, action: PayloadAction<string | null>) {
      state.currentPage = 1;
      state.category = action.payload;
    },
    setSortType(state, action: PayloadAction<SortItem>) {
      state.sortType = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setRole(state, action: PayloadAction<string>) {
      state.currentPage = 1;
      state.role = action.payload;
    },
    resetFilters(state) {
      state.searchValue = "";
      state.category = null;
      state.currentPage = 1;
      state.role = null;
    }
  },
});

export const { setSearchValue, setCategory, setSortType, setCurrentPage, setRole, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;
