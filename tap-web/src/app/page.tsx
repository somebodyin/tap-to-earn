"use client";

import React, { useEffect, useState } from "react";
import { me, mine, toggleBoost, type Me } from "../lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
	const [m, setM] = useState<Me | null>(null);
	const load = async () => setM(await me());
	const r = useRouter();

	useEffect(() => {
		load().catch(() => {
			r.replace("/login");
		});
	}, []);

	if (!m)
		return (
			<main className="h-dvh flex justify-center items-center">
				Loading...
			</main>
		);

	return (
		<div className="font-sans flex  items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<div>
					Hello,{" "}
					<code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
						{m.username}
					</code>
				</div>
				<p>
					Energy: {m.energy} • Earned: {m.earned} • x{m.multiplier}
				</p>
				<div className="flex gap-4 items-center flex-col sm:flex-row">
					<button
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto cursor-pointer"
						onClick={async () => setM(await mine())}
					>
						Start mining
					</button>
					<button
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
						onClick={async () => setM(await toggleBoost())}
					>
						{m.multiplier === 1 ? "Enable Boost" : "Disable Boost"}
					</button>
				</div>
			</main>
		</div>
	);
}
