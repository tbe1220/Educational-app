"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { ALL_ITEMS } from "@/data/items";
import { playSound } from "@/lib/utils/audio";
import { ArrowLeft, User, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import AppButton from "@/components/ui/Button";

export default function MyRoomPage() {
    const router = useRouter();
    const { hp, maxHp, points, level, equippedWeaponId, equipWeapon } = usePlayerStore();
    const { ownedWeapons, ownedFurniture, roomItems, placeRoomItem, moveRoomItem } = useInventoryStore();

    const [activeTab, setActiveTab] = useState<'room' | 'inventory'>('room');
    const roomRef = useRef<HTMLDivElement>(null);

    const handleDragEnd = (instanceId: string, event: any, info: any) => {
        playSound('click');
        const item = roomItems.find(i => i.id === instanceId);
        if (item) {
            moveRoomItem(instanceId, item.x + info.offset.x, item.y + info.offset.y);
        }
    };

    const spawnFurniture = (itemId: string) => {
        playSound('correct');
        // Spawn in center roughly
        const spawnX = Math.floor(Math.random() * 100) + 50;
        const spawnY = Math.floor(Math.random() * 100) + 50;
        placeRoomItem(itemId, spawnX, spawnY);
        setActiveTab('room'); // Switch back to see it
    };

    const handleEquip = (itemId: string) => {
        playSound('correct');
        equipWeapon(itemId);
    };

    const equippedWeaponInfo = ALL_ITEMS.find(i => i.id === equippedWeaponId);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden">

            {/* Top Bar */}
            <div className="w-full flex justify-between p-4 z-20 bg-white/80 backdrop-blur-md shadow-sm">
                <button
                    onClick={() => {
                        playSound('click');
                        router.push('/');
                    }}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-gray-100 shadow-sm font-bold text-gray-700 hover:bg-gray-200"
                >
                    <ArrowLeft /> まちへ もどる
                </button>

                <div className="flex gap-4">
                    <AppButton color={activeTab === 'room' ? 'blue' : 'yellow'} className="!text-xl !py-2 !px-4" size="md" onClick={() => setActiveTab('room')}>
                        おへや
                    </AppButton>
                    <AppButton color={activeTab === 'inventory' ? 'blue' : 'yellow'} className="!text-xl !py-2 !px-4" size="md" onClick={() => setActiveTab('inventory')}>
                        もちもの ({ownedFurniture.length + ownedWeapons.length})
                    </AppButton>
                </div>
            </div>

            <div className="flex-1 w-full flex relative">

                {/* ROOM VIEW */}
                <div
                    className={`flex-1 relative transition-opacity duration-300 ${activeTab === 'room' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    ref={roomRef}
                >
                    {/* Room Background */}
                    <div className="absolute inset-4 md:inset-8 bg-orange-100 rounded-[3rem] shadow-inner border-8 border-orange-200 overflow-hidden">
                        {/* Floor pattern */}
                        <div className="absolute bottom-0 w-full h-1/2 bg-amber-200 border-t-4 border-amber-300 pattern-isometric" />

                        {/* The Player Avatar resting in the room */}
                        <motion.div
                            drag
                            dragMomentum={false}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-move z-20"
                        >
                            <div className="text-8xl drop-shadow-xl relative">
                                👦
                                {/* Equipped Weapon Overlay */}
                                {equippedWeaponInfo && (
                                    <motion.div
                                        initial={{ rotate: -45, scale: 0 }}
                                        animate={{ rotate: 15, scale: 1 }}
                                        className="absolute -right-8 top-8 text-6xl drop-shadow-md z-30"
                                    >
                                        {equippedWeaponInfo.emoji}
                                    </motion.div>
                                )}
                            </div>
                            <div className="bg-white/80 px-4 py-1 rounded-full font-bold text-gray-700 mt-2 text-sm shadow-sm">
                                れべる {level}
                            </div>
                        </motion.div>

                        {/* Render placed furniture */}
                        {roomItems.map(instance => {
                            const itemInfo = ALL_ITEMS.find(i => i.id === instance.itemId);
                            if (!itemInfo) return null;

                            return (
                                <motion.div
                                    key={instance.id}
                                    drag
                                    dragMomentum={false}
                                    onDragEnd={(e, info) => handleDragEnd(instance.id, e, info)}
                                    initial={{ x: instance.x, y: instance.y, scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileDrag={{ scale: 1.1, zIndex: 50 }}
                                    className="absolute text-7xl cursor-move drop-shadow-xl z-10 group"
                                    style={{ x: instance.x, y: instance.y }}
                                >
                                    {itemInfo.emoji}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playSound('click');
                                            useInventoryStore.getState().removeRoomItem(instance.id);
                                        }}
                                        onTouchEnd={(e) => {
                                            e.stopPropagation(); // prevent drag end conflict usually, but click is better
                                        }}
                                        className="absolute -top-2 -right-2 bg-pop-red text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md md:opacity-0 md:group-hover:opacity-100 transition-opacity z-50 border-2 border-white"
                                        aria-label="かたづける"
                                    >
                                        ✕
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* INVENTORY VIEW */}
                <div className={`absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col p-8 transition-transform duration-500 ease-in-out ${activeTab === 'inventory' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
                    <h2 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                        <Menu className="w-10 h-10 text-pop-blue" />
                        もちもの リスト
                    </h2>

                    <div className="flex-1 overflow-y-auto">
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold text-pop-orange mb-4 border-b-4 border-orange-200 pb-2">かぐ (おへや に おく)</h3>
                            <div className="flex gap-4 flex-wrap">
                                {ownedFurniture.length === 0 ? <p className="text-gray-400 font-bold">まだ かぐ を もっていないよ。</p> : null}
                                {ownedFurniture.map(fid => {
                                    const itemInfo = ALL_ITEMS.find(i => i.id === fid);
                                    if (!itemInfo) return null;
                                    return (
                                        <div
                                            key={fid}
                                            className="bg-orange-50 p-4 rounded-3xl border-4 border-orange-200 flex flex-col items-center w-40 text-center gap-2"
                                            draggable
                                            onDragStart={(e) => e.dataTransfer.setData("itemId", fid)}
                                        >
                                            <div className="text-6xl mb-2">{itemInfo.emoji}</div>
                                            <div className="font-bold text-gray-700 text-sm h-10">{itemInfo.name}</div>
                                            <AppButton color="orange" size="md" className="!py-2 !text-lg w-full" onClick={() => spawnFurniture(fid)}>
                                                へやに おく
                                            </AppButton>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-pop-blue mb-4 border-b-4 border-blue-200 pb-2">ぶき (そうび する)</h3>
                            <div className="flex gap-4 flex-wrap">
                                {ownedWeapons.map(wid => {
                                    const itemInfo = ALL_ITEMS.find(i => i.id === wid);
                                    const isEquipped = wid === equippedWeaponId;
                                    if (!itemInfo) return null;
                                    return (
                                        <div key={wid} className={`${isEquipped ? 'bg-blue-100 border-pop-blue' : 'bg-blue-50 border-blue-200'} p-4 rounded-3xl border-4 flex flex-col items-center w-40 text-center gap-2 relative`}>
                                            {isEquipped && <div className="absolute -top-4 -right-4 bg-pop-red text-white font-bold px-3 py-1 rounded-full text-xs animate-pulse">そうび中</div>}
                                            <div className="text-6xl mb-2">{itemInfo.emoji}</div>
                                            <div className="font-bold text-gray-700 text-sm h-10">{itemInfo.name}</div>
                                            <AppButton color={isEquipped ? 'green' : 'blue'} size="md" className="!py-2 !text-lg w-full" onClick={() => handleEquip(wid)}>
                                                {isEquipped ? 'はずす' : 'もつ'}
                                            </AppButton>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
