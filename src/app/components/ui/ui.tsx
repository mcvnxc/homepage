import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

//#region Container
interface ContainerProps {
	children?: React.ReactNode;
	className?: string;
}

export function Container({ children, className }: ContainerProps) {
	return (
		<div className={`backdrop-blur-2xl bg-[--bg] ${className || ""}`}>
			{children}
		</div>
	);
}
//#endregion

//#region Button
interface ButtonProps {
	label?: string;
	onClick?: () => void;
	icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, icon }) => {
	return (
		<button
			className="bg-[--btn-bg] flex items-center text-[--text] w-full px-4 mr-4 hover:bg-[--btn_hover] transition h-12 rounded-2xl"
			onClick={onClick}
		>
			{icon && <span>{icon}</span>}
			{label && <span className="ml-4 font-medium text-lg">{label}</span>}
		</button>
	);
};
//#endregion

//#region Slider
interface SliderProps {
	min: number;
	max: number;
	value: number;
	onChange: (value: number) => void;
}

export function Slider({ min, max, value, onChange }: SliderProps) {
	const [sliderValue, setSliderValue] = useState(value);
	const sliderRef = useRef<HTMLDivElement>(null);

	const calculateValue = (clientX: number) => {
		if (sliderRef.current) {
			const rect = sliderRef.current.getBoundingClientRect();
			const offsetX = clientX - rect.left;
			const newValue = Math.min(
				Math.max((offsetX / rect.width) * (max - min) + min, min),
				max
			);
			return newValue;
		}
		return sliderValue;
	};

	const handleMouseMove = (event: MouseEvent) => {
		const newValue = calculateValue(event.clientX);
		setSliderValue(newValue);
		onChange(newValue);
	};

	const handleMouseDown = (event: React.MouseEvent) => {
		const newValue = calculateValue(event.clientX);
		setSliderValue(newValue);
		onChange(newValue);

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseUp = () => {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};

	const handleTouchMove = (event: TouchEvent) => {
		const touch = event.touches[0];
		const newValue = calculateValue(touch.clientX);
		setSliderValue(newValue);
		onChange(newValue);
	};

	const handleTouchStart = (event: React.TouchEvent) => {
		const touch = event.touches[0];
		const newValue = calculateValue(touch.clientX);
		setSliderValue(newValue);
		onChange(newValue);

		document.addEventListener("touchmove", handleTouchMove);
		document.addEventListener("touchend", handleTouchEnd);
	};

	const handleTouchEnd = () => {
		document.removeEventListener("touchmove", handleTouchMove);
		document.removeEventListener("touchend", handleTouchEnd);
	};

	useEffect(() => {
		setSliderValue(value);
	}, [value]);

	return (
		<div
			ref={sliderRef}
			className="relative group w-full h-2 active:scale-y-[1.5] transition-all duration-300 bg-[--slider-bg] rounded-full cursor-pointer"
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
		>
			<motion.div
				className="absolute h-2 bg-[--slider-track] hover:bg-[--slider-track_hover] transition-all duration-300 rounded-full"
				animate={{
					width: "100%",
					WebkitMask: `linear-gradient(90deg, #000 ${
						((sliderValue - min) / (max - min)) * 100
					}%, transparent ${
						((sliderValue - min) / (max - min)) * 100
					}%)`,
					mask: `linear-gradient(90deg, #000 ${
						((sliderValue - min) / (max - min)) * 100
					}%, transparent ${
						((sliderValue - min) / (max - min)) * 100
					}%)`,
				}}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
			/>
		</div>
	);
}
//#endregion

//#region Preloader
export function Preloader() {
	return (
		<div className="flex justify-center items-center h-full">
			<div className="loader"></div>
			<style>{`
				.loader {
					border: 2px solid var(--loader);
					border-radius: 50%;
					border-top: 2px solid var(--loader_bg);
					width: 40px;
					height: 40px;
					animation: spin .5s linear infinite;
				}
				@keyframes spin {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			`}</style>
		</div>
	);
}
//#endregion
