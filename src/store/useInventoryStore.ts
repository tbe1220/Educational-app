import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
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
    roomItems: RoomItem[];
    addItem: (itemType: 'weapon' | 'furniture', itemId: string) => void;
    moveRoomItem: (id: string, x: number, y: number) => void;
    placeRoomItem: (itemId: string, x: number, y: number) => void;
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
        await supabase.from('room_items').insert([{ id: id, user_id: userId, item_id: itemId, x, y }]);
    };

    // Helper to update room item pos
    const updateDbItem = async (id: string, x: number, y: number) => {
        await supabase.from('room_items').update({ x, y }).eq('id', id);
    };

    return {
        ownedWeapons: [],
        ownedFurniture: [],
        roomItems: [],
        addItem: (itemType, itemId) => {
            set((state) => {
                if (itemType === 'weapon' && !state.ownedWeapons.includes(itemId)) {
                    addDbItem('weapon', itemId);
                    return { ownedWeapons: [...state.ownedWeapons, itemId] };
                }
                if (itemType === 'furniture' && !state.ownedFurniture.includes(itemId)) {
                    addDbItem('furniture', itemId);
                    return { ownedFurniture: [...state.ownedFurniture, itemId] };
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
        loadInventory: async (userId: string) => {
            try {
                const { data: invData } = await supabase.from('inventory').select('*').eq('user_id', userId);
                const { data: roomData } = await supabase.from('room_items').select('*').eq('user_id', userId);

                const weapons = invData?.filter(i => i.item_type === 'weapon').map(i => i.item_id) || [];
                const furniture = invData?.filter(i => i.item_type === 'furniture').map(i => i.item_id) || [];

                const parsedRoom: RoomItem[] = roomData?.map(r => ({
                    id: r.id,
                    itemId: r.item_id,
                    x: r.x,
                    y: r.y
                })) || [];

                set({ ownedWeapons: weapons, ownedFurniture: furniture, roomItems: parsedRoom });
            } catch (err) {
                console.error(err);
            }
        }
    };
});
