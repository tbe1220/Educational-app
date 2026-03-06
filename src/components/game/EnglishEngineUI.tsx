"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnglishQuestion } from "@/lib/engines/english";
import AppButton from "@/components/ui/Button";
import { playSound, speakEnglish, speakJapanese } from "@/lib/utils/audio";
import { ArrowLeft, Volume2, Repeat } from "lucide-react";

export default function EnglishEngineUI({
    onBack,
    question,
    onAnswer,
}: {
    onBack: () => void;
    question: EnglishQuestion;
    onAnswer: (correct: boolean) => void;
}) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowExplanation(false);

        // Auto speak question on load
        setTimeout(() => {
            speakEnglish(question.englishText);
        }, 500); // 500ms delay to let UI render

    }, [question]);

    const handleReplayAudio = () => {
        speakEnglish(question.englishText);
    };

    const handleSelect = (choice: string) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(choice);
        const correct = choice === question.japaneseMeaning;
        setIsCorrect(correct);

        if (correct) {
            playSound("correct");
            // Congratulation message
            setTimeout(() => {
                speakJapanese("せいかい！ すごいね！");
            }, 500);
            setTimeout(() => {
                onAnswer(true);
            }, 3000);
        } else {
            playSound("wrong");
            setTimeout(() => {
                setShowExplanation(true);
                // Explain error and wait for user to continue
                speakJapanese(`ざんねん！ ${question.explanationText} もういっかい えいごを きいてみよう。`);
            }, 800);
        }
    };

    const handleRepeatMistake = () => {
        speakEnglish(question.englishText);
        // Move on after repeat
        setTimeout(() => {
            onAnswer(false);
        }, 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center z-10">
            <div className="w-full flex justify-start mb-4">
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-zinc-50 p-8 md:p-12 rounded-[3rem] shadow-xl border-4 border-pop-purple/30 w-full text-center relative"
            >
                <div className="flex flex-col items-center justify-center gap-6 mb-12">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleReplayAudio}
                        className="w-32 h-32 rounded-full bg-pop-purple text-white shadow-lg flex items-center justify-center cursor-pointer border-b-8 border-purple-800"
                    >
                        <Volume2 className="w-16 h-16" />
                    </motion.button>

                    <p className="text-2xl font-bold text-gray-400">おとを きいてね</p>

                    <h2 className="text-5xl font-extrabold text-pop-purple drop-shadow-sm">
                        {question.englishText}
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-8 mt-8">
                    {question.choices.map((choice, index) => {
                        let color: "blue" | "red" | "green" | "yellow" = "blue";
                        if (index % 4 === 1) color = "yellow";
                        if (index % 4 === 2) color = "green";
                        if (index % 4 === 3) color = "red";

                        let btnStateClasses = "";
                        if (selectedAnswer !== null) {
                            if (choice === question.japaneseMeaning) {
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
                                className={`text-2xl md:text-3xl py-6 ${btnStateClasses}`}
                            >
                                {choice}
                            </AppButton>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {isCorrect === true && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                        >
                            <div className="text-[12rem] md:text-[20rem] font-bold text-pop-green drop-shadow-2xl">
                                ⭕
                            </div>
                        </motion.div>
                    )}

                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 bg-white/95 rounded-[3rem] z-40 flex flex-col items-center justify-center p-8 backdrop-blur-sm"
                        >
                            <h3 className="text-4xl font-black text-pop-red mb-6">ざんねん！</h3>
                            <p className="text-3xl font-bold text-gray-700 mb-12 leading-relaxed">
                                {question.explanationText}
                            </p>

                            <AppButton
                                color="purple"
                                onClick={handleRepeatMistake}
                                className="flex items-center gap-4 animate-bounce"
                            >
                                <Repeat className="w-8 h-8" />もういっかい きく
                            </AppButton>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
