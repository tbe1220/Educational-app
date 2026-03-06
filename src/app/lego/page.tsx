"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInventoryStore } from "@/store/useInventoryStore";
import AppButton from "@/components/ui/Button";
import { playSound, speakJapanese } from "@/lib/utils/audio";
import { ArrowLeft, Camera, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LegoTransformPage() {
    const router = useRouter();
    const [resultData, setResultData] = useState<{ name: string; type: string; power: number } | null>(null);

    const { addItem } = useInventoryStore();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedItem, setGeneratedItem] = useState<any | null>(null);
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
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                speakJapanese("すごい！ これを アイテムに かえるよ。");
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = async () => {
        if (!imagePreview) return;
        playSound('click');
        setIsProcessing(true);
        speakJapanese("まほうを かけているよ。すこし まってね。");

        try {
            const res = await fetch('/api/lego', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: imagePreview })
            });

            if (!res.ok) throw new Error("API request failed");

            const data = await res.json();
            setGeneratedItem(data);
            setResultData(data);
            if (data.type === 'weapon') {
                addItem('weapon', data);
            } else {
                addItem('furniture', data);
            }
            playSound('levelUp');
            speakJapanese(`${data.name} が できたよ！`);

            // Add to inventory (we mint a new UUID for the store but use a generic logic since it's dynamic)
            // For a real app, dynamic items need to be pushed to the ALL_ITEMS map or the inventory store needs to handle custom items.
            // Here, we just hack the ID format to bypass strict GameItem checks in Room/Shop momentarily, or ideally we'd implement custom items.
            console.log("Generated:", data);

        } catch (err) {
            console.error(err);
            playSound('wrong');
            speakJapanese("えらーが おきたみたい。もういっかい やってみてね。");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setImagePreview(null);
        setGeneratedItem(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col p-4 md:p-8 items-center relative overflow-hidden">

            {/* Laser grid bg */}
            <div className="absolute inset-0 z-0 opacity-20" style={{
                backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.5) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="w-full flex justify-start z-10 mb-8">
                <button
                    onClick={() => {
                        playSound('click');
                        router.push('/');
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 shadow-md font-bold text-gray-300 hover:bg-white/20"
                >
                    <ArrowLeft /> まちへ もどる
                </button>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8 drop-shadow-lg z-10 flex items-center gap-4">
                <Sparkles className="text-yellow-400 w-12 h-12" /> キミの おもちゃを アイテムに！
            </h1>

            <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center z-10">

                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                <AnimatePresence mode="wait">
                    {!imagePreview && (
                        <motion.div
                            key="capture"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <AppButton
                                color="green"
                                size="xl"
                                onClick={handleCaptureClick}
                                className="flex flex-col items-center gap-6 py-16 px-24 bg-gradient-to-br from-green-500 to-emerald-700 shadow-green-900"
                            >
                                <Camera className="w-24 h-24" />
                                <span className="text-4xl">カメラを きどう</span>
                            </AppButton>
                            <p className="text-white text-xl mt-8 text-center bg-black/50 p-4 rounded-full">
                                レゴなどの おもちゃの しゃしんを とろう！
                            </p>
                        </motion.div>
                    )}

                    {imagePreview && !generatedItem && (
                        <motion.div
                            key="preview"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col items-center border-8 border-white p-4 rounded-3xl bg-black/50"
                        >
                            <img src={imagePreview} alt="Preview" className="max-w-full md:max-w-lg rounded-2xl mb-8 object-cover max-h-[50vh]" />

                            <div className="flex gap-4 w-full justify-center">
                                <AppButton color="red" onClick={handleReset} disabled={isProcessing}>
                                    とりなおす
                                </AppButton>
                                <AppButton color="blue" onClick={processImage} disabled={isProcessing} className="flex items-center gap-2">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                    {isProcessing ? "へんしん中..." : "これにする"}
                                </AppButton>
                            </div>
                        </motion.div>
                    )}

                    {generatedItem && (
                        <motion.div
                            key="result"
                            initial={{ scale: 0, opacity: 0, rotate: 180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            className="bg-white p-12 rounded-[3rem] text-center border-8 border-yellow-400 shadow-[0_0_100px_rgba(255,255,0,0.5)]"
                        >
                            <h2 className="text-4xl font-bold text-gray-800 mb-6 drop-shadow-sm">かんせい！</h2>
                            <div className="text-9xl mb-6 drop-shadow-xl">{generatedItem.emoji}</div>
                            <h3 className="text-5xl font-black text-pop-red mb-4">{generatedItem.name}</h3>
                            <p className="text-2xl text-gray-600 font-bold mb-8">
                                つよさ： <span className="text-3xl text-pop-blue">{generatedItem.power}</span>
                                <br />
                                しゅるい： <span className="text-xl">{generatedItem.type === 'weapon' ? 'ぶき' : 'かぐ'}</span>
                            </p>

                            <AppButton color="yellow" onClick={() => router.push('/')} size="xl">
                                まちへ もどる
                            </AppButton>
                        </motion.div>
                    )}

                </AnimatePresence>

            </div>
        </div>
    );
}
