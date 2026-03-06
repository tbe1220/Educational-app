import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type Difficulty = 'easy' | 'normal' | 'hard';

interface PlayerState {
    userId: string | null;
    pin: string | null;
    name: string;
    difficulty: Difficulty;
    hp: number;
    maxHp: number;
    points: number;
    level: number;
    equippedWeaponId: string | null;

    setProfile: (userId: string, pin: string, name: string, difficulty: Difficulty) => void;
    setDifficulty: (difficulty: Difficulty) => void;
    addPoints: (amount: number) => void;
    removePoints: (amount: number) => boolean;
    addLevel: (amount: number) => void;
    equipWeapon: (weaponId: string) => void;
    heal: (amount: number) => void;
    takeDamage: (amount: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
    // Helper to sync to DB without blocking UI
    const syncToDb = async (updates: Partial<PlayerState>) => {
        const userId = get().userId;
        if (!userId) return;
        try {
            // Map JS camelCase to Postgres snake_case assuming standard Mapping
            const dbUpdates: any = {};
            if (updates.hp !== undefined) dbUpdates.hp = updates.hp;
            if (updates.maxHp !== undefined) dbUpdates.max_hp = updates.maxHp;
            if (updates.points !== undefined) dbUpdates.points = updates.points;
            if (updates.level !== undefined) dbUpdates.level = updates.level;
            if (updates.equippedWeaponId !== undefined) dbUpdates.equipped_weapon_id = updates.equippedWeaponId;
            if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;

            await supabase.from('profiles').update(dbUpdates).eq('id', userId);
        } catch (err) {
            console.error('Failed to sync state', err);
        }
    };

    return {
        userId: null,
        pin: null,
        name: 'ゆうしゃ',
        difficulty: 'normal',
        hp: 100,
        maxHp: 100,
        points: 0,
        level: 1,
        equippedWeaponId: null,

        setProfile: (userId, pin, name, difficulty) => set({ userId, pin, name, difficulty }),

        setDifficulty: (difficulty) => {
            set({ difficulty });
            syncToDb({ difficulty });
        },

        takeDamage: (amount) => set((state) => {
            const newHp = Math.max(0, state.hp - amount);
            if (newHp !== state.hp) syncToDb({ hp: newHp });
            return { hp: newHp };
        }),

        heal: (amount) => set((state) => {
            const newHp = Math.min(state.maxHp, state.hp + amount);
            if (newHp !== state.hp) syncToDb({ hp: newHp });
            return { hp: newHp };
        }),

        addPoints: (amount) => set((state) => {
            const newPoints = state.points + amount;
            syncToDb({ points: newPoints });
            return { points: newPoints };
        }),

        removePoints: (amount) => {
            const state = get();
            if (state.points >= amount) {
                const newPoints = state.points - amount;
                set({ points: newPoints });
                syncToDb({ points: newPoints });
                return true;
            }
            return false;
        },

        addLevel: (amount) => set((state) => {
            const newLevel = state.level + amount;
            const newMaxHp = state.maxHp + (amount * 10);
            syncToDb({ level: newLevel, max_hp: newMaxHp, hp: newMaxHp } as any);
            return { level: newLevel, maxHp: newMaxHp, hp: newMaxHp };
        }),

        equipWeapon: (weaponId) => set(() => {
            syncToDb({ equippedWeaponId: weaponId });
            return { equippedWeaponId: weaponId };
        })
    };
});
