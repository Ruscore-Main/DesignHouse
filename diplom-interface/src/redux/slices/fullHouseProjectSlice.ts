import { HouseProject } from './houseProjectSlice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { houseProjectsAPI } from '../../api/api';

export interface FullHouseProjectSliceState {
    data: HouseProject | null,
    status: "loading" | "success" | "error"
}

export const fetchFullHouseProject = createAsyncThunk<HouseProject, number>('fullHouseProject/fetchFullHouseProject', async (id) => {
    const data = await houseProjectsAPI.getFullProject(id);
    return data;
}) 


const initialState: FullHouseProjectSliceState = {
    data: null,
    status: 'loading' // loading | success | error
}

let fullHouseProjectSlice = createSlice({
    name: 'fullHouseProject',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchFullHouseProject.pending, (state: FullHouseProjectSliceState) => {
            state.status = 'loading';
            state.data = null;
        });
        builder.addCase(fetchFullHouseProject.fulfilled, (state, action) => {
            state.status = 'success';
            state.data = action.payload;
        });
        builder.addCase(fetchFullHouseProject.pending, (state) => {
            state.status = 'error';
            state.data = null;
        });
    }
});

export default fullHouseProjectSlice.reducer;