"use client";
import React, { useState } from "react";
import { login } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function page() {
	const [u, setU] = useState("");
	const [err, setErr] = useState("");
	const r = useRouter();

	return (
		<main className="max-w-[420px] m-24 font-serif border border-gray-400 rounded-md p-4">
			<h1 className="text-[18px]">Login</h1>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					try {
						await login(u);
						r.push("/");
					} catch (e: any) {
						setErr(e.message);
					}
				}}
				className="my-2"
			>
				<input
					value={u}
					onChange={(e) => setU(e.target.value)}
					placeholder="username"
					className="p-2 w-full"
				/>
				<button className="mt-3 p-2 w-full bg-neutral-600 hover:bg-neutral-500 cursor-pointer transition-colors rounded-md">
					Sign in
				</button>
			</form>
			{err && <p className="text-amber-400">{err}</p>}
		</main>
	);
}
