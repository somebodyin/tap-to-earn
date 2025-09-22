import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-slice";
import apiSlice from "./api-slice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});
