export type ItemType = 'weapon' | 'furniture' | 'friend' | 'top' | 'bottom';

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

export const TOPS: GameItem[] = [
    { id: 't1', name: 'ふつうのふく', type: 'top', price: 0, emoji: '👕' },
    { id: 't2', name: 'あかいふく', type: 'top', price: 50, emoji: '🎽' },
    { id: 't3', name: 'おしゃれなふく', type: 'top', price: 150, emoji: '👔' },
    { id: 't4', name: 'きもの', type: 'top', price: 300, emoji: '👘' },
    { id: 't5', name: 'よろい', type: 'top', price: 500, emoji: '🛡️' },
    { id: 't6', name: 'ドレス', type: 'top', price: 400, emoji: '👗' },
];

export const BOTTOMS: GameItem[] = [
    { id: 'b1', name: 'ふつうのズボン', type: 'bottom', price: 0, emoji: '👖' },
    { id: 'b2', name: 'はんずぼん', type: 'bottom', price: 50, emoji: '🩳' },
    { id: 'b3', name: 'スカート', type: 'bottom', price: 100, emoji: '👗' }, // using dress for now or leave out
];

export const FURNITURE: GameItem[] = [
    { id: 'f1', name: 'きぼのいす', type: 'furniture', price: 20, emoji: '🪑' },
    { id: 'f2', name: 'あかいいす', type: 'furniture', price: 30, emoji: '🪑' },
    { id: 'f3', name: 'ベッド', type: 'furniture', price: 100, emoji: '🛏️' },
    { id: 'f4', name: 'しょくたく (テーブル)', type: 'furniture', price: 80, emoji: '🍽️' }, // Wood table unsupported on OS, using dining set
    { id: 'f5', name: 'れいぞうこ', type: 'furniture', price: 300, emoji: '🧊' },
    { id: 'f6', name: 'テレビ', type: 'furniture', price: 500, emoji: '📺' },
    { id: 'f7', name: 'パソコン', type: 'furniture', price: 800, emoji: '💻' },
    { id: 'f8', name: 'くまのぬいぐるみ', type: 'furniture', price: 150, emoji: '🧸' },
    { id: 'f9', name: 'せんぷうき', type: 'furniture', price: 120, emoji: '🌀' },
    { id: 'f10', name: 'おもちゃばこ', type: 'furniture', price: 250, emoji: '📦' },
    // 10 New requested furniture types
    { id: 'f11', name: 'まもりの かべ', type: 'furniture', price: 400, emoji: '🧱' },
    { id: 'f12', name: 'おとしあなの わな', type: 'furniture', price: 350, emoji: '🕳️' },
    { id: 'f13', name: 'おおきな しょくたく', type: 'furniture', price: 200, emoji: '🍽️' }, // Using a brown trunk as a substitute
    { id: 'f14', name: 'ほんだな', type: 'furniture', price: 220, emoji: '📚' },
    { id: 'f15', name: 'かんようしょくぶつ', type: 'furniture', price: 180, emoji: '🌲' },
    { id: 'f16', name: 'ふかふか ソファ', type: 'furniture', price: 320, emoji: '🛋️' },
    { id: 'f17', name: 'おおきな とけい', type: 'furniture', price: 280, emoji: '🕰️' },
    { id: 'f18', name: 'あたたかい ラグ', type: 'furniture', price: 150, emoji: '🧶' },
    { id: 'f19', name: 'ゴミばこ', type: 'furniture', price: 50, emoji: '🗑️' },
    { id: 'f20', name: 'あかるい ランプ', type: 'furniture', price: 160, emoji: '💡' },
    { id: 'f21', name: 'あたたかい たきび', type: 'furniture', price: 500, emoji: '🔥' },
];

export const FRIENDS: GameItem[] = [
    { id: 'fr1', name: 'ことり', type: 'friend', price: 100, emoji: '🐦' },
    { id: 'fr2', name: 'へび', type: 'friend', price: 120, emoji: '🐍' },
    { id: 'fr3', name: 'くま', type: 'friend', price: 300, emoji: '🐻' },
    { id: 'fr4', name: 'さかな', type: 'friend', price: 80, emoji: '🐟' },
    { id: 'fr5', name: 'くじら', type: 'friend', price: 400, emoji: '🐳' },
    { id: 'fr6', name: 'あおむし', type: 'friend', price: 150, emoji: '🐛' },
    { id: 'fr7', name: 'ちょうちょう', type: 'friend', price: 90, emoji: '🦋' },
    { id: 'fr8', name: 'みつばち', type: 'friend', price: 110, emoji: '🐝' },
    { id: 'fr9', name: 'てんとうむし', type: 'friend', price: 100, emoji: '🐞' },
    { id: 'fr10', name: 'あり', type: 'friend', price: 50, emoji: '🐜' },
    { id: 'fr11', name: 'いぬ', type: 'friend', price: 250, emoji: '🐶' },
    { id: 'fr12', name: 'ねこ', type: 'friend', price: 250, emoji: '🐱' },
    { id: 'fr13', name: 'うさぎ', type: 'friend', price: 200, emoji: '🐰' },
    { id: 'fr14', name: 'かえる', type: 'friend', price: 100, emoji: '🐸' },
    { id: 'fr15', name: 'かめ', type: 'friend', price: 130, emoji: '🐢' },
    { id: 'fr16', name: 'どくろ', type: 'friend', price: 300, emoji: '💀' },
    { id: 'fr17', name: 'あくま', type: 'friend', price: 500, emoji: '😈' },
    { id: 'fr18', name: 'おばけ', type: 'friend', price: 250, emoji: '👻' },
    { id: 'fr19', name: 'どろぼう', type: 'friend', price: 350, emoji: '🦹' },
    { id: 'fr20', name: 'うちゅうじん', type: 'friend', price: 400, emoji: '👽' },
    { id: 'fr21', name: 'ぞんび', type: 'friend', price: 280, emoji: '🧟' },
];

export const ALL_ITEMS = [...WEAPONS, ...TOPS, ...BOTTOMS, ...FURNITURE, ...FRIENDS];
