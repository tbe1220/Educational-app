"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppButton from "@/components/ui/Button";
import { usePlayerStore, Difficulty } from "@/store/usePlayerStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { playSound, speakJapanese } from "@/lib/utils/audio";
import { supabase } from "@/lib/supabase";

interface LoginRegisterProps {
    onComplete: () => void;
}

export default function LoginRegister({ onComplete }: LoginRegisterProps) {
    const [mode, setMode] = useState<'select' | 'new' | 'load' | 'difficulty'>('select');
    const [name, setName] = useState("");
    const [pin, setPin] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>('normal');
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { setProfile } = usePlayerStore();

    const handleCreateNew = async () => {
        if (!name) {
            setErrorMsg("なまえを いれてね");
            playSound('wrong');
            return;
        }

        // Generate simple 4-digit PIN for kids
        const newPin = Math.floor(1000 + Math.random() * 9000).toString();
        const userId = crypto.randomUUID();

        setIsLoading(true);
        try {
            // Create user profile in Supabase
            const { error } = await supabase
                .from('profiles')
                .insert([{ id: userId, pin: newPin, name, difficulty, level: 1, points: 0, hp: 100, max_hp: 100 }]);

            if (error) throw error;

            setProfile(userId, newPin, name, difficulty);
            playSound('levelUp');
            speakJapanese(`よろしくね、${name}！`);
            onComplete();

        } catch (err: any) {
            console.error(err);
            setErrorMsg("えらーがおきました");
            playSound('wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoad = async () => {
        if (!pin || pin.length !== 4) {
            setErrorMsg("4けたの あいことば を いれてね");
            playSound('wrong');
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('pin', pin)
                .single();

            if (error || !data) {
                setErrorMsg("あいことば が ちがうみたい");
                playSound('wrong');
                setIsLoading(false);
                return;
            }

            setProfile(data.id, data.pin, data.name, data.difficulty as Difficulty);

            // Load current stats
            usePlayerStore.setState({
                hp: data.hp,
                maxHp: data.max_hp,
                points: data.points,
                level: data.level,
                equippedWeaponId: data.equipped_weapon_id
            });
            // Load inventory
            await useInventoryStore.getState().loadInventory(data.id);

            playSound('correct');
            speakJapanese(`おかえり、${data.name}！`);
            onComplete();

        } catch (err: any) {
            console.error(err);
            setErrorMsg("えらーがおきました");
            playSound('wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 bg-pop-blue flex items-center justify-center z-50 p-4">

            {/* Background decorations */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-8 border-white/20 w-full max-w-2xl relative overflow-hidden"
            >
                <h1 className="text-4xl md:text-5xl font-black text-center text-pop-orange mb-8 drop-shadow-sm">
                    だれが あそぶ？
                </h1>

                <AnimatePresence mode="wait">

                    {mode === 'select' && (
                        <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                            <AppButton color="green" className="w-full py-6 md:py-8 text-2xl md:text-5xl rounded-[2rem] border-b-8" onClick={() => { playSound('click'); setMode('new'); }}>
                                はじめて あそぶ
                            </AppButton>
                            <AppButton color="blue" className="w-full py-6 md:py-8 text-[1.4rem] md:text-5xl rounded-[2rem] border-b-8" onClick={() => { playSound('click'); setMode('load'); }}>
                                つづきから あそぶ <br className="md:hidden" /><span className="text-lg md:text-3xl">(あいことば)</span>
                            </AppButton>
                        </motion.div>
                    )}

                    {mode === 'new' && (
                        <motion.div key="new" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center w-full">
                            <h2 className="text-3xl font-bold text-gray-700 mb-6 w-full text-center">なまえ を おしえてね</h2>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={10}
                                className="w-full text-2xl md:text-4xl p-3 md:p-4 text-center border-4 border-gray-300 rounded-2xl mb-8 focus:border-pop-green outline-none"
                                placeholder="ひらがな"
                            />

                            <div className="flex gap-4 w-full">
                                <AppButton color="red" className="flex-1" onClick={() => { playSound('click'); setMode('select'); }}>もどる</AppButton>
                                <AppButton color="green" className="flex-1" onClick={() => { playSound('click'); setMode('difficulty'); }} disabled={!name}>つぎへ</AppButton>
                            </div>
                        </motion.div>
                    )}

                    {mode === 'difficulty' && (
                        <motion.div key="difficulty" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center w-full">
                            <h2 className="text-xl md:text-3xl font-bold text-gray-700 mb-6 w-full text-center border-b-4 border-gray-200 pb-4">むずかしさ を えらんでね</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
                                <AppButton
                                    color={difficulty === 'easy' ? 'green' : 'gray'}
                                    className={`flex flex-col items-center justify-center py-4 md:py-6 ${difficulty === 'easy' ? 'ring-4 ring-green-500 scale-105' : ''}`}
                                    onClick={() => { playSound('click'); setDifficulty('easy'); }}
                                >
                                    <span className="text-lg md:text-2xl mb-1 md:mb-2 leading-tight">やさしい</span>
                                    <span className="text-[11px] md:text-sm font-normal leading-tight mt-1 text-balance">3〜4さい むけ</span>
                                </AppButton>

                                <AppButton
                                    color={difficulty === 'normal' ? 'blue' : 'gray'}
                                    className={`flex flex-col items-center justify-center py-4 md:py-6 ${difficulty === 'normal' ? 'ring-4 ring-blue-500 scale-105' : ''}`}
                                    onClick={() => { playSound('click'); setDifficulty('normal'); }}
                                >
                                    <span className="text-lg md:text-2xl mb-1 md:mb-2 leading-tight">ふつう</span>
                                    <span className="text-[11px] md:text-sm font-normal leading-tight mt-1 text-balance">5〜6さい むけ</span>
                                </AppButton>

                                <AppButton
                                    color={difficulty === 'hard' ? 'red' : 'gray'}
                                    className={`flex flex-col items-center justify-center py-4 md:py-6 ${difficulty === 'hard' ? 'ring-4 ring-red-500 scale-105' : ''}`}
                                    onClick={() => { playSound('click'); setDifficulty('hard'); }}
                                >
                                    <span className="text-lg md:text-2xl mb-1 md:mb-2 leading-tight">むずかしい</span>
                                    <span className="text-[11px] md:text-sm font-normal text-balance leading-tight mt-1">しょうがくせい むけ</span>
                                </AppButton>
                            </div>

                            {errorMsg && <p className="text-red-500 font-bold mb-4">{errorMsg}</p>}

                            <div className="flex gap-4 w-full">
                                <AppButton color="red" className="flex-1" onClick={() => { playSound('click'); setMode('new'); }}>もどる</AppButton>
                                <AppButton color="yellow" className="flex-1" onClick={handleCreateNew} disabled={isLoading}>
                                    {isLoading ? 'ちょっとまってね...' : 'はじめる！'}
                                </AppButton>
                            </div>
                        </motion.div>
                    )}

                    {mode === 'load' && (
                        <motion.div key="load" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center w-full">
                            <h2 className="text-3xl font-bold text-gray-700 mb-6 w-full text-center">あいことば を いれてね</h2>
                            <input
                                type="text"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                maxLength={4}
                                className="w-full max-w-[200px] text-6xl tracking-[1em] pl-[1em] p-4 text-center border-4 border-gray-300 rounded-2xl mb-8 focus:border-pop-blue outline-none font-mono"
                                placeholder="1234"
                            />
                            {errorMsg && <p className="text-red-500 font-bold mb-4 animate-bounce">{errorMsg}</p>}
                            <div className="flex gap-4 w-full">
                                <AppButton color="red" className="flex-1" onClick={() => { playSound('click'); setMode('select'); setErrorMsg(""); }}>もどる</AppButton>
                                <AppButton color="blue" className="flex-1" onClick={handleLoad} disabled={isLoading || pin.length !== 4}>
                                    {isLoading ? 'さがしています...' : 'けってい'}
                                </AppButton>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </motion.div>
        </div>
    );
}
