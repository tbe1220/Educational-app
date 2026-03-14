export type ItemType = 'weapon' | 'furniture';

export interface GameItem {
    id: string;
    name: string;
    type: ItemType;
    price: number;
    emoji: string;
}

export const WEAPONS: GameItem[] = [
    { id: 'w1', name: 'きのぼう', type: 'weapon', price: 10, emoji: '🥖' }, // bread is funny stick
    { id: 'w2', name: 'どうのつるぎ', type: 'weapon', price: 50, emoji: '🗡️' },
    { id: 'w3', name: 'はがねのけん', type: 'weapon', price: 150, emoji: '⚔️' },
    { id: 'w4', name: 'まほうのつえ', type: 'weapon', price: 200, emoji: '🔮' },
    { id: 'w5', name: 'おおきなたいほう', type: 'weapon', price: 500, emoji: '💣' },
    { id: 'w6', name: 'でんせつのけん', type: 'weapon', price: 1000, emoji: '🗡️✨' },
    // Adding more standard kids weapons
    { id: 'w7', name: 'ぴこぴこはんまー', type: 'weapon', price: 30, emoji: '🔨' },
    { id: 'w8', name: 'みずでっぽう', type: 'weapon', price: 80, emoji: '🔫' },
    { id: 'w9', name: 'ブーメラン', type: 'weapon', price: 120, emoji: '🌙' },
    { id: 'w10', name: 'ゆみや', type: 'weapon', price: 180, emoji: '🏹' },
];

export const FURNITURE: GameItem[] = [
    { id: 'f1', name: 'きぼのいす', type: 'furniture', price: 20, emoji: '🪑' },
    { id: 'f2', name: 'あかいいす', type: 'furniture', price: 30, emoji: '🪑' },
    { id: 'f3', name: 'ベッド', type: 'furniture', price: 100, emoji: '🛏️' },
    { id: 'f4', name: 'テーブル', type: 'furniture', price: 80, emoji: '🍽️' },
    { id: 'f5', name: 'れいぞうこ', type: 'furniture', price: 300, emoji: '🧊' },
    { id: 'f6', name: 'テレビ', type: 'furniture', price: 500, emoji: '📺' },
    { id: 'f7', name: 'パソコン', type: 'furniture', price: 800, emoji: '💻' },
    { id: 'f8', name: 'くまのぬいぐるみ', type: 'furniture', price: 150, emoji: '🧸' },
    { id: 'f9', name: 'せんぷうき', type: 'furniture', price: 120, emoji: '🌀' },
    { id: 'f10', name: 'おもちゃばこ', type: 'furniture', price: 250, emoji: '📦' },
];

export const ALL_ITEMS = [...WEAPONS, ...FURNITURE];
