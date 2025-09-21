import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "./page";
import React from "react";

global.fetch = vi.fn().mockImplementation((url: string, opts?: any) => {
	if (url.endsWith("/me"))
		return Promise.resolve(
			new Response(
				JSON.stringify({
					id: "1",
					username: "test",
					energy: 5,
					multiplier: 1,
					earned: 0,
				})
			)
		);
	if (url.endsWith("/mine"))
		return Promise.resolve(
			new Response(
				JSON.stringify({
					id: "1",
					username: "test",
					energy: 4,
					multiplier: 1,
					earned: 1,
				})
			)
		);
	if (url.endsWith("/boost/toggle"))
		return Promise.resolve(
			new Response(
				JSON.stringify({
					id: "1",
					username: "test",
					energy: 4,
					multiplier: 16,
					earned: 1,
				})
			)
		);
	return Promise.reject(new Error("unknown"));
}) as any;

it("renders Start mining", async () => {
	render(<Page />);
	expect(await screen.findByText(/Hello/)).toBeInTheDocument();
	const btn = await screen.findByText(/Start mining/);
	await fireEvent.click(btn);
	expect(await screen.findByText(/Earned: 1/)).toBeInTheDocument();
});
