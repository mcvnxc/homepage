"use client";

import Image from "next/image";
import Link from "next/link";
import LogoImage from "../../public/logo.png";
import {
	DiscordIcon,
	SpotifyIcon,
	TelegramIcon,
	YouTubeIcon,
} from "./components/icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button, Preloader } from "./components/ui/ui";
import { Player } from "./components/player";
import { BlurToClear } from "@/app/components/ui/animations";

const socialLinks = [
	{
		href: "https://open.spotify.com/artist/2HhYxMJQRkeObZhiWGfQKr",
		icon: SpotifyIcon,
		label: "Spotify",
	},
	{
		href: "https://www.youtube.com/@espilxspotify",
		icon: YouTubeIcon,
		label: "Youtube",
	},
	{
		href: "t.me/espilx_mus",
		icon: TelegramIcon,
		label: "Telegram",
	},
	{
		href: "https://discord.gg/byYDJSzG3k",
		icon: DiscordIcon,
		label: "Discord",
	},
];

export default function Home() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 950);
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
			setIsOpen(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	return (
		<main
			className={`${
				isMobile ? "mt-10 pb-10" : "flex justify-center items-center"
			} h-screen w-screen`}
		>
			<div className="flex justify-center">
				<motion.div
					data-isopen={isOpen}
					initial={{ borderRadius: 30 }}
					animate={{
						width: isOpen ? 300 : 200,
						height: isOpen ? 630 : 250,
						borderRadius: isOpen ? 40 : 40,
					}}
					transition={{ type: "spring", stiffness: 100, damping: 20 }}
					className="flex justify-center text-center backdrop-blur-2xl bg-[--bg] p-20"
				>
					{isLoading ? (
						<Preloader />
					) : (
						<div>
							<BlurToClear>
								<div>
									<Image
										src={LogoImage}
										alt="Logo"
										className="rounded-full"
									/>
								</div>
								<h1 className="text-[--text] text-3xl font-medium mt-2">
									espilx
								</h1>
								<h3 className="text-[--text-secondary]">
									vip.spils@gmail.com
								</h3>
								<div className="grid gap-y-3 mt-6">
									{socialLinks.map(
										(
											{ href, icon: Icon, label },
											index
										) => (
											<Link
												key={index}
												href={href}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Button
													icon={<Icon />}
													label={label}
												/>
											</Link>
										)
									)}
								</div>
							</BlurToClear>
						</div>
					)}
				</motion.div>
			</div>

			<div>
				{!isLoading && (
					<motion.div
						key={isMobile ? "mobile" : "desktop"}
						initial={{ scale: 0.5 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0.5 }}
						transition={{ type: "easeInOut" }}
						className={`${
							isMobile
								? "flex mt-4 justify-center"
								: "absolute right-4 top-4"
						}`}
					>
						<Player />
					</motion.div>
				)}
			</div>
		</main>
	);
}
