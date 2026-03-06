"use client";

import { useState, useEffect } from "react";
import EnglishEngineUI from "@/components/game/EnglishEngineUI";
import { generateEnglishQuestion, EnglishQuestion } from "@/lib/engines/english";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/usePlayerStore";
import { speakJapanese } from "@/lib/utils/audio";

export default function EnglishStudyPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState<EnglishQuestion | null>(null);
    const { addPoints } = usePlayerStore();

    useEffect(() => {
        setCurrentQuestion(generateEnglishQuestion());
        speakJapanese("えいごの おとを よーく きいてね。");
    }, []);

    const handleAnswer = (correct: boolean) => {
        if (correct) {
            addPoints(10);
            setCurrentQuestion(generateEnglishQuestion());
        } else {
            // The EngineUI already played the repeat audio, we just load a new question now
            setCurrentQuestion(generateEnglishQuestion());
        }
    };

    if (!currentQuestion) return <div className="min-h-screen bg-pop-purple/10 flex items-center justify-center">...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pop-purple/20 to-pink-100 flex flex-col p-4 md:p-12 items-center justify-center relative overflow-hidden">
            {/* Decorative bg element */}
            <div className="absolute opacity-10 text-[15rem] font-extrabold left-0 bottom-[-5rem] pointer-events-none select-none text-pop-purple -rotate-12">
                A B C
            </div>

            <EnglishEngineUI
                question={currentQuestion}
                onAnswer={handleAnswer}
                onBack={() => router.push('/')}
            />
        </div>
    );
}
