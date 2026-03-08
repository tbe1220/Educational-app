"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MathQuestion, MathQuestionType } from "@/lib/engines/math";
import AppButton from "@/components/ui/Button";
import { playSound } from "@/lib/utils/audio";
import { usePlayerStore } from "@/store/usePlayerStore";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MathEngineUI({
    onBack,
    question,
    onAnswer,
}: {
    onBack: () => void;
    question: MathQuestion;
    onAnswer: (correct: boolean) => void;
}) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [hintActive, setHintActive] = useState(false);
    const [timePassed, setTimePassed] = useState(0);

    // Reset state on new question
    useEffect(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setHintActive(false);
        setTimePassed(0);

        const timer = setInterval(() => {
            setTimePassed((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [question]);

    // If 5 seconds pass without answer, show hint
    useEffect(() => {
        if (timePassed >= 5 && !isCorrect && question.hintDots && (question.type === 'multiplication' || question.type === 'division')) {
            setHintActive(true);
        }
    }, [timePassed, isCorrect, question]);

    const handleSelect = (choice: number | string) => {
        if (selectedAnswer !== null) return; // Prevent double click

        setSelectedAnswer(choice);
        const correct = choice === question.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            playSound("correct");
        } else {
            playSound("wrong");
        }

        setTimeout(() => {
            onAnswer(correct);
        }, 1500); // Wait 1.5s to show result before next
    };

    const renderClock = (timeStr: string) => {
        // timeStr format "H:MM"
        const [h, m] = timeStr.split(':').map(Number);
        const hourAngle = (h % 12) * 30 + (m / 60) * 30; // 360 / 12 = 30deg per hour
        const minuteAngle = m * 6; // 360 / 60 = 6deg per minute

        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        return (
            <div className="relative w-56 h-56 rounded-full border-8 border-pop-blue bg-white flex items-center justify-center shadow-lg mx-auto my-8">
                <div className="absolute w-3 h-3 bg-black rounded-full z-10" />

                {/* Clock Numbers */}
                {numbers.map(num => {
                    const angle = (num * 30 - 90) * (Math.PI / 180);
                    const radius = 80;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                        <div
                            key={num}
                            className="absolute font-black text-gray-400 text-2xl"
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                        >
                            {num}
                        </div>
                    );
                })}

                {/* Hour Hand */}
                <motion.div
                    className="absolute w-3 h-16 bg-red-400 rounded-full origin-bottom"
                    style={{ bottom: '50%' }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: hourAngle }}
                />
                {/* Minute Hand */}
                <motion.div
                    className="absolute w-1.5 h-24 bg-blue-400 rounded-full origin-bottom"
                    style={{ bottom: '50%' }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: minuteAngle }}
                />
            </div>
        );
    };

    const renderHint = () => {
        if (!hintActive || !question.hintDots) return null;

        // Create an array of circles for the hint
        const dotsArray = Array.from({ length: question.hintDots });

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-2 mt-4 px-4 max-w-sm mx-auto bg-green-100 p-4 rounded-3xl"
            >
                <span className="w-full text-center text-green-700 font-bold mb-2">힌트: ぼーるの かずは？</span>
                {dotsArray.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-6 h-6 bg-red-500 rounded-full shadow-md"
                    />
                ))}
            </motion.div>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            <div className="w-full flex justify-start mb-8">
                <button
                    onClick={() => {
                        playSound('click');
                        onBack();
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-md font-bold text-gray-500 hover:bg-gray-50"
                >
                    <ArrowLeft /> もどる
                </button>
            </div>

            <motion.div
                key={question.id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-4 border-pop-blue/20 w-full text-center relative"
            >
                <div className="text-2xl font-bold text-pop-blue mb-2">第 {timePassed} びょう</div>

                {question.type === 'clock' ? (
                    renderClock(question.questionStr)
                ) : (
                    <h2 className="text-6xl md:text-8xl font-extrabold text-gray-800 my-8">
                        {question.questionStr}
                    </h2>
                )}

                {renderHint()}

                <div className="grid grid-cols-2 gap-4 md:gap-8 mt-12">
                    {question.choices.map((choice, index) => {
                        let color: "blue" | "red" | "green" | "yellow" = "blue";
                        if (index % 4 === 1) color = "red";
                        if (index % 4 === 2) color = "green";
                        if (index % 4 === 3) color = "yellow";

                        let btnStateClasses = "";
                        let btnColorClasses = "";
                        if (selectedAnswer !== null) {
                            if (choice === question.correctAnswer) {
                                btnStateClasses = "ring-8 ring-green-400 z-10 scale-105";
                            } else if (choice === selectedAnswer) {
                                btnStateClasses = "opacity-50 grayscale";
                            } else {
                                btnStateClasses = "opacity-50";
                            }
                        }

                        return (
                            <AppButton
                                key={choice.toString() + index}
                                color={color}
                                disabled={selectedAnswer !== null}
                                onClick={() => handleSelect(choice)}
                                className={`text-4xl md:text-5xl ${btnStateClasses}`}
                            >
                                {choice}
                            </AppButton>
                        );
                    })}
                </div>

                {/* Feedback Overlay */}
                <AnimatePresence>
                    {isCorrect !== null && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                        >
                            {isCorrect ? (
                                <div className="text-[12rem] md:text-[20rem] font-bold text-pop-green drop-shadow-2xl">
                                    ⭕
                                </div>
                            ) : (
                                <div className="text-[12rem] md:text-[20rem] font-bold text-pop-red drop-shadow-2xl">
                                    ❌
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
