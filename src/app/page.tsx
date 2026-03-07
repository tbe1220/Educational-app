"use client";

import { motion } from "framer-motion";
import AppButton from "@/components/ui/Button";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Swords, Home, ShoppingCart, Lightbulb, Calculator, BookOpen, Mic, Camera, KeyRound, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginRegister from "@/components/profile/LoginRegister";

export default function TopPage() {
  const router = useRouter();
  const { hp, maxHp, points, level, name, pin, userId, difficulty, setDifficulty, enemyAttackTime, setEnemyAttackTime } = usePlayerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!userId) {
    return <LoginRegister onComplete={() => setMounted(true)} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-pop-yellow selection:text-black">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-pop-blue/20 via-white to-pop-yellow/20 pointer-events-none" />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-32 h-32 bg-pop-blue/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-48 h-48 bg-pop-yellow/20 rounded-full blur-3xl"
      />

      {/* Header Stat Bar */}
      <div className="absolute inset-x-0 top-0 p-4 md:p-8 flex justify-between items-start z-10 w-full max-w-7xl mx-auto">
        {/* Profile Group */}
        <div className="flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] p-4 shadow-lg border-4 border-pop-yellow flex items-center gap-4">
            <div className="w-16 h-16 bg-pop-orange rounded-full flex items-center justify-center text-white text-2xl font-black shadow-inner border-4 border-orange-300">
              Lv.{level}
            </div>
            <div>
              <div className="font-bold text-gray-500 text-sm flex items-center gap-2">
                <span>ゆうしゃ</span>
                <span className={`px-2 py-0.5 rounded-full text-xs text-white ${difficulty === 'easy' ? 'bg-green-500' : difficulty === 'normal' ? 'bg-blue-500' : 'bg-red-500'}`}>
                  {difficulty === 'easy' ? 'やさしい' : difficulty === 'normal' ? 'ふつう' : 'むずかしい'}
                </span>
              </div>
              <div className="text-2xl font-black text-gray-800 tracking-wider">
                {name}
              </div>
            </div>

            <div className="ml-4 pl-4 border-l-4 border-gray-100 flex flex-col items-center">
              <span className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1"><KeyRound className="w-3 h-3" /> あいことば</span>
              <span className="text-xl font-mono font-bold text-pop-blue tracking-widest">{pin}</span>
            </div>
          </div>

          {/* Stats Below */}
          <div className="flex gap-4">
            <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-md border-4 border-pop-red">
              <div className="text-xs font-bold text-pop-red mb-1">たいりょく (HP)</div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-pop-red"
                  animate={{ width: `${(hp / maxHp) * 100}%` }}
                />
              </div>
              <div className="text-right text-sm font-bold mt-1">{hp} / {maxHp}</div>
            </div>

            <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-md border-4 border-pop-yellow">
              <div className="text-xs font-bold text-orange-500 mb-1">ぽいんと</div>
              <div className="text-xl font-black text-gray-800 text-center">{points}</div>
            </div>
          </div>
        </div>

        {/* Settings Buttons Group */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              const cycles = [10, 15, 20, 30];
              const idx = cycles.indexOf(enemyAttackTime);
              setEnemyAttackTime(cycles[(idx + 1) % cycles.length] || 20);
            }}
            className="bg-white/80 p-3 rounded-2xl shadow-md text-gray-500 hover:text-pop-red transition-colors flex flex-col items-center justify-center font-black min-w-[4rem]"
            title="てきの こうげきじかん (びょう)"
          >
            <span className="text-xs text-pop-red">じかん</span>
            <span>{enemyAttackTime}s</span>
          </button>

          <button
            onClick={() => {
              const cycle = { 'easy': 'normal', 'normal': 'hard', 'hard': 'easy' } as const;
              setDifficulty(cycle[difficulty]);
            }}
            className="bg-white/80 p-3 rounded-full shadow-md text-gray-500 hover:text-pop-blue transition-colors flex items-center justify-center"
            title="むずかしさを かえる"
          >
            <Settings className="w-8 h-8" />
          </button>
        </div>
      </div>

      <div className="z-10 w-full max-w-4xl mt-24 flex flex-col items-center gap-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pop-red via-pop-orange to-pop-yellow drop-shadow-sm mb-4">
            だましんえん
          </h1>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground drop-shadow-sm">
            まなびの だいぼうけん
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-bold text-gray-500">
            すきな ぼうけんを えらぼう！
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
          <AppButton
            color="red"
            className="flex flex-col items-center justify-center gap-4 py-12"
            onClick={() => router.push('/battle')}
          >
            <Swords className="w-16 h-16" />
            バトルにいく
          </AppButton>

          <AppButton
            color="blue"
            className="flex flex-col items-center justify-center gap-4 py-12"
            onClick={() => router.push('/study/math')}
          >
            <Calculator className="w-16 h-16" />
            さんすう
          </AppButton>

          <AppButton
            color="green"
            className="flex flex-col items-center justify-center gap-4 py-12"
            onClick={() => router.push('/study/language')}
          >
            <BookOpen className="w-16 h-16" />
            国語 (こくご) / ひらがな
            {/* 漢字禁止のため、表示はひらがなのみへ。ここは一旦ひらがなのみにする */}
            <span className="text-2xl mt-[-10px]">ひらがな</span>
          </AppButton>

          <AppButton
            color="purple"
            className="flex flex-col items-center justify-center gap-4 py-12"
            onClick={() => router.push('/study/english')}
          >
            <Mic className="w-16 h-16" />
            えいご
          </AppButton>

          <AppButton
            color="orange"
            className="flex flex-col items-center justify-center gap-4 py-12"
            onClick={() => router.push('/room')}
          >
            <Home className="w-16 h-16" />
            マイルーム
          </AppButton>

          <AppButton
            color="yellow"
            className="flex flex-col items-center justify-center gap-4 py-12"
            onClick={() => router.push('/shop')}
          >
            <ShoppingCart className="w-16 h-16" />
            おかいもの
          </AppButton>

          <AppButton
            color="red"
            className="flex flex-col items-center justify-center gap-4 py-12 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-red-500 to-pop-red hover:from-red-600 hover:to-red-500 shadow-red-500"
            onClick={() => router.push('/lego')}
          >
            <Camera className="w-16 h-16" />
            おもちゃを カメラで うつす (LEGOへんしん)
          </AppButton>
        </div>
      </div>
    </div>
  );
}
