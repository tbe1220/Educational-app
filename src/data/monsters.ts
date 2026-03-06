export interface Monster {
    id: string;
    name: string;
    maxHp: number;
    emoji: string; // Using emoji as placeholder since we don't have asset files
    color: string;
    expReward: number;
    pointReward: number;
    attackPower: number;
}

export const MONSTERS: Monster[] = [
    { id: 'm1', name: 'すわいむ', maxHp: 20, emoji: '💧', color: 'from-blue-200 to-blue-400', expReward: 10, pointReward: 10, attackPower: 2 },
    { id: 'm2', name: 'ごぶりん', maxHp: 30, emoji: '👺', color: 'from-green-300 to-green-500', expReward: 15, pointReward: 15, attackPower: 5 },
    { id: 'm3', name: 'おばけ', maxHp: 25, emoji: '👻', color: 'from-gray-200 to-white', expReward: 12, pointReward: 12, attackPower: 3 },
    { id: 'm4', name: 'どくぐも', maxHp: 40, emoji: '🕷️', color: 'from-purple-500 to-purple-800', expReward: 20, pointReward: 20, attackPower: 8 },
    { id: 'm5', name: 'すけるとん', maxHp: 45, emoji: '💀', color: 'from-gray-100 to-gray-300', expReward: 25, pointReward: 25, attackPower: 10 },
    { id: 'm6', name: 'おおこうもり', maxHp: 35, emoji: '🦇', color: 'from-indigo-600 to-indigo-900', expReward: 18, pointReward: 18, attackPower: 7 },
    { id: 'm7', name: 'さそり', maxHp: 50, emoji: '🦂', color: 'from-orange-400 to-red-600', expReward: 30, pointReward: 30, attackPower: 12 },
    { id: 'm8', name: 'へび', maxHp: 35, emoji: '🐍', color: 'from-green-500 to-green-700', expReward: 18, pointReward: 18, attackPower: 9 },
    { id: 'm9', name: 'おおぐま', maxHp: 80, emoji: '🐻', color: 'from-red-800 to-amber-900', expReward: 40, pointReward: 40, attackPower: 15 },
    { id: 'm10', name: 'ゆきのけっしょう', maxHp: 60, emoji: '❄️', color: 'from-cyan-100 to-blue-200', expReward: 35, pointReward: 35, attackPower: 11 },
    { id: 'm11', name: 'びりびりぐも', maxHp: 55, emoji: '🌩️', color: 'from-yellow-300 to-yellow-600', expReward: 30, pointReward: 30, attackPower: 14 },
    { id: 'm12', name: 'どろにんぎょう', maxHp: 45, emoji: '💩', color: 'from-amber-600 to-amber-800', expReward: 20, pointReward: 15, attackPower: 5 }, // Kids usually like poop emojis ironically
    { id: 'm13', name: 'みならいまほうつかい', maxHp: 60, emoji: '🧙', color: 'from-purple-400 to-pink-500', expReward: 45, pointReward: 45, attackPower: 18 },
    { id: 'm14', name: 'ゴーレム', maxHp: 120, emoji: '🗿', color: 'from-stone-400 to-stone-700', expReward: 60, pointReward: 50, attackPower: 10 },
    { id: 'm15', name: 'よろいきし', maxHp: 90, emoji: '🤺', color: 'from-slate-300 to-slate-500', expReward: 50, pointReward: 40, attackPower: 20 },
    { id: 'm16', name: 'ふぇにっくす', maxHp: 150, emoji: '🦅', color: 'from-orange-500 to-red-500', expReward: 80, pointReward: 70, attackPower: 25 },
    { id: 'm17', name: 'うみぼうず', maxHp: 110, emoji: '🐙', color: 'from-cyan-600 to-blue-800', expReward: 55, pointReward: 45, attackPower: 16 },
    { id: 'm18', name: 'ひとつめきょじん', maxHp: 160, emoji: '👁️', color: 'from-rose-500 to-rose-800', expReward: 90, pointReward: 80, attackPower: 30 },
    { id: 'm19', name: 'あくま', maxHp: 180, emoji: '😈', color: 'from-purple-700 to-purple-900', expReward: 100, pointReward: 85, attackPower: 35 },
    { id: 'm20', name: 'でんせつの どらごん', maxHp: 300, emoji: '🐉', color: 'from-amber-300 to-orange-600', expReward: 200, pointReward: 150, attackPower: 50 },
];

export const getRandomMonster = (playerLevel: number): Monster => {
    // Try to pick a monster somewhat related to player level, but add randomness
    // Monsters are sorted roughly by difficulty (HP/Attack) implicitly in the array above
    const maxIndex = Math.min(MONSTERS.length - 1, playerLevel + 5);
    const minIndex = Math.max(0, playerLevel - 2);

    const span = maxIndex - minIndex + 1;
    const randomIndex = minIndex + Math.floor(Math.random() * span);

    return MONSTERS[randomIndex];
};
