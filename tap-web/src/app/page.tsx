"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	useGetMeQuery,
	useMineMutation,
	useToggleBoostMutation,
} from "../store/api/endpoints";
import { MdLeaderboard } from "react-icons/md";

export default function Home() {
	const { data: me, isLoading } = useGetMeQuery();
	const [mine, { isLoading: isMining }] = useMineMutation();
	const [toggleBoost, { isLoading: isTogglingBoost }] =
		useToggleBoostMutation();
	const r = useRouter();

	useEffect(() => {
		if (!isLoading && !me) r.replace("/login");
	}, [me, isLoading]);

	if (!me)
		return (
			<main className="h-dvh flex justify-center items-center">
				Loading...
			</main>
		);

	return (
		<div className="flex w-[500px] h-fit items-center justify-center p-8 sm:p-20 ">
			<main className="flex flex-col gap-8 items-center sm:items-start">
				<div className="flex gap-4 items-center justify-between w-full">
					<div>
						Hello,{" "}
						<code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
							{me.username}
						</code>
					</div>
					<button className="cursor-pointer text-xl">
						<MdLeaderboard />
					</button>
				</div>
				<p>
					Energy: {me.energy} • Earned: {me.earned} • x{me.multiplier}
				</p>
				<div className="flex gap-4 items-center flex-col sm:flex-row">
					<button
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto cursor-pointer disabled:cursor-not-allowed disabled:bg-black/[.08] dark:disabled:bg-white/[.145] disabled:text-black/[.3] dark:disabled:text-white/[.3]"
						onClick={async () => {
							await mine().unwrap();
						}}
						disabled={
							me.energy === 0 || isMining || isTogglingBoost
						}
					>
						{me.energy === 0 ? "No Energy" : "Start mining"}
					</button>
					<button
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[180px] cursor-pointer disabled:cursor-not-allowed disabled:bg-black/[.08] dark:disabled:bg-white/[.145] disabled:text-black/[.3] dark:disabled:text-white/[.3]"
						onClick={async () => {
							await toggleBoost().unwrap();
						}}
						disabled={isTogglingBoost}
					>
						{isTogglingBoost && (
							<svg
								className="mr-2 h-5 w-5 animate-spin text-white motion-reduce:hidden"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						)}
						{me.multiplier === 1 ? "Enable Boost" : "Disable Boost"}
					</button>
				</div>
			</main>
		</div>
	);
}
