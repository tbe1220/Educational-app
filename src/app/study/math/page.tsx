"use client";

import { useState, useEffect } from "react";
import MathEngineUI from "@/components/game/MathEngineUI";
import { generateMathQuestion, MathQuestion } from "@/lib/engines/math";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/usePlayerStore";
import { playSound, speakJapanese } from "@/lib/utils/audio";

export default function MathStudyPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
    const { addPoints } = usePlayerStore();

    useEffect(() => {
        // Generate first question on mount
        setCurrentQuestion(generateMathQuestion());
        speakJapanese("さんすうの もんだい だよ。がんばってね！");
    }, []);

    const handleAnswer = (correct: boolean) => {
        if (correct) {
            addPoints(10); // Reward for correct answer in pure study mode
            setCurrentQuestion(generateMathQuestion());
        } else {
            // Repeat question or generate a new one. For now, generate new one
            setCurrentQuestion(generateMathQuestion());
        }
    };

    if (!currentQuestion) return <div className="min-h-screen bg-pop-blue/10 flex items-center justify-center">...</div>;

    return (
        <div className="min-h-screen bg-pop-blue/10 flex flex-col p-4 md:p-12 items-center justify-center">
            <MathEngineUI
                question={currentQuestion}
                onAnswer={handleAnswer}
                onBack={() => router.push('/')}
            />
        </div>
    );
}
