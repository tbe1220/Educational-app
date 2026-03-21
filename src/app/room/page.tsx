"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { ALL_ITEMS } from "@/data/items";
import { playSound } from "@/lib/utils/audio";
import { ArrowLeft, User, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import AppButton from "@/components/ui/Button";

const DraggableRoomItem = ({ instance, itemInfo, roomRef }: { instance: any, itemInfo: any, roomRef: any }) => {
    // Bind Framer Motion's internal state directly to the saved position
    const x = useMotionValue(instance.x);
    const y = useMotionValue(instance.y);

    // Sync if db somehow drastically changed externally
    useEffect(() => {
        x.set(instance.x);
        y.set(instance.y);
    }, [instance.x, instance.y, x, y]);

    return (
        <motion.div
            drag
            dragConstraints={roomRef}
            dragMomentum={false}
            style={{
                position: 'absolute',
                x,
                y,
                touchAction: 'none'
            }}
            onDragEnd={() => {
                const xVal = x.get();
                const yVal = y.get();

                // Bad guys trap hole feature
                const BAD_GUY_IDS = ['fr16', 'fr17', 'fr18', 'fr19', 'fr20', 'fr21'];
                if (BAD_GUY_IDS.includes(instance.itemId)) {
                    const store = useInventoryStore.getState();
                    const trapHoles = store.roomItems.filter((item: any) => item.itemId === 'f12');

                    let fellIntoHole = false;
                    for (const hole of trapHoles) {
                        const dx = hole.x - xVal;
                        const dy = hole.y - yVal;
                        const distance = Math.hypot(dx, dy);
                        // 80 pixels is a generous overlap radius for 100x100 items
                        if (distance < 80) {
                            fellIntoHole = true;
                            break;
                        }
                    }

                    if (fellIntoHole) {
                        playSound('wrong');
                        // Simulate falling in
                        store.removeRoomItem(instance.id);
                        return;
                    }
                }

                playSound('click');
                // Read the exact sub-pixel x/y from framer-motion to prevent jumping!
                useInventoryStore.getState().moveRoomItem(instance.id, xVal, yVal);
            }}
            whileDrag={{ scale: 1.1, zIndex: 50 }}
            className="cursor-move drop-shadow-xl z-10 group"
        >
            {itemInfo.dataUrl ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-400 bg-white shadow-md relative">
                    <img src={itemInfo.dataUrl} alt={itemInfo.name} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="text-7xl">{itemInfo.emoji}</div>
            )}

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    playSound('click');
                    useInventoryStore.getState().removeRoomItem(instance.id);
                }}
                onTouchEnd={(e) => {
                    e.stopPropagation(); // prevent drag context issue on mobile
                }}
                className="absolute -top-2 -right-2 bg-pop-red text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md md:opacity-0 md:group-hover:opacity-100 transition-opacity z-50 border-2 border-white"
                aria-label="かたづける"
            >
                ✕
            </button>
        </motion.div>
    );
};

export default function MyRoomPage() {
    const router = useRouter();
    const { hp, maxHp, points, level, equippedWeaponId, equipWeapon, equippedTopId, equippedBottomId, equipTop, equipBottom } = usePlayerStore();
    const { ownedWeapons, ownedFurniture, ownedFriends, customFriends, ownedTops, ownedBottoms, roomItems, placeRoomItem, moveRoomItem } = useInventoryStore();

    const [activeTab, setActiveTab] = useState<'room' | 'inventory'>('room');
    const roomRef = useRef<HTMLDivElement>(null);

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
    const equippedTopInfo = ALL_ITEMS.find(i => i.id === equippedTopId) || { emoji: '👕' };
    const equippedBottomInfo = ALL_ITEMS.find(i => i.id === equippedBottomId) || { emoji: '👖' };

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
                    className={`flex-1 relative transition-opacity duration-300 overflow-auto scroll-smooth ${activeTab === 'room' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    ref={roomRef}
                >
                    {/* Room Background Container (Expanded for scrolling) */}
                    <div className="absolute inset-4 md:inset-8 min-w-[150vw] min-h-[150vh] bg-sky-100 rounded-[3rem] shadow-inner border-8 border-orange-200 overflow-hidden flex">
                        {/* Left Side: Room (Indoors) */}
                        <div className="flex-1 h-full relative border-r-4 border-orange-300">
                            {/* Wall */}
                            <div className="absolute top-0 w-full h-1/2 bg-orange-100" />
                            {/* Floor */}
                            <div className="absolute bottom-0 w-full h-1/2 bg-amber-200 border-t-4 border-amber-300 pattern-isometric" />
                        </div>

                        {/* Right Side: Farm (Outdoors) */}
                        <div className="flex-1 h-full relative">
                            {/* Sky */}
                            <div className="absolute top-0 w-full h-1/2 bg-sky-200 overflow-hidden">
                                <div className="absolute top-10 right-10 text-6xl opacity-80">☁️</div>
                                <div className="absolute top-32 right-64 text-4xl opacity-60">☁️</div>
                                <div className="absolute top-20 left-32 text-7xl opacity-90">☁️</div>
                            </div>
                            {/* Farm Dirt */}
                            <div className="absolute bottom-0 w-full h-1/2 bg-amber-700 border-t-8 border-green-500 flex justify-center pt-16">
                                <div className="text-4xl text-amber-800 opacity-50 space-x-8">
                                    <span>〰️</span><span>〰️</span><span>〰️</span><span>〰️</span><span>〰️</span>
                                </div>
                            </div>
                        </div>

                        {/* The Player Avatar resting in the room */}
                        <motion.div
                            drag
                            dragMomentum={false}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-move z-20"
                        >
                            <div className="flex flex-col items-center drop-shadow-xl relative leading-none">
                                <span className="text-8xl">👦</span>
                                <span className="text-7xl -mt-4">{equippedTopInfo.emoji}</span>
                                <span className="text-7xl -mt-6">{equippedBottomInfo.emoji}</span>
                                {/* Equipped Weapon Overlay */}
                                {equippedWeaponInfo && (
                                    <motion.div
                                        initial={{ rotate: -45, scale: 0 }}
                                        animate={{ rotate: 15, scale: 1 }}
                                        className="absolute -right-8 top-16 text-6xl drop-shadow-md z-30"
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
                            let itemInfo: any = ALL_ITEMS.find(i => i.id === instance.itemId);
                            if (!itemInfo) {
                                // check custom friends
                                itemInfo = customFriends?.find((c: any) => c.id === instance.itemId);
                                if (!itemInfo) return null;
                            }

                            return (
                                <DraggableRoomItem
                                    key={instance.id}
                                    instance={instance}
                                    itemInfo={itemInfo}
                                    roomRef={roomRef}
                                />
                            );
                        })}

                        {/* Trash Zone Guidance (Fixed to bottom right of viewport) */}
                        <div className="fixed bottom-6 right-6 bg-white/90 text-gray-700 px-6 py-3 rounded-2xl font-bold text-lg shadow-lg border-2 border-dashed border-pop-red flex flex-col items-center z-40 pointer-events-none backdrop-blur-sm">
                            <span className="text-3xl mb-1">🚮</span>
                            <span className="text-xs">アイテムの ✕ をおして</span>
                            <span className="text-sm text-pop-red">おかたづけ</span>
                        </div>
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
                            <h3 className="text-2xl font-bold text-pop-orange mb-4 border-b-4 border-orange-200 pb-2">かぐ・おともだち (おへや に おく)</h3>
                            <div className="flex gap-4 flex-wrap">
                                {ownedFurniture.length === 0 && ownedFriends.length === 0 ? <p className="text-gray-400 font-bold">まだ もっていないよ。</p> : null}

                                {/* Render Furniture */}
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

                                {/* Render Friends */}
                                {ownedFriends.map(fid => {
                                    const itemInfo = ALL_ITEMS.find(i => i.id === fid);
                                    if (!itemInfo) return null;
                                    return (
                                        <div
                                            key={fid}
                                            className="bg-pink-50 p-4 rounded-3xl border-4 border-pink-200 flex flex-col items-center w-40 text-center gap-2"
                                        >
                                            <div className="text-6xl mb-2">{itemInfo.emoji}</div>
                                            <div className="font-bold text-gray-700 text-sm h-10">{itemInfo.name}</div>
                                            <AppButton color="red" size="md" className="!py-2 !text-lg w-full" onClick={() => spawnFurniture(fid)}>
                                                へやに よぶ
                                            </AppButton>
                                        </div>
                                    )
                                })}

                                {/* Render Custom Photo Friends */}
                                {customFriends?.map((friend: any) => {
                                    return (
                                        <div
                                            key={friend.id}
                                            className="bg-pink-50/80 p-4 rounded-3xl border-4 border-pink-400 flex flex-col items-center w-40 text-center gap-2 relative shadow-sm"
                                        >
                                            <button
                                                onClick={() => {
                                                    playSound('click');
                                                    if (confirm("ほんとうに ばいばい する？（しゃしんが きえます）")) {
                                                        useInventoryStore.getState().removeCustomFriend(friend.id);
                                                    }
                                                }}
                                                className="absolute -top-2 -right-2 bg-gray-500 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md transition-colors z-20 border-2 border-white"
                                            >
                                                ✕
                                            </button>
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-300 mb-2">
                                                <img src={friend.dataUrl} alt={friend.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="font-bold text-gray-700 text-sm h-10">{friend.name}</div>
                                            <AppButton color="red" size="md" className="!py-2 !text-lg w-full" onClick={() => spawnFurniture(friend.id)}>
                                                へやに よぶ
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

                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-green-500 mb-4 border-b-4 border-green-200 pb-2">ふく (きがえる)</h3>
                            <div className="flex gap-4 flex-wrap">
                                {ownedTops.map(tid => {
                                    const itemInfo = ALL_ITEMS.find(i => i.id === tid);
                                    const isEquipped = tid === equippedTopId;
                                    if (!itemInfo) return null;
                                    return (
                                        <div key={tid} className={`${isEquipped ? 'bg-green-100 border-green-500' : 'bg-green-50 border-green-200'} p-4 rounded-3xl border-4 flex flex-col items-center w-40 text-center gap-2 relative`}>
                                            {isEquipped && <div className="absolute -top-4 -right-4 bg-pop-red text-white font-bold px-3 py-1 rounded-full text-xs animate-pulse">きている</div>}
                                            <div className="text-6xl mb-2">{itemInfo.emoji}</div>
                                            <div className="font-bold text-gray-700 text-sm h-10">{itemInfo.name}</div>
                                            <AppButton color={isEquipped ? 'yellow' : 'green'} size="md" className="!py-2 !text-lg w-full" onClick={() => { playSound('click'); equipTop(tid); }}>
                                                {isEquipped ? 'きている' : 'きる'}
                                            </AppButton>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-purple-500 mb-4 border-b-4 border-purple-200 pb-2">ズボン (はきかえる)</h3>
                            <div className="flex gap-4 flex-wrap">
                                {ownedBottoms.map(bid => {
                                    const itemInfo = ALL_ITEMS.find(i => i.id === bid);
                                    const isEquipped = bid === equippedBottomId;
                                    if (!itemInfo) return null;
                                    return (
                                        <div key={bid} className={`${isEquipped ? 'bg-purple-100 border-purple-500' : 'bg-purple-50 border-purple-200'} p-4 rounded-3xl border-4 flex flex-col items-center w-40 text-center gap-2 relative`}>
                                            {isEquipped && <div className="absolute -top-4 -right-4 bg-pop-red text-white font-bold px-3 py-1 rounded-full text-xs animate-pulse">はいている</div>}
                                            <div className="text-6xl mb-2">{itemInfo.emoji}</div>
                                            <div className="font-bold text-gray-700 text-sm h-10">{itemInfo.name}</div>
                                            <AppButton color={isEquipped ? 'yellow' : 'purple'} size="md" className="!py-2 !text-lg w-full" onClick={() => { playSound('click'); equipBottom(bid); }}>
                                                {isEquipped ? 'はいている' : 'はく'}
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
