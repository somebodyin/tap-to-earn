"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "../../store/api/endpoints";

export default function page() {
	const [login, { isLoading }] = useLoginUserMutation();
	const [u, setU] = useState("");
	const [err, setErr] = useState("");
	const r = useRouter();

	return (
		<main className="max-w-[420px]">
			<h1 className="text-[18px] text-center mb-4">Login</h1>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					try {
						await login(u).unwrap();
						r.push("/");
					} catch (e) {
						const getErrorMessage = (error: unknown): string => {
							if (typeof error === "string") return error;
							if (error instanceof Error) return error.message;
							if (
								typeof error === "object" &&
								error &&
								"message" in error &&
								typeof (error as any).message === "string"
							) {
								return (error as any).message;
							}
							return "An unknown error occurred.";
						};
						setErr(getErrorMessage(e));
					}
				}}
				className="my-2 w-full flex flex-col gap-2"
			>
				<input
					value={u}
					onChange={(e) => setU(e.target.value)}
					placeholder="username"
					className="p-2 w-full border border-solid border-black/[.08] dark:border-white/[.145] rounded bg-transparent outline-none focus:border-black/[.3] dark:focus:border-white/[.3] transition-colors"
				/>
				<button
					className="mt-5 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto cursor-pointer disabled:cursor-not-allowed disabled:bg-black/[.08] dark:disabled:bg-white/[.145] disabled:text-black/[.3] dark:disabled:text-white/[.3]"
					disabled={isLoading || u.trim().length === 0}
				>
					{isLoading && (
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
					Sign in
				</button>
			</form>
			{err && <p className="text-amber-400">{err}</p>}
		</main>
	);
}
