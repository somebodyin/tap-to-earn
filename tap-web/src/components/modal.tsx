"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";

interface ModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
	return (
		<>
			{/* Backdrop */}
			<motion.div
				className="fixed inset-0 z-40 bg-black/50"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			/>
			{/* Modal Card */}
			<motion.div
				className="fixed inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#161616] rounded-xl shadow-lg w-[calc(100%-32px)]  sm:w-[600px]  h-[400px] pt-4 px-6 pb-16"
				initial={{ opacity: 0, scale: 0.75 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.75 }}
				style={{ transition: "all 0.3s" }}
				transition={{ duration: 0, ease: "easeInOut" }}
			>
				<div className="flex items-center mb-2 relative">
					<h2 className="text-xl mx-auto font-medium text-center">
						{title}
					</h2>
					<button
						className="absolute top-0 right-0 text-[#3d3d3d] hover:text-[#6e6e6e] transition-colors cursor-pointer"
						onClick={onClose}
					>
						<IoIosClose className="w-8 h-8" />
					</button>
				</div>
				<div className="h-full">{children}</div>
			</motion.div>
		</>
	);
};

export default Modal;
