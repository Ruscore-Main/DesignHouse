import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./slices/filterSlice";
import fullHouseProjectSlice from "./slices/fullHouseProjectSlice";
import houseProjectSlice from "./slices/houseProjectSlice";
import userSlice from "./slices/userSlice";
import adminFilterSlice from "./slices/adminFilterSlice";
import adminSlice from "./slices/adminSlice";
import { useDispatch } from "react-redux";


export const store = configureStore({
    reducer: {
        houseProjects: houseProjectSlice,
        filter: filterSlice,
        fullHouseProject: fullHouseProjectSlice,
        user: userSlice,
        admin: adminSlice,
        adminFilter: adminFilterSlice
    }
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

store.subscribe(() => {
    console.log(store.getState());
})