import { UserState } from "@/lib/types";
import apiSlice from "../api-slice";

export const api = apiSlice.injectEndpoints({
	// overrideExisting: true,
	endpoints: (builder) => ({
		getMe: builder.query<UserState, void>({
			query: () => ({ url: "/me", method: "GET" }),
			providesTags: ["User"],
		}),

		login: builder.mutation<UserState, string>({
			query: (username) => ({
				url: "/session/login",
				method: "POST",
				body: { username },
			}),
			invalidatesTags: ["User"],
		}),

		logout: builder.mutation<{ ok: boolean }, void>({
			query: () => ({ url: "/session/logout", method: "POST" }),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
				} finally {
					dispatch(api.util.resetApiState());
				}
			},
		}),

		mine: builder.mutation<UserState, void>({
			query: () => ({ url: "/mine", method: "POST" }),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				const { data: updated } = await queryFulfilled;
				dispatch(
					api.util.updateQueryData("getMe", undefined, (draft) => {
						Object.assign(draft as UserState, updated);
					})
				);
			},
		}),

		toggleBoost: builder.mutation<UserState, void>({
			query: () => ({ url: "/boost/toggle", method: "POST" }),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				const { data: updated } = await queryFulfilled;
				dispatch(
					api.util.updateQueryData("getMe", undefined, (draft) => {
						Object.assign(draft as UserState, updated);
					})
				);
			},
		}),

		getLeaderboard: builder.query<UserState[], void>({
			query: () => ({ url: "/leaderboard", method: "GET" }),
			providesTags: ["User"],
		}),
	}),
});

export const {
	useLoginMutation,
	useGetMeQuery,
	useMineMutation,
	useToggleBoostMutation,
	useGetLeaderboardQuery,
	useLogoutMutation,
} = api;
