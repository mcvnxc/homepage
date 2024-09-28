import React, { useEffect, useMemo, useRef, useState } from "react";
import { PauseIcon, PlayIcon, VolumeIcon } from "./icons";
import audioSrc from "@/../public/ Outdate.mp3";
import { Container, Slider } from "@/app/components/ui/ui";
import { BlurToClear, FadeIn } from "@/app/components/ui/animations";
import { AnimatePresence, motion } from "framer-motion";
import { parseBlob } from "music-metadata-browser";

export function Player() {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [previousVolume, setPreviousVolume] = useState(1);
	const [volume, setVolume] = useState(0.25);
	const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
	const [volumeIndicatorPosition, setVolumeIndicatorPosition] = useState(0);
	const [metadata, setMetadata] = useState<any>(null);
	const hideVolumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	useEffect(() => {
		const fetchMetadata = async () => {
			try {
				const response = await fetch(audioSrc);
				const blob = await response.blob();
				const metadata = await parseBlob(blob);
				setMetadata(metadata);
			} catch (error) {
				console.error("Error fetching metadata:", error);
			}
		};

		fetchMetadata();
	}, []);

	const handlePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
		}
	};

	const handleTimelineChange = (newTime: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	const handleVolumeChange = (newVolume: number) => {
		setVolume(newVolume);
		setShowVolumeIndicator(true);

		const sliderWidth = 100;
		const newPosition = newVolume * sliderWidth;
		setVolumeIndicatorPosition(newPosition);

		if (hideVolumeTimeoutRef.current) {
			clearTimeout(hideVolumeTimeoutRef.current);
		}

		hideVolumeTimeoutRef.current = setTimeout(() => {
			setShowVolumeIndicator(false);
		}, 1000);
	};

	const toggleMute = () => {
		if (volume > 0) {
			setPreviousVolume(volume);
			setVolume(0);
		} else {
			setVolume(previousVolume);
		}
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	const formattedTimes = useMemo(
		() => ({
			current: formatTime(currentTime),
			remaining: formatTime(duration - currentTime),
		}),
		[currentTime, duration]
	);

	useEffect(() => {
		const audio = audioRef.current;
		if (audio) {
			const updateDuration = () => setDuration(audio.duration);
			const handleEnded = () => setIsPlaying(false);

			audio.addEventListener("timeupdate", handleTimeUpdate);
			audio.addEventListener("loadedmetadata", updateDuration);
			audio.addEventListener("ended", handleEnded);

			return () => {
				audio.removeEventListener("timeupdate", handleTimeUpdate);
				audio.removeEventListener("loadedmetadata", updateDuration);
				audio.removeEventListener("ended", handleEnded);
			};
		}
	}, []);

	return (
		<div className="flex flex-col">
			<Container className="flex flex-col items-center justify-center w-[300px] rounded-[30px] px-6 py-6">
				<audio ref={audioRef} src={audioSrc} />
				<BlurToClear className="w-full">
					<div className="flex items-center">
						<div className="flex justify-center items-center text-white/30 w-20 h-20 rounded-[10px] bg-white/10 mr-4">
							{metadata?.common?.picture && (
								<img
									src={URL.createObjectURL(
										new Blob([
											metadata.common.picture[0].data,
										])
									)}
									alt="Album Cover"
									className="w-full h-full object-cover rounded-[10px]"
								/>
							)}
						</div>
						<div className="flex flex-col justify-center items-start">
							<span className="text-[--text]">
								{metadata?.common?.title || "Unknown Title"}
							</span>
							<span className="text-white/50">
								{metadata?.common?.artist || "Unknown Artist"}
							</span>
						</div>
						<div
							className="flex items-center justify-center hover:bg-white/10 w-10 h-10 rounded-lg transition-all ml-auto"
							onClick={handlePlayPause}
						>
							<FadeIn key={isPlaying ? "pause" : "play"}>
								{isPlaying ? <PauseIcon /> : <PlayIcon />}
							</FadeIn>
						</div>
					</div>

					<div className="flex flex-col justify-center mt-4">
						<Slider
							min={0}
							max={duration}
							value={currentTime}
							onChange={handleTimelineChange}
						/>
					</div>
					<div className="flex justify-between text-white/50 text-sm mt-2">
						<span>{formattedTimes.current}</span>
						<span>-{formattedTimes.remaining}</span>
					</div>
				</BlurToClear>
			</Container>
			<Container className="mt-4 w-[300px] rounded-[30px] px-6 py-4 flex items-center">
				<BlurToClear className="w-full flex items-center">
					<div
						className="flex items-center justify-center hover:bg-white/10 px-2 py-[6px] rounded-xl transition-all ml-auto"
						onClick={toggleMute}
					>
						<div className="mt-[3px]">
							<VolumeIcon volume={volume} />
						</div>
					</div>
					<div className="ml-4 w-full relative">
						<Slider
							min={0}
							max={1}
							value={volume}
							onChange={handleVolumeChange}
						/>
						<AnimatePresence>
							{showVolumeIndicator && (
								<motion.div
									className="absolute top-[-30px] text-white text-sm bg-[--bg] rounded-lg px-2 py-1"
									style={{
										left: `calc(${volumeIndicatorPosition}% - 10%)`,
									}}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
								>
									{Math.round(volume * 100)}%
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</BlurToClear>
			</Container>
		</div>
	);
}
