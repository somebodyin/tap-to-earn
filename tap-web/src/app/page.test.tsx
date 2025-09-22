import { afterEach, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import Page from "./page";
import { apiSlice } from "../store/api-slice";
import { ReduxProvider } from "../context/redux-provider";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

function toUrlString(input: any): string {
	if (typeof input === "string") return input;
	if (input?.url) return input.url; // Request
	if (input instanceof URL) return input.toString();
	return "";
}

global.fetch = vi.fn().mockImplementation((input: any) => {
	const url = toUrlString(input);

	if (url.endsWith("/me")) {
		return Promise.resolve(
			new Response(
				JSON.stringify({
					id: "1",
					username: "test",
					energy: 5,
					multiplier: 1,
					earned: 0,
				}),
				{ status: 200 }
			)
		);
	}

	if (url.endsWith("/mine")) {
		return Promise.resolve(
			new Response(
				JSON.stringify({
					id: "1",
					username: "test",
					energy: 4,
					multiplier: 1,
					earned: 1,
				}),
				{ status: 200 }
			)
		);
	}

	if (url.endsWith("/boost/toggle")) {
		return Promise.resolve(
			new Response(
				JSON.stringify({
					id: "1",
					username: "test",
					energy: 4,
					multiplier: 16,
					earned: 1,
				}),
				{ status: 200 }
			)
		);
	}

	return Promise.reject(new Error(`unknown url: ${url}`));
}) as any;

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

it("renders and mines", async () => {
	render(
		<ReduxProvider>
			<Page />
		</ReduxProvider>
	);

	const startBtn = await screen.findByRole("button", {
		name: /start mining/i,
	});
	await fireEvent.click(startBtn);

	expect(await screen.findByText(/Earned:\s/i)).toBeInTheDocument();
});
