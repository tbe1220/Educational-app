"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInventoryStore } from "@/store/useInventoryStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import AppButton from "@/components/ui/Button";
import { playSound, speakJapanese } from "@/lib/utils/audio";
import { ArrowLeft, Camera, Sparkles, Coins, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CameraFriendPage() {
    const router = useRouter();
    const { points, removePoints } = usePlayerStore();
    const { addCustomFriend } = useInventoryStore();

    const [stage, setStage] = useState<'capture' | 'preview' | 'math' | 'wrong' | 'success'>('capture');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [userChangeInput, setUserChangeInput] = useState<string>("");

    const PRICE = 100; // Cost to make a friend
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCaptureClick = () => {
        playSound('click');
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            playSound('correct');
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 500;
                    const MAX_HEIGHT = 500;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round((height * MAX_WIDTH) / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round((width * MAX_HEIGHT) / height);
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

                    setImagePreview(compressedBase64);
                    setStage('preview');
                    speakJapanese("いい しゃしん だね！ ぽいんとを つかって おともだちに する？");
                };
                if (event.target?.result) {
                    img.src = event.target.result as string;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStartMath = () => {
        playSound('click');
        if (points >= PRICE) {
            setStage('math');
            setUserChangeInput("");
            speakJapanese(`おつりは いくら かな？`);
        } else {
            playSound('wrong');
            speakJapanese("ぽいんと が たりないみたい。");
        }
    };

    const handleMathSubmit = () => {
        const correctChange = points - PRICE;
        const userAnswer = parseInt(userChangeInput, 10);

        if (userAnswer === correctChange) {
            playSound('correct');
            executePurchase();
            setStage('success');
            speakJapanese("せいかい！ あたらしい おともだち が できたよ！");
        } else {
            playSound('wrong');
            speakJapanese(`ちがうみたい。 せいかい は ${correctChange} だよ。でも おともだち に できるよ！`);
            setStage('wrong');
        }
    };

    const executePurchase = () => {
        removePoints(PRICE);
        const uuid = crypto.randomUUID();
        if (imagePreview) {
            addCustomFriend(uuid, imagePreview, 'おともだち');
        }
    };

    const handleReset = () => {
        playSound('click');
        setImagePreview(null);
        setStage('capture');
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const renderMoney = (amount: number) => {
        if (amount > 9999) return <div className="text-xl font-bold text-yellow-600">💰 {amount}</div>;
        const thousands = Math.floor(amount / 1000);
        const hundreds = Math.floor((amount % 1000) / 100);
        const tens = Math.floor((amount % 100) / 10);
        const ones = amount % 10;

        return (
            <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                {Array.from({ length: thousands }).map((_, i) => (
                    <div key={`1000-${i}`} className="px-2 py-1 bg-blue-100 border-2 border-blue-300 text-blue-800 font-bold text-[10px] rounded-sm shadow-sm flex items-center">1000札</div>
                ))}
                {Array.from({ length: hundreds }).map((_, i) => (
                    <div key={`100-${i}`} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center font-bold text-gray-700 shadow-sm text-[10px]">100円</div>
                ))}
                {Array.from({ length: tens }).map((_, i) => (
                    <div key={`10-${i}`} className="w-7 h-7 rounded-full bg-orange-200 border-2 border-orange-500 flex items-center justify-center font-bold text-orange-800 shadow-sm text-[10px]">10円</div>
                ))}
                {Array.from({ length: ones }).map((_, i) => (
                    <div key={`1-${i}`} className="w-6 h-6 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center font-bold text-yellow-800 shadow-sm text-[9px]">1円</div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-pink-50 flex flex-col p-4 md:p-8 items-center relative overflow-hidden">
            <div className="w-full flex justify-between z-10 mb-8">
                <button
                    onClick={() => {
                        playSound('click');
                        router.push('/');
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-md font-bold text-pink-500 hover:bg-pink-100"
                >
                    <ArrowLeft /> まちへ もどる
                </button>
                <div className="bg-pop-yellow text-gray-800 px-6 py-2 rounded-xl font-bold text-2xl shadow-sm border-b-4 border-[#cca529] flex items-center gap-2">
                    <Coins className="text-orange-500" />
                    {points} ぽいんと
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-pink-500 mb-8 drop-shadow-md z-10 flex items-center gap-4">
                <Camera className="w-12 h-12" /> カメラで おともだち を つくろう！
            </h1>

            <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center z-10">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                <AnimatePresence mode="wait">
                    {stage === 'capture' && (
                        <motion.div
                            key="capture"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <AppButton
                                color="red"
                                size="xl"
                                onClick={handleCaptureClick}
                                className="flex flex-col items-center gap-6 py-16 px-24 bg-gradient-to-br from-pink-400 to-rose-600 shadow-pink-900 border-4 border-white"
                            >
                                <Camera className="w-24 h-24" />
                                <span className="text-4xl">しゃしん を とる</span>
                            </AppButton>
                            <p className="text-gray-600 text-xl font-bold mt-8 text-center bg-white/50 p-4 rounded-full shadow-sm">
                                じぶんの しゃしんや おきにいりの ものを とろう！<br />（MAX 20まい まで）
                            </p>
                        </motion.div>
                    )}

                    {stage === 'preview' && imagePreview && (
                        <motion.div
                            key="preview"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col items-center p-8 rounded-3xl bg-white shadow-xl border-8 border-pink-200"
                        >
                            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-pink-400 mb-8 relative shadow-inner">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>

                            <p className="text-2xl text-orange-500 font-bold mb-8 flex items-center gap-2">
                                <Coins /> {PRICE} ぽいんと で おともだちに する？
                            </p>

                            <div className="flex gap-4 w-full justify-center">
                                <AppButton color="red" onClick={handleReset} className="text-2xl">
                                    とりなおす
                                </AppButton>
                                <AppButton color="red" onClick={handleStartMath} disabled={points < PRICE} className="text-2xl">
                                    おともだち に する
                                </AppButton>
                            </div>
                            {points < PRICE && (
                                <p className="text-red-500 font-bold mt-4 animate-bounce">ぽいんと が たりないよ！</p>
                            )}
                        </motion.div>
                    )}

                    {stage === 'math' && (
                        <motion.div
                            key="math"
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl w-full flex flex-col items-center shadow-2xl border-8 border-pop-yellow"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-pop-blue pb-4 w-full text-center">
                                さんすう もんだい
                            </h2>

                            <div className="text-3xl font-extrabold mb-8 flex flex-col items-center gap-6 w-full bg-blue-50 p-6 rounded-3xl">
                                <div className="flex justify-between w-full text-pop-blue items-center">
                                    <div className="flex flex-col text-xl">
                                        <span>もっている おかね:</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span>{points}</span>
                                        {renderMoney(points)}
                                    </div>
                                </div>
                                <div className="flex justify-between w-full text-pop-red border-b-4 border-gray-400 pb-4 items-center">
                                    <div className="flex flex-col text-xl">
                                        <span>ひく (ねだん):</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span>- {PRICE}</span>
                                        {renderMoney(PRICE)}
                                    </div>
                                </div>
                                <div className="flex justify-between w-full text-pop-green pt-2 items-center">
                                    <span>おつりは？</span>
                                    <input
                                        type="number"
                                        value={userChangeInput}
                                        onChange={(e) => setUserChangeInput(e.target.value)}
                                        className="w-32 text-center bg-white border-4 border-gray-300 rounded-2xl p-2 outline-none focus:border-pop-green"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 w-full">
                                <AppButton color="red" className="flex-1 text-2xl" onClick={handleReset}>やめる</AppButton>
                                <AppButton color="blue" className="flex-1 text-2xl" onClick={handleMathSubmit} disabled={userChangeInput === ""}>こたえる</AppButton>
                            </div>
                        </motion.div>
                    )}

                    {stage === 'wrong' && (
                        <motion.div
                            key="wrong"
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl w-full flex flex-col items-center shadow-2xl border-8 border-pop-yellow"
                        >
                            <h2 className="text-3xl font-bold text-pop-red mb-8 border-b-4 border-pop-red pb-4 w-full text-center">
                                おしい！
                            </h2>
                            <div className="text-2xl font-bold text-gray-700 mb-6 w-full bg-red-50 p-6 rounded-3xl text-center">
                                <p className="mb-4 text-xl">
                                    きみのこたえ: <span className="text-pop-red">{userChangeInput}</span>
                                </p>
                                <p className="text-4xl mb-4">
                                    せいかいは: <span className="text-pop-blue">{points - PRICE}</span>
                                </p>

                                <div className="flex justify-center mb-4">
                                    {renderMoney(points - PRICE)}
                                </div>

                                <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                                    {points} から {PRICE} を ひくと {points - PRICE} に なるよ。<br />
                                    つぎは がんばろう！<br />
                                    （でも おともだち に できるよ！）
                                </p>
                            </div>
                            <AppButton color="red" className="w-full text-2xl" onClick={() => {
                                playSound('levelUp');
                                executePurchase();
                                setStage('success');
                            }}>
                                おともだち に する
                            </AppButton>
                        </motion.div>
                    )}

                    {stage === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0, opacity: 0, rotate: 180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            className="bg-white p-12 rounded-[3rem] text-center border-8 border-pink-400 shadow-[0_0_100px_rgba(255,192,203,0.5)] flex flex-col items-center"
                        >
                            <motion.div
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                className="text-8xl mb-6 text-pop-green"
                            >
                                <Check className="w-32 h-32" />
                            </motion.div>
                            <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-pink-400 mb-8 justify-center shadow-inner">
                                <img src={imagePreview!} alt="Friend" className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
                                あたらしい おともだち が<br />マイルーム に きたよ！
                            </h2>

                            <div className="flex gap-4 w-full justify-center">
                                <AppButton color="yellow" className="text-2xl flex-1" onClick={handleReset}>
                                    もっと とる
                                </AppButton>
                                <AppButton color="blue" className="text-2xl flex-1" onClick={() => router.push('/room')}>
                                    マイルームへ
                                </AppButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
