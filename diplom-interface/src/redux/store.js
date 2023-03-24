import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./slices/filterSlice";
import fullHouseProjectSlice from "./slices/fullHouseProjectSlice";
import houseProjectSlice from "./slices/houseProjectSlice";


export const store = configureStore({
    reducer: {
        houseProjects: houseProjectSlice,
        filter: filterSlice,
        fullHouseProject: fullHouseProjectSlice
    }
});

store.subscribe(() => {
    console.log(store.getState());
})