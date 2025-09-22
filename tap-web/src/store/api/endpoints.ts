import { UserState } from "@/lib/types";
import apiSlice from "../api-slice";

export const endpoints = apiSlice.injectEndpoints({
	overrideExisting: true,
	endpoints: (builder) => ({
		loginUser: builder.mutation<UserState, any>({
			query: (username: string) => ({
				url: "/session/login",
				method: "POST",
				body: { username },
			}),
		}),
		getMe: builder.query<UserState, void>({
			query: () => ({
				url: "/me",
				method: "GET",
			}),
			providesTags: ["User"],
		}),
		mine: builder.mutation<UserState, void>({
			query: () => ({
				url: "/mine",
				method: "POST",
			}),
			invalidatesTags: ["User"],
		}),
		toggleBoost: builder.mutation<UserState, void>({
			query: () => ({
				url: "/boost/toggle",
				method: "POST",
			}),
			invalidatesTags: ["User"],
		}),
		getLeaderboard: builder.query<UserState[], any>({
			query: () => ({
				url: "/leaderboard",
				method: "GET",
			}),
			providesTags: ["User"],
		}),
	}),
});

export const {
	useLoginUserMutation,
	useGetMeQuery,
	useMineMutation,
	useToggleBoostMutation,
	useGetLeaderboardQuery,
} = endpoints;
