import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { ALL_ITEMS } from '@/data/items';
import { usePlayerStore } from './usePlayerStore';

export interface RoomItem {
    id: string; // unique instance id
    itemId: string; // reference to GameItem struct
    x: number;
    y: number;
}

interface InventoryState {
    ownedWeapons: string[];
    ownedFurniture: string[];
    ownedFriends: string[];
    ownedTops: string[];
    ownedBottoms: string[];
    roomItems: RoomItem[];
    addItem: (itemType: 'weapon' | 'furniture' | 'friend' | 'top' | 'bottom', itemId: string) => void;
    moveRoomItem: (id: string, x: number, y: number) => void;
    placeRoomItem: (itemId: string, x: number, y: number) => void;
    removeRoomItem: (id: string) => void;
    loadInventory: (userId: string) => Promise<void>;
}
export const useInventoryStore = create<InventoryState>((set, get) => {
    // Helper to add inventory record to DB
    const addDbItem = async (type: string, id: string) => {
        const userId = usePlayerStore.getState().userId;
        if (!userId) return;
        await supabase.from('inventory').insert([{ user_id: userId, item_type: type, item_id: id }]);
    };

    // Helper to save room item to DB
    const placeDbItem = async (id: string, itemId: string, x: number, y: number) => {
        const userId = usePlayerStore.getState().userId;
        if (!userId) return;
        try {
            const { error } = await supabase.from('room_items').insert([{ id, user_id: userId, item_id: itemId, x, y }]);
            if (error) console.error("Error inserting room item:", error);
        } catch (e) {
            console.error("Exception inserting room item:", e);
        }
    };

    // Helper to update room item pos
    const updateDbItem = async (id: string, x: number, y: number) => {
        try {
            const { error } = await supabase.from('room_items').update({ x, y }).eq('id', id);
            if (error) console.error("Error updating room item:", error);
        } catch (e) {
            console.error("Exception updating room item:", e);
        }
    };

    // Helper to request item removal
    const removeDbItem = async (id: string) => {
        try {
            const { error } = await supabase.from('room_items').delete().eq('id', id);
            if (error) console.error("Error deleting room item:", error);
        } catch (e) {
            console.error("Exception deleting room item:", e);
        }
    };

    return {
        ownedWeapons: [],
        ownedFurniture: [],
        ownedFriends: [],
        ownedTops: [],
        ownedBottoms: [],
        roomItems: [],
        addItem: (itemTypeArg, itemId) => { // Renamed itemType to itemTypeArg to avoid shadowing
            set((state) => {
                const itemType = ALL_ITEMS.find(i => i.id === itemId)?.type; // Derives itemType from ALL_ITEMS
                if (itemType === 'weapon' && !state.ownedWeapons.includes(itemId)) {
                    addDbItem('weapon', itemId);
                    return { ownedWeapons: [...state.ownedWeapons, itemId] };
                }
                if (itemType === 'furniture' && !state.ownedFurniture.includes(itemId)) {
                    addDbItem('furniture', itemId);
                    return { ownedFurniture: [...state.ownedFurniture, itemId] };
                }
                if (itemType === 'friend' && !state.ownedFriends.includes(itemId)) {
                    addDbItem('friend', itemId);
                    return { ownedFriends: [...state.ownedFriends, itemId] };
                }
                if (itemType === 'top' && !state.ownedTops.includes(itemId)) {
                    addDbItem('top', itemId);
                    return { ownedTops: [...state.ownedTops, itemId] };
                }
                if (itemType === 'bottom' && !state.ownedBottoms.includes(itemId)) {
                    addDbItem('bottom', itemId);
                    return { ownedBottoms: [...state.ownedBottoms, itemId] };
                }
                return state;
            });
        },
        moveRoomItem: (id, x, y) => {
            set((state) => ({
                roomItems: state.roomItems.map(item =>
                    item.id === id ? { ...item, x, y } : item
                )
            }));
            updateDbItem(id, x, y);
        },
        placeRoomItem: (itemId, x, y) => {
            const id = crypto.randomUUID();
            set((state) => ({
                roomItems: [...state.roomItems, { id, itemId, x, y }]
            }));
            placeDbItem(id, itemId, x, y);
        },
        removeRoomItem: (id) => {
            set((state) => ({
                roomItems: state.roomItems.filter(item => item.id !== id)
            }));
            removeDbItem(id);
        },
        loadInventory: async (userId: string) => {
            try {
                const { data: inventoryData } = await supabase.from('inventory').select('*').eq('user_id', userId);
                const { data: roomData } = await supabase.from('room_items').select('*').eq('user_id', userId);

                const weapons = ['w1']; // Default weapon
                const furniture: string[] = [];
                const friends: string[] = [];
                const tops = ['t1'];    // Default top
                const bottoms = ['b1']; // Default bottom

                inventoryData?.forEach((inv: any) => {
                    const type = ALL_ITEMS.find(i => i.id === inv.item_id)?.type;
                    if (type === 'weapon' && !weapons.includes(inv.item_id)) {
                        weapons.push(inv.item_id);
                    } else if (type === 'furniture' && !furniture.includes(inv.item_id)) {
                        furniture.push(inv.item_id);
                    } else if (type === 'friend' && !friends.includes(inv.item_id)) {
                        friends.push(inv.item_id);
                    } else if (type === 'top' && !tops.includes(inv.item_id)) {
                        tops.push(inv.item_id);
                    } else if (type === 'bottom' && !bottoms.includes(inv.item_id)) {
                        bottoms.push(inv.item_id);
                    }
                });

                const parsedRoom: RoomItem[] = roomData?.map(r => ({
                    id: r.id,
                    itemId: r.item_id,
                    x: r.x,
                    y: r.y
                })) || [];

                set({ ownedWeapons: weapons, ownedFurniture: furniture, ownedFriends: friends, ownedTops: tops, ownedBottoms: bottoms, roomItems: parsedRoom });
            } catch (err) {
                console.error(err);
            }
        }
    };
});
