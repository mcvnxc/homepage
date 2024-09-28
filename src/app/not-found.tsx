"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button, Preloader } from "./components/ui/ui";
import { HomeIcon } from "./components/icons";
import Link from "next/link";

export default function NotFound() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
			setIsOpen(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);
	return (
		<main className="flex justify-center text-center items-center h-screen">
			<motion.div
				initial={{
					borderRadius: 30,
				}}
				animate={{
					width: isOpen ? 350 : 100,
					height: isOpen ? 250 : 100,
					borderRadius: isOpen ? 40 : 40,
				}}
				transition={{
					type: "spring",
					stiffness: 100,
					damping: 20,
				}}
				className="flex justify-center backdrop-blur-2xl bg-white/1 p-16"
			>
				{isLoading ? (
					<Preloader />
				) : (
					<motion.div
						layout
						initial={{
							scale: 0.9,
							opacity: 0,
							filter: "blur(30px)",
						}}
						animate={{
							scale: 1,
							opacity: 1,
							filter: "blur(0px)",
						}}
						exit={{ opacity: 0 }}
						transition={{
							type: "ease-in-out",
							duration: 0.3,
							delay: 0.2,
						}}
					>
						<h1 className="text-[--text] mb-4 text-nowrap text-3xl font-medium mt-2">
							404 Not Found
						</h1>
						<Link href="/">
							<Button
								label="Return to home"
								icon={<HomeIcon />}
							/>
						</Link>
					</motion.div>
				)}
			</motion.div>
		</main>
	);
}
