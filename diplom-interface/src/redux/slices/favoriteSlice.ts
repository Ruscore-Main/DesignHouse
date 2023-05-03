import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "api/api";
import { HouseProject, Status } from "./houseProjectSlice";

export interface FavoriteSliceState {
    items: HouseProject[],
    status: Status
}

const initialState: FavoriteSliceState = {
    items: [],
    status: Status.loading
};

// Получение избранных проектов
export const fetchFavorites = createAsyncThunk('favorite/fetchFavorites', async (userId: number) => {
    const data = await userAPI.getFavorites(userId);
    return data;
});

const favoriteSlice = createSlice({
    name: "favoriteSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchFavorites.pending, (state) => {
            state.items = [];
            state.status = Status.loading;
        });
        builder.addCase(fetchFavorites.fulfilled, (state, action) => {
            state.items = action.payload;
            state.status = Status.success;
        });
        builder.addCase(fetchFavorites.rejected, (state) => {
            state.items = [];
            state.status = Status.error;
        });
    }
});

export default favoriteSlice.reducer;