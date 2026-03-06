"use client";

import { useState, useEffect } from "react";
import LanguageEngineUI from "@/components/game/LanguageEngineUI";
import { generateLanguageQuestion, LanguageQuestion } from "@/lib/engines/language";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/usePlayerStore";
import { speakJapanese } from "@/lib/utils/audio";

export default function LanguageStudyPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState<LanguageQuestion | null>(null);
    const { addPoints } = usePlayerStore();

    useEffect(() => {
        setCurrentQuestion(generateLanguageQuestion());
        speakJapanese("こくごの もんだい だよ。こたえられるかな？");
    }, []);

    const handleAnswer = (correct: boolean) => {
        if (correct) {
            addPoints(10);
            setCurrentQuestion(generateLanguageQuestion());
        } else {
            setCurrentQuestion(generateLanguageQuestion());
        }
    };

    if (!currentQuestion) return <div className="min-h-screen bg-pop-green/10 flex items-center justify-center">...</div>;

    return (
        <div className="min-h-screen bg-pop-green/10 flex flex-col p-4 md:p-12 items-center justify-center relative overflow-hidden">
            {/* Decorative text bg */}
            <div className="absolute opacity-5 text-[20rem] font-black right-10 bottom-0 pointer-events-none select-none text-pop-green font-sans">
                あ
            </div>

            <LanguageEngineUI
                question={currentQuestion}
                onAnswer={handleAnswer}
                onBack={() => router.push('/')}
            />
        </div>
    );
}
