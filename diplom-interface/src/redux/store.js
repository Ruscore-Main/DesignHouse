import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
    reducer: {

    }
});

store.subscribe(() => {
    console.log(store.getState());
})