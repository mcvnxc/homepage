import { motion } from "framer-motion";

interface AnimationProps {
	children?: React.ReactNode;
	className?: string;
	key?: string;
}

export function BlurToClear({ children, className }: AnimationProps) {
	return (
		<motion.div
			className={className}
			initial={{ scale: 0.9, opacity: 0, filter: "blur(30px)" }}
			animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
			exit={{ opacity: 0 }}
			transition={{ type: "ease-in-out", duration: 0.3, delay: 0.2 }}
		>
			{children}
		</motion.div>
	);
}

export function FadeIn({ children, className, key }: AnimationProps) {
	return (
		<motion.div
			className={className}
			key={key}
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.5 }}
			transition={{ duration: 0.3 }}
		>
			{children}
		</motion.div>
	);
}
