"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";
import { playSound } from "@/lib/utils/audio";

interface AppButtonProps extends Omit<HTMLMotionProps<"button">, 'color'> {
    children: ReactNode;
    onClick?: () => void;
    color?: "red" | "blue" | "yellow" | "green" | "orange" | "purple" | "gray";
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    disabled?: boolean;
}

const colorClasses = {
    red: "bg-pop-red hover:bg-[#ff4040] shadow-[#cc4a4a]",
    blue: "bg-pop-blue hover:bg-[#2092fa] shadow-[#2f82cc]",
    yellow: "bg-pop-yellow hover:bg-[#f0bd1f] shadow-[#cca529] text-gray-800",
    green: "bg-pop-green hover:bg-[#3bc252] shadow-[#3d994d]",
    orange: 'bg-pop-orange shadow-orange-500 hover:bg-orange-400 font-bold',
    purple: 'bg-pop-purple shadow-purple-500 hover:bg-purple-400 font-bold',
    gray: 'bg-gray-400 shadow-gray-500 hover:bg-gray-300 font-bold text-white',
};

const sizeClasses = {
    sm: "px-4 py-2 text-lg rounded-xl border-b-2",
    md: "px-6 py-3 text-2xl rounded-2xl border-b-4",
    lg: "px-10 py-5 text-4xl rounded-3xl border-b-[6px]",
    xl: "px-16 py-8 text-5xl rounded-[2rem] border-b-8 w-full max-w-xl"
};

export default function AppButton({
    children,
    onClick,
    color = "blue",
    size = "md",
    className = "",
    disabled,
    ...props
}: AppButtonProps) {
    const handleClick = () => {
        if (disabled) return;
        playSound('click');
        if (onClick) onClick();
    };

    const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
    const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;

    return (
        <motion.button
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95, y: 4 }}
            onClick={handleClick}
            disabled={disabled}
            className={`
        relative font-bold text-white tracking-widest transition-colors
        ${colorClass}
        ${sizeClass}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.button>
    );
}
