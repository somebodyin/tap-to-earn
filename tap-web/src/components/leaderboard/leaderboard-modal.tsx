import React from "react";
import Modal from "../modal";
import { useGetLeaderboardQuery } from "../../store/api/endpoints";

export default function LeaderboardModal({
	isOpen,
	closeModal,
}: {
	isOpen: boolean;
	closeModal: () => void;
}) {
	const { data: usersList = [] } = useGetLeaderboardQuery();
	const renderContent = () => {
		if (isOpen) {
			return (
				<div className="h-full overflow-y-auto overscroll-contain">
					<table className="w-full text-left border-separate border-spacing-y-2 h-full overflow-y-scroll">
						<thead>
							<tr className="text-white/70">
								<th className="p-2">Rank</th>
								<th className="p-2">Username</th>
								<th className="p-2">Earned</th>
								<th className="p-2">Energy</th>
								<th className="p-2">Multiplier</th>
							</tr>
						</thead>
						<tbody>
							{usersList.map((user, index) => {
								const rowBg =
									index % 2 === 0
										? "bg-[#242424]"
										: "bg-[#1f1f1f]";
								return (
									<tr key={user.id}>
										<td
											className={`p-2 ${rowBg} first:rounded-l-lg last:rounded-r-lg`}
										>
											{index + 1}
										</td>
										<td
											className={`p-2 ${rowBg} first:rounded-l-lg last:rounded-r-lg`}
										>
											{user.username}
										</td>
										<td
											className={`p-2 ${rowBg} first:rounded-l-lg last:rounded-r-lg`}
										>
											{user.earned}
										</td>
										<td
											className={`p-2 ${rowBg} first:rounded-l-lg last:rounded-r-lg`}
										>
											{user.energy}
										</td>
										<td
											className={`p-2 ${rowBg} first:rounded-l-lg last:rounded-r-lg`}
										>
											x{user.multiplier}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			);
		}

		return null;
	};

	return (
		<Modal title={`Leaderboard`} isOpen={isOpen} onClose={closeModal}>
			{renderContent()}
		</Modal>
	);
}
