"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/store/usePlayerStore";
import { getRandomMonster, Monster } from "@/data/monsters";
import { generateMathQuestion, MathQuestion } from "@/lib/engines/math";
import { generateLanguageQuestion, LanguageQuestion } from "@/lib/engines/language";
import { generateEnglishQuestion, EnglishQuestion } from "@/lib/engines/english";
import AppButton from "@/components/ui/Button";
import { playSound, speakEnglish, speakJapanese } from "@/lib/utils/audio";
import { ArrowLeft, Swords, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import MathEngineUI from "../game/MathEngineUI";
import LanguageEngineUI from "../game/LanguageEngineUI";
import EnglishEngineUI from "../game/EnglishEngineUI";

type QuestionType = 'math' | 'language' | 'english';

export default function BattleArena() {
    const router = useRouter();
    const { hp, maxHp, points, level, addPoints, addLevel, takeDamage, enemyAttackTime } = usePlayerStore();

    const [monster, setMonster] = useState<Monster | null>(null);
    const [monsterHp, setMonsterHp] = useState(0);
    const [battleState, setBattleState] = useState<'intro' | 'fighting' | 'playerAttack' | 'enemyAttack' | 'victory' | 'defeat'>('intro');

    const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType>('math');
    const [currentMathQ, setCurrentMathQ] = useState<MathQuestion | null>(null);
    const [currentLangQ, setCurrentLangQ] = useState<LanguageQuestion | null>(null);
    const [currentEngQ, setCurrentEngQ] = useState<EnglishQuestion | null>(null);

    const [timeRemaining, setTimeRemaining] = useState(15); // 15 seconds to answer
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize battle
    useEffect(() => {
        startNewBattle();
        return () => clearTimer();
    }, []);

    const clearTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const startNewBattle = () => {
        const newMonster = getRandomMonster(level);
        setMonster(newMonster);
        setMonsterHp(newMonster.maxHp);
        setBattleState('intro');

        setTimeout(() => {
            setBattleState('fighting');
            generateNewQuestion();
            startTimer();
            speakJapanese(`${newMonster.name} が あらわれた！`);
        }, 2000);
    };

    const startTimer = () => {
        clearTimer();
        // Use user-defined attack time (default 20)
        setTimeRemaining(enemyAttackTime || 20);
        timerRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearTimer();
                    handleEnemyAttack();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const generateNewQuestion = () => {
        const types: QuestionType[] = ['math', 'language', 'english'];
        const selectedType = types[Math.floor(Math.random() * types.length)];
        setCurrentQuestionType(selectedType);

        if (selectedType === 'math') {
            setCurrentMathQ(generateMathQuestion());
        } else if (selectedType === 'language') {
            setCurrentLangQ(generateLanguageQuestion());
        } else {
            setCurrentEngQ(generateEnglishQuestion());
        }
    };

    const handleEnemyAttack = () => {
        if (!monster) return;
        setBattleState('enemyAttack');
        playSound('damage');
        takeDamage(monster.attackPower);

        setTimeout(() => {
            if (usePlayerStore.getState().hp <= 0) {
                setBattleState('defeat');
                speakJapanese("まけちゃった。また がんばろう！");
            } else {
                setBattleState('fighting');
                generateNewQuestion();
                startTimer();
            }
        }, 2000);
    };

    const handlePlayerAttack = () => {
        if (!monster) return;
        setBattleState('playerAttack');
        playSound('attack');

        // Calculate damage (base 10 + random + level bonus)
        const damage = 10 + Math.floor(Math.random() * 5) + (level * 2);
        const newMonsterHp = Math.max(0, monsterHp - damage);
        setMonsterHp(newMonsterHp);

        setTimeout(() => {
            if (newMonsterHp <= 0) {
                setBattleState('victory');
                playSound('levelUp');
                addPoints(monster.pointReward);
                // Level up logic (simplified: every 3 wins roughly)
                if (Math.random() > 0.6) {
                    addLevel(1);
                }
                speakJapanese(`やったね！ ${monster.name} を たおしたよ！`);
            } else {
                // Monster survives, back to fighting
                setBattleState('fighting');
                generateNewQuestion();
                startTimer();
            }
        }, 2000);
    };

    const handleAnswer = (correct: boolean) => {
        clearTimer(); // Stop timer when answer is submitted
        if (correct) {
            handlePlayerAttack();
        } else {
            handleEnemyAttack();
        }
    };

    if (!monster) return null;

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center bg-gray-900 p-4">

            {/* Background elements */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-800 to-gray-900" />
            <div className={`absolute bottom-0 w-full h-1/3 bg-gradient-to-t ${monster.color} opacity-20`} />

            <div className="w-full flex justify-between z-10 mb-4 max-w-5xl">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                    <ArrowLeft /> にげる
                </button>
                <div className="text-white text-xl font-bold flex items-center gap-2">
                    {points} ぽいんと
                </div>
            </div>

            <div className="flex-1 w-full max-w-5xl flex flex-col md:flex-row gap-8 z-10">

                {/* Monster Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative">

                    <div className="w-full max-w-md bg-white/10 p-4 rounded-3xl backdrop-blur-sm border-2 border-white/20 mb-8">
                        <div className="flex justify-between text-white font-bold mb-2">
                            <span className="text-xl">{monster.name}</span>
                            <span>HP: {monsterHp} / {monster.maxHp}</span>
                        </div>
                        <div className="w-full h-4 bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-red-500"
                                animate={{ width: `${(monsterHp / monster.maxHp) * 100}%` }}
                            />
                        </div>
                    </div>

                    <motion.div
                        animate={
                            battleState === 'intro' ? { scale: [0, 1.2, 1], opacity: [0, 1, 1] } :
                                battleState === 'playerAttack' ? { x: [-10, 20, -10, 20, 0], filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'] } :
                                    battleState === 'enemyAttack' ? { scale: 1.5, y: -50 } :
                                        battleState === 'victory' ? { scale: 0, opacity: 0, rotate: 180 } :
                                            { y: [0, -15, 0] }
                        }
                        transition={{
                            duration: battleState === 'fighting' ? 3 : 0.5,
                            repeat: battleState === 'fighting' ? Infinity : 0
                        }}
                        className="text-[10em] md:text-[15em] drop-shadow-2xl select-none"
                    >
                        {monster.emoji}
                    </motion.div>

                    {/* Player HP Bar */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/10 p-4 rounded-3xl backdrop-blur-sm border-2 border-white/20">
                        <div className="flex justify-between text-white font-bold mb-2 text-lg">
                            <span>じぶんの たいりょく</span>
                            <span>{hp} / {maxHp}</span>
                        </div>
                        <div className="w-full h-6 bg-gray-700/50 rounded-full overflow-hidden border-2 border-gray-900">
                            <motion.div
                                className="h-full bg-green-400"
                                animate={{ width: `${(hp / maxHp) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="flex-1 flex flex-col justify-center relative">

                    {battleState === 'fighting' && (
                        <div className="absolute -top-12 right-0 bg-red-500 text-white px-6 py-2 rounded-full font-bold text-2xl animate-pulse">
                            のこり {timeRemaining} びょう
                        </div>
                    )}

                    <AnimatePresence mode="wait">

                        {battleState === 'intro' && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-white p-8 rounded-3xl shadow-xl text-center"
                            >
                                <h2 className="text-4xl font-bold text-gray-800 mb-4">{monster.name} が あらわれた！</h2>
                                <p className="text-xl text-gray-600">もんだいに せいかい して こうげき しよう！</p>
                            </motion.div>
                        )}

                        {battleState === 'fighting' && (
                            <motion.div
                                key="fighting"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/95 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden"
                            >
                                {/* Engine Interceptors - Reusing existing components but overriding styles subtly if needed via wrapper, but they control their own layout primarily. 
                    Because the engine UIs are designed as full page, we adapt them here or just render the logic. 
                    Given the structure of Game UI files, we should render them but pass an empty `onBack` or hide the back button via CSS. */}
                                <div className="battle-engine-container">
                                    {currentQuestionType === 'math' && currentMathQ && (
                                        <MathEngineUI question={currentMathQ} onAnswer={handleAnswer} onBack={() => { }} />
                                    )}
                                    {currentQuestionType === 'language' && currentLangQ && (
                                        <LanguageEngineUI question={currentLangQ} onAnswer={handleAnswer} onBack={() => { }} />
                                    )}
                                    {currentQuestionType === 'english' && currentEngQ && (
                                        <EnglishEngineUI question={currentEngQ} onAnswer={handleAnswer} onBack={() => { }} />
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {battleState === 'playerAttack' && (
                            <motion.div
                                key="p-attack"
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                <Swords className="w-64 h-64 text-yellow-400 drop-shadow-2xl" />
                            </motion.div>
                        )}

                        {battleState === 'enemyAttack' && (
                            <motion.div
                                key="e-attack"
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                <ShieldAlert className="w-64 h-64 text-red-500 drop-shadow-2xl" />
                            </motion.div>
                        )}

                        {battleState === 'victory' && (
                            <motion.div
                                key="victory"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-white p-12 rounded-[3rem] shadow-xl text-center border-8 border-yellow-400"
                            >
                                <h2 className="text-6xl font-black text-pop-orange mb-8 text-stroke-white drop-shadow-lg">かち！</h2>
                                <p className="text-3xl font-bold text-gray-700 mb-8">{monster.pointReward} ぽいんと ゲット！</p>

                                <AppButton color="yellow" onClick={startNewBattle} className="mb-4">
                                    つぎの たたかいへ
                                </AppButton>
                                <AppButton color="blue" onClick={() => router.push('/')}>
                                    まちに もどる
                                </AppButton>
                            </motion.div>
                        )}

                        {battleState === 'defeat' && (
                            <motion.div
                                key="defeat"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-gray-800 p-12 rounded-[3rem] shadow-xl text-center border-8 border-gray-600"
                            >
                                <h2 className="text-6xl font-black text-red-500 mb-8 drop-shadow-lg">まけ...</h2>
                                <p className="text-3xl font-bold text-gray-300 mb-8">たいりょくが なくなった。</p>
                                <AppButton color="blue" onClick={() => {
                                    usePlayerStore.getState().heal(maxHp); // Full heal on revive
                                    router.push('/');
                                }}>
                                    まちに もどる
                                </AppButton>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            {/* Hide the back buttons of inner engines using global CSS in this component since we reuse them */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .battle-engine-container button[class*="flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-md font-bold text-gray-500"] {
           display: none !important;
        }
      `}} />
        </div>
    );
}
