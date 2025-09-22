import {
	BaseQueryApi,
	createApi,
	FetchArgs,
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout } from "./user-slice";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
	// mode: "no-cors",
	credentials: "include",
});

const baseQueryWithAuthHandling = async (
	args: string | FetchArgs,
	api: BaseQueryApi,
	extraOptions: {}
) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		api.dispatch(logout());
	}

	return result;
};

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: baseQueryWithAuthHandling,
	keepUnusedDataFor: 10,
	tagTypes: ["User"],
	endpoints: (builder) => ({}),
});

export default apiSlice;
