"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageQuestion } from "@/lib/engines/language";
import AppButton from "@/components/ui/Button";
import { playSound } from "@/lib/utils/audio";
import { ArrowLeft } from "lucide-react";

export default function LanguageEngineUI({
    onBack,
    question,
    onAnswer,
}: {
    onBack: () => void;
    question: LanguageQuestion;
    onAnswer: (correct: boolean) => void;
}) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [hintActive, setHintActive] = useState(false);
    const [timePassed, setTimePassed] = useState(0);

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

    useEffect(() => {
        // Show hint text if taking longer than 8 seconds
        if (timePassed >= 8 && !isCorrect) {
            setHintActive(true);
        }
    }, [timePassed, isCorrect]);

    const handleSelect = (choice: string) => {
        if (selectedAnswer !== null) return;

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
        }, 1500);
    };

    const renderHint = () => {
        if (!hintActive) return null;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-yellow-100 rounded-2xl border-2 border-pop-yellow text-orange-600 font-bold text-xl"
            >
                💡 ほんきの ヒント: 「{question.correctAnswer}」 だよ！ さがしてみてね。
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
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-4 border-pop-green/20 w-full text-center relative"
            >
                <span className="inline-block px-4 py-2 bg-pop-green text-white font-bold rounded-full mb-6">
                    {question.category === 'bugs' ? 'むし クイズ' :
                        question.category === 'countries' ? 'くに クイズ' :
                            question.category === 'safety' ? 'あんぜん クイズ' : 'もじ クイズ'}
                </span>

                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 my-8 leading-tight">
                    {question.questionStr}
                </h2>

                {renderHint()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-12">
                    {question.choices.map((choice, index) => {
                        let color: "blue" | "red" | "green" | "yellow" | "purple" | "orange" = "blue";
                        const colors: ("blue" | "red" | "green" | "yellow" | "purple" | "orange")[] = ["blue", "red", "green", "orange"];
                        color = colors[index % colors.length];

                        let btnStateClasses = "";
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
                                key={choice + index}
                                color={color}
                                disabled={selectedAnswer !== null}
                                onClick={() => handleSelect(choice)}
                                className={`text-3xl md:text-4xl py-8 ${btnStateClasses}`}
                            >
                                {choice}
                            </AppButton>
                        );
                    })}
                </div>

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
