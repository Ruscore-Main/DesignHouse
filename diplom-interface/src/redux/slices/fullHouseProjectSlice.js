import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { houseProjectsAPI } from '../../api/api';

export const fetchFullHouseProject = createAsyncThunk('fullHouseProject/fetchFullHouseProject', async (id) => {
    const data = await houseProjectsAPI.getFullProject(id);
    return data;
}) 


const initialState = {
    data: null,
    status: 'loading' // loading | success | error
}

let fullHouseProjectSlice = createSlice({
    name: 'fullHouseProject',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchFullHouseProject.pending]: (state) => {
            state.status = 'loading';
            state.data = null;
        },
        [fetchFullHouseProject.fulfilled]: (state, action) => {
            state.status = 'success';
            state.data = action.payload;
        },
        [fetchFullHouseProject.pending]: (state) => {
            state.status = 'error';
            state.data = null;
        }
    }
});

export default fullHouseProjectSlice.reducer;