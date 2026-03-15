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
    { id: 'f4', name: 'テーブル', type: 'furniture', price: 80, emoji: '📦' }, // No table emoji exists, using a wooden box/package
    { id: 'f5', name: 'れいぞうこ', type: 'furniture', price: 300, emoji: '🧊' },
    { id: 'f6', name: 'テレビ', type: 'furniture', price: 500, emoji: '📺' },
    { id: 'f7', name: 'パソコン', type: 'furniture', price: 800, emoji: '💻' },
    { id: 'f8', name: 'くまのぬいぐるみ', type: 'furniture', price: 150, emoji: '🧸' },
    { id: 'f9', name: 'せんぷうき', type: 'furniture', price: 120, emoji: '🌀' },
    { id: 'f10', name: 'おもちゃばこ', type: 'furniture', price: 250, emoji: '📦' },
    // 10 New requested furniture types
    { id: 'f11', name: 'まもりの かべ', type: 'furniture', price: 400, emoji: '🧱' },
    { id: 'f12', name: 'おとしあなの わな', type: 'furniture', price: 350, emoji: '🕳️' },
    { id: 'f13', name: 'おおきな テーブル', type: 'furniture', price: 200, emoji: '🧳' }, // Using a brown trunk as a substitute
    { id: 'f14', name: 'ほんだな', type: 'furniture', price: 220, emoji: '📚' },
    { id: 'f15', name: 'かんようしょくぶつ', type: 'furniture', price: 180, emoji: '🌲' },
    { id: 'f16', name: 'ふかふか ソファ', type: 'furniture', price: 320, emoji: '🛋️' },
    { id: 'f17', name: 'おおきな とけい', type: 'furniture', price: 280, emoji: '🕰️' },
    { id: 'f18', name: 'あたたかい ラグ', type: 'furniture', price: 150, emoji: '🧶' },
    { id: 'f19', name: 'ゴミばこ', type: 'furniture', price: 50, emoji: '🗑️' },
    { id: 'f20', name: 'あかるい ランプ', type: 'furniture', price: 160, emoji: '💡' },
    { id: 'f21', name: 'あたたかい たきび', type: 'furniture', price: 500, emoji: '🔥' },
];

export const ALL_ITEMS = [...WEAPONS, ...FURNITURE];
