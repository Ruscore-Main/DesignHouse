import { HouseProject, Status } from './houseProjectSlice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { houseProjectsAPI } from '../../api/api';

export interface FullHouseProjectSliceState {
    data: HouseProject | null,
    status: Status
}

export const fetchFullHouseProject = createAsyncThunk<HouseProject, number>('fullHouseProject/fetchFullHouseProject', async (id) => {
    const data = await houseProjectsAPI.getFullProject(id);
    return data;
}) 


const initialState: FullHouseProjectSliceState = {
    data: null,
    status: Status.loading // loading | success | error
}

let fullHouseProjectSlice = createSlice({
    name: 'fullHouseProject',
    initialState,
    reducers: {
        resetHouse(state) {
            state.data = null;
            state.status = Status.loading;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFullHouseProject.pending, (state) => {
            state.status = Status.loading;
            state.data = null;
        });
        builder.addCase(fetchFullHouseProject.fulfilled, (state, action) => {
            state.status = Status.success;
            state.data = action.payload;
        });
        builder.addCase(fetchFullHouseProject.rejected, (state) => {
            state.status = Status.error;
            state.data = null;
        });
    }
});

export const {resetHouse} = fullHouseProjectSlice.actions;

export default fullHouseProjectSlice.reducer;