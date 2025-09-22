import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "@/lib/types";

const initialState: UserState = {};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			const data = action.payload;

			return {
				...state,
				...data,
			};
		},
		logout: (state) => {
			state = initialState;
		},
	},
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
