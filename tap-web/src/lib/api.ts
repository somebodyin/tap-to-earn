const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API}${path}`, {
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		...opts,
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json() as Promise<T>;
}

export type Me = {
	id: string;
	username: string;
	energy: number;
	multiplier: number;
	earned: number;
};

export const login = (username: string) =>
	api<Me>("/session/login", {
		method: "POST",
		body: JSON.stringify({ username }),
	});

export const me = () => api<Me>("/me");
export const mine = () => api<Me>("/mine", { method: "POST" });
export const toggleBoost = () => api<Me>("/boost/toggle", { method: "POST" });
export const leaderboard = () => api<Me[]>("/leaderboard");
