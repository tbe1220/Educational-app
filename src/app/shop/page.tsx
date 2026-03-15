"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { ALL_ITEMS, GameItem } from "@/data/items";
import AppButton from "@/components/ui/Button";
import { playSound, speakJapanese } from "@/lib/utils/audio";
import { ArrowLeft, Coins, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
    const router = useRouter();
    const { points, removePoints } = usePlayerStore();
    const { ownedWeapons, ownedFurniture, addItem } = useInventoryStore();

    const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
    const [purchaseStage, setPurchaseStage] = useState<'browse' | 'confirm' | 'math' | 'success'>('browse');

    // Math learning state
    const [userChangeInput, setUserChangeInput] = useState<string>("");

    const handleSelectItem = (item: GameItem) => {
        playSound('click');
        setSelectedItem(item);
        setPurchaseStage('confirm');
    };

    const handleStartPurchaseMath = () => {
        playSound('click');
        if (points >= selectedItem!.price) {
            setPurchaseStage('math');
            setUserChangeInput("");
            speakJapanese(`おつりは いくら かな？`);
        } else {
            playSound('wrong');
            speakJapanese("ぽいんと が たりないみたい。");
        }
    };

    const handleMathSubmit = () => {
        if (!selectedItem) return;
        const correctChange = points - selectedItem.price;
        const userAnswer = parseInt(userChangeInput, 10);

        if (userAnswer === correctChange) {
            playSound('correct');
            // Execute purchase
            removePoints(selectedItem.price);
            addItem(selectedItem.type, selectedItem.id);
            setPurchaseStage('success');
            speakJapanese("ありがとう！ また きてね。");
        } else {
            playSound('wrong');
            speakJapanese(`ちがうみたい。 ${points} から ${selectedItem.price} を ひくと...`);
        }
    };

    return (
        <div className="min-h-screen bg-pop-yellow/20 flex flex-col p-4 md:p-8 items-center relative">
            <div className="w-full max-w-5xl flex justify-between z-10 mb-8">
                <button
                    onClick={() => {
                        playSound('click');
                        router.push('/');
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-md font-bold text-gray-500 hover:bg-gray-50"
                >
                    <ArrowLeft /> まちへ もどる
                </button>
                <div className="bg-pop-yellow text-gray-800 px-6 py-2 rounded-xl font-bold text-2xl shadow-sm border-b-4 border-[#cca529] flex items-center gap-2">
                    <Coins className="text-orange-500" />
                    {points} ぽいんと
                </div>
            </div>

            <h1 className="text-5xl font-black text-pop-orange mb-8 drop-shadow-md">おみせやさん</h1>

            {purchaseStage === 'browse' && (
                <div className="w-full max-w-5xl flex flex-col gap-12">
                    {/* Weapons Section */}
                    <div className="bg-blue-50/50 p-6 rounded-[2rem] border-4 border-blue-100">
                        <h2 className="text-3xl font-bold text-pop-blue mb-6 flex items-center gap-2">
                            <span>⚔️</span> ぶき を かう (そうび する)
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {ALL_ITEMS.filter(i => i.type === 'weapon').map(item => {
                                const isOwned = ownedWeapons.includes(item.id);
                                const canAfford = points >= item.price;
                                return (
                                    <motion.div
                                        key={item.id}
                                        whileHover={!isOwned ? { scale: 1.05 } : {}}
                                        whileTap={!isOwned ? { scale: 0.95 } : {}}
                                        onClick={() => !isOwned && handleSelectItem(item)}
                                        className={`
                                            p-4 rounded-3xl border-4 shadow-md flex flex-col items-center justify-between text-center cursor-pointer min-h-[160px]
                                            ${isOwned ? 'bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed' :
                                                canAfford ? 'bg-white border-pop-blue hover:border-blue-400' : 'bg-red-50 border-red-200'}
                                        `}
                                    >
                                        <div className="text-5xl mb-2">{item.emoji}</div>
                                        <div className="font-bold text-gray-700 text-sm h-10">{item.name}</div>
                                        {isOwned ? (
                                            <div className="mt-2 text-gray-500 font-bold bg-gray-300 px-3 py-1 rounded-full text-xs">もってる</div>
                                        ) : (
                                            <div className={`mt-2 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 ${canAfford ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-500'}`}>
                                                <Coins className="w-3 h-3" /> {item.price}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Furniture Section */}
                    <div className="bg-orange-50/50 p-6 rounded-[2rem] border-4 border-orange-100 mb-12">
                        <h2 className="text-3xl font-bold text-pop-orange mb-6 flex items-center gap-2">
                            <span>🪑</span> かぐ を かう (おへや に おく)
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {ALL_ITEMS.filter(i => i.type === 'furniture').map(item => {
                                const isOwned = ownedFurniture.includes(item.id);
                                const canAfford = points >= item.price;
                                return (
                                    <motion.div
                                        key={item.id}
                                        whileHover={!isOwned ? { scale: 1.05 } : {}}
                                        whileTap={!isOwned ? { scale: 0.95 } : {}}
                                        onClick={() => !isOwned && handleSelectItem(item)}
                                        className={`
                                            p-4 rounded-3xl border-4 shadow-md flex flex-col items-center justify-between text-center cursor-pointer min-h-[160px]
                                            ${isOwned ? 'bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed' :
                                                canAfford ? 'bg-white border-pop-orange hover:border-orange-400' : 'bg-red-50 border-red-200'}
                                        `}
                                    >
                                        <div className="text-5xl mb-2">{item.emoji}</div>
                                        <div className="font-bold text-gray-700 text-sm h-10">{item.name}</div>
                                        {isOwned ? (
                                            <div className="mt-2 text-gray-500 font-bold bg-gray-300 px-3 py-1 rounded-full text-xs">もってる</div>
                                        ) : (
                                            <div className={`mt-2 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 ${canAfford ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-500'}`}>
                                                <Coins className="w-3 h-3" /> {item.price}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Friends Section */}
                    <div className="bg-pink-50/50 p-6 rounded-[2rem] border-4 border-pink-100 mb-12">
                        <h2 className="text-3xl font-bold text-pink-500 mb-6 flex items-center gap-2">
                            <span>💖</span> おともだち に なる (おへや に よぶ)
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {ALL_ITEMS.filter(i => i.type === 'friend').map(item => {
                                const isOwned = useInventoryStore.getState().ownedFriends.includes(item.id);
                                const canAfford = points >= item.price;
                                return (
                                    <motion.div
                                        key={item.id}
                                        whileHover={!isOwned ? { scale: 1.05 } : {}}
                                        whileTap={!isOwned ? { scale: 0.95 } : {}}
                                        onClick={() => !isOwned && handleSelectItem(item)}
                                        className={`
                                            p-4 rounded-3xl border-4 shadow-md flex flex-col items-center justify-between text-center cursor-pointer min-h-[160px]
                                            ${isOwned ? 'bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed' :
                                                canAfford ? 'bg-white border-pink-400 hover:border-pink-500' : 'bg-red-50 border-red-200'}
                                        `}
                                    >
                                        <div className="text-5xl mb-2">{item.emoji}</div>
                                        <div className="font-bold text-gray-700 text-sm h-10">{item.name}</div>
                                        {isOwned ? (
                                            <div className="mt-2 text-gray-500 font-bold bg-gray-300 px-3 py-1 rounded-full text-xs">なかま</div>
                                        ) : (
                                            <div className={`mt-2 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 ${canAfford ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-500'}`}>
                                                <Coins className="w-3 h-3" /> {item.price}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {(purchaseStage === 'confirm' || purchaseStage === 'math' || purchaseStage === 'success') && selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl w-full flex flex-col items-center shadow-2xl border-8 border-pop-yellow"
                        >

                            {purchaseStage === 'confirm' && (
                                <>
                                    <div className="text-8xl mb-6">{selectedItem.emoji}</div>
                                    <h2 className="text-4xl font-bold text-gray-800 mb-2">{selectedItem.name}</h2>
                                    <p className="text-2xl text-orange-500 font-bold mb-8 flex items-center gap-2">
                                        <Coins /> {selectedItem.price} ぽいんと
                                    </p>

                                    <div className="flex gap-4 w-full">
                                        <AppButton color="red" className="flex-1 text-2xl" onClick={() => { playSound('click'); setPurchaseStage('browse') }}>やめる</AppButton>
                                        <AppButton color="green" className="flex-1 text-2xl" onClick={handleStartPurchaseMath} disabled={points < selectedItem.price}>かう</AppButton>
                                    </div>
                                    {points < selectedItem.price && (
                                        <p className="text-red-500 font-bold mt-4 animate-bounce">ぽいんと が たりないよ！</p>
                                    )}
                                </>
                            )}

                            {purchaseStage === 'math' && (
                                <>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-pop-blue pb-4 w-full text-center">
                                        さんすう もんだい
                                    </h2>

                                    <div className="text-4xl font-extrabold mb-8 flex flex-col items-center gap-4 w-full bg-blue-50 p-6 rounded-3xl">
                                        <div className="flex justify-between w-full text-pop-blue">
                                            <span>もっている おかね:</span>
                                            <span>{points}</span>
                                        </div>
                                        <div className="flex justify-between w-full text-pop-red border-b-4 border-gray-400 pb-2">
                                            <span>ひく (ねだん):</span>
                                            <span>- {selectedItem.price}</span>
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
                                        <AppButton color="red" className="flex-1 text-2xl" onClick={() => { playSound('click'); setPurchaseStage('browse') }}>もどる</AppButton>
                                        <AppButton color="blue" className="flex-1 text-2xl" onClick={handleMathSubmit} disabled={userChangeInput === ""}>こたえる</AppButton>
                                    </div>
                                </>
                            )}

                            {purchaseStage === 'success' && (
                                <>
                                    <motion.div
                                        initial={{ rotate: -180, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        className="text-8xl mb-6 text-pop-green"
                                    >
                                        <Check className="w-32 h-32" />
                                    </motion.div>
                                    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
                                        「{selectedItem.name}」 を<br />てにいれた！
                                    </h2>
                                    <AppButton color="yellow" className="w-full text-2xl" onClick={() => { playSound('click'); setPurchaseStage('browse'); setSelectedItem(null) }}>
                                        もっと かう
                                    </AppButton>
                                </>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
