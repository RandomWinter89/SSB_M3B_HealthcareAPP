import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/usersSlice";
import stuffsReducer from "./features/stuffsSlice";
import apptsReducer from "./features/apptsSlice";

const store = configureStore({
    reducer: {
        users: usersReducer,
        stuffsData: stuffsReducer,
        appointments: apptsReducer,
    },
});

export default store;
