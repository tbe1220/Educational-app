export type LanguageQuestionCategory = 'bugs' | 'countries' | 'safety' | 'tracing';

export interface LanguageQuestion {
    id: string;
    category: LanguageQuestionCategory;
    questionStr: string;   // e.g. "これを なぐって いい？"
    image?: string;        // Optional image URL
    correctAnswer: string; // "だめ", "あり", "あめりか"
    choices: string[];     // e.g. ["いいよ", "だめ", "わからない"]
}

const BUG_QUESTIONS: LanguageQuestion[] = [
    { id: 'b1', category: 'bugs', questionStr: 'あかい からだに くろい てんてんが ある むしは？', correctAnswer: 'てんとうむし', choices: ['かぶとむし', 'てんとうむし', 'くわがた', 'ちょうちょう'] },
    { id: 'b2', category: 'bugs', questionStr: 'きの みつを すう、つのがある つよい むしは？', correctAnswer: 'かぶとむし', choices: ['かぶとむし', 'あり', 'ばった', 'せみ'] },
    { id: 'b3', category: 'bugs', questionStr: 'はるに ひらひら とぶ きれいな むしは？', correctAnswer: 'ちょうちょう', choices: ['ちょうちょう', 'くも', 'ごきぶり', 'はえ'] },
];

const COUNTRY_QUESTIONS: LanguageQuestion[] = [
    { id: 'c1', category: 'countries', questionStr: 'じぶんたちが すんでいる くには？', correctAnswer: 'にほん', choices: ['あめりか', 'にほん', 'ちゅうごく', 'いんど'] },
    { id: 'c2', category: 'countries', questionStr: 'ぱんだが いる おおきな くには？', correctAnswer: 'ちゅうごく', choices: ['ちゅうごく', 'あめりか', 'にほん', 'ぶらじる'] },
    { id: 'c3', category: 'countries', questionStr: 'はんばーがーが ゆうめいな くには？', correctAnswer: 'あめりか', choices: ['あめりか', 'にほん', 'ふらんす', 'えっぱな'] }, // fake wrong answers
];

const SAFETY_QUESTIONS: LanguageQuestion[] = [
    { id: 's1', category: 'safety', questionStr: 'どうろを わたるときは どっちを みる？', correctAnswer: 'みぎと ひだり', choices: ['みぎと ひだり', 'うえと した', 'うしろだけ', 'めをつぶる'] },
    { id: 's2', category: 'safety', questionStr: 'しんごうが あかの ときは どうする？', correctAnswer: 'とまる', choices: ['とまる', 'はしる', 'あるく', 'おどる'] },
    { id: 's3', category: 'safety', questionStr: 'しらない ひとに こえを かけられたら？', correctAnswer: 'にげる', choices: ['にげる', 'ついていく', 'あそぶ', 'おかしをもらう'] },
];

const TRACING_QUESTIONS: LanguageQuestion[] = [
    // Stroke order and character questions
    { id: 't1', category: 'tracing', questionStr: '「りんご」の さいしょの もじは？', correctAnswer: 'り', choices: ['り', 'ん', 'ご', 'み'] },
    { id: 't2', category: 'tracing', questionStr: '「くるま」の さいごの もじは？', correctAnswer: 'ま', choices: ['ま', 'る', 'く', 'た'] },
    { id: 't3', category: 'tracing', questionStr: '「でんしゃ」の さいしょの もじは？', correctAnswer: 'で', choices: ['で', 'ん', 'し', 'や'] },

    // Hiragana stroke counts
    { id: 'tc1', category: 'tracing', questionStr: '「あ」 は なんかいで かくかな？（かきじゅん）', correctAnswer: '3かい', choices: ['1かい', '2かい', '3かい', '4かい'] },
    { id: 'tc2', category: 'tracing', questionStr: '「い」 は なんかいで かくかな？（かきじゅん）', correctAnswer: '2かい', choices: ['1かい', '2かい', '3かい', '4かい'] },
    { id: 'tc3', category: 'tracing', questionStr: '「う」 は なんかいで かくかな？（かきじゅん）', correctAnswer: '2かい', choices: ['1かい', '2かい', '3かい', '4かい'] },
    { id: 'tc4', category: 'tracing', questionStr: '「く」 は なんかいで かくかな？（かきじゅん）', correctAnswer: '1かい', choices: ['1かい', '2かい', '3かい', '4かい'] },
    { id: 'tc5', category: 'tracing', questionStr: '「す」 は なんかいで かくかな？（かきじゅん）', correctAnswer: '2かい', choices: ['1かい', '2かい', '3かい', '4かい'] },
    { id: 'tc6', category: 'tracing', questionStr: '「き」 は なんかいで かくかな？（かきじゅん）', correctAnswer: '4かい', choices: ['2かい', '3かい', '4かい', '5かい'] },
];

const VEHICLE_QUESTIONS: LanguageQuestion[] = [
    { id: 'v1', category: 'tracing', questionStr: 'たくさんの ひとを のせて はしる のりものは？', correctAnswer: 'でんしゃ', choices: ['でんしゃ', 'じてんしゃ', 'ひこうき', 'ふね'] },
    { id: 'v2', category: 'tracing', questionStr: 'そらをとぶ おおきな のりものは？', correctAnswer: 'ひこうき', choices: ['ひこうき', 'くるま', 'ふね', 'ろけっと'] },
];

const ALL_QUESTIONS = [...BUG_QUESTIONS, ...COUNTRY_QUESTIONS, ...SAFETY_QUESTIONS, ...TRACING_QUESTIONS, ...VEHICLE_QUESTIONS];

import { usePlayerStore } from "@/store/usePlayerStore";

// Get available categories based on difficulty
const getCategories = (difficulty: string) => {
    if (difficulty === 'easy') {
        return ['bugs', 'colors_fruits', 'tracing']; // Simplified categories
    } else if (difficulty === 'hard') {
        return ['countries', 'safety', 'animals_hard', 'tracing', 'jukugo'];
    }
    return ['bugs', 'countries', 'safety', 'tracing', 'jukugo', 'countries_new', 'animals_new', 'vehicles_new'];
};

interface WordSetItem {
    text: string;
    hint: string;
    emoji: string;
}

interface WordSet {
    category: string;
    questionPrompt: string;
    items: WordSetItem[];
}

// Assuming WORD_SETS is defined elsewhere or should be defined here.
// For the sake of making the provided snippet syntactically correct,
// I'll define a placeholder for WORD_SETS if it's not in the original document.
// If WORD_SETS was meant to be the existing question arrays, this structure needs adjustment.
// Given the instruction, it seems like a new concept.
const WORD_SETS: Record<string, WordSet> = {
    // Placeholder for existing question sets if they were to be refactored into this format
    // For now, the original ALL_QUESTIONS will be used for 'normal' difficulty.
};

const EXTRA_SETS: Record<string, WordSet> = {
    colors_fruits: {
        category: 'いろ・くだもの',
        questionPrompt: 'これは なに？',
        items: [
            { text: 'あか', hint: 'りんごのいろ', emoji: '🍎' },
            { text: 'あお', hint: 'そらのいろ', emoji: '🟦' },
            { text: 'きいろ', hint: 'バナナのいろ', emoji: '🍌' },
            { text: 'みどり', hint: 'はっぱのいろ', emoji: '🍃' },
            { text: 'りんご', hint: 'あかいくだもの', emoji: '🍎' },
            { text: 'ぶどう', hint: 'むらさきのくだもの', emoji: '🍇' },
        ]
    },
    animals_hard: {
        category: 'どうぶつ（むずかしい）',
        questionPrompt: 'これは なに？',
        items: [
            { text: 'フラミンゴ', hint: 'ピンクいろのとり', emoji: '🦩' },
            { text: 'カンガルー', hint: 'おなかにふくろがある', emoji: '🦘' },
            { text: 'カピバラ', hint: 'おんせんがすき', emoji: '♨️' },
            { text: 'オランウータン', hint: 'もりのひと', emoji: '🦧' },
            { text: 'カメレオン', hint: 'いろがかわる', emoji: '🦎' },
        ]
    },
    school_items: {
        category: 'がっこうのもの',
        questionPrompt: 'これは なに？',
        items: [
            { text: 'えんぴつ', hint: 'じをかくもの', emoji: '✏️' },
            { text: 'ほん', hint: 'よむもの', emoji: '📖' },
            { text: 'はさみ', hint: 'かみをきるもの', emoji: '✂️' },
            { text: 'かばん', hint: 'にもつをいれるもの', emoji: '🎒' },
            { text: 'とけい', hint: 'じかんがわかるもの', emoji: '⌚' },
        ]
    },
    nature: {
        category: 'しぜん',
        questionPrompt: 'これは なに？',
        items: [
            { text: 'たいよう', hint: 'あかるくてあつい', emoji: '☀️' },
            { text: 'つき', hint: 'よるにでる', emoji: '🌙' },
            { text: 'ほし', hint: 'よるにきらきら', emoji: '⭐' },
            { text: 'くも', hint: 'そらにふわふわ', emoji: '☁️' },
            { text: 'あめ', hint: 'そらからふるみず', emoji: '☔' },
        ]
    },
    jukugo: {
        category: 'ことばの いみ',
        questionPrompt: 'これは どんな いみ？',
        items: [
            { text: 'みぎと ひだり', hint: 'さゆう。', emoji: 'さゆう' },
            { text: 'うえと した', hint: 'じょうげ。', emoji: 'じょうげ' },
            { text: 'みずの たま', hint: 'みずたま。', emoji: 'みずたま' },
            { text: 'あおくて きれいな そら', hint: 'あおぞら。', emoji: 'あおぞら' },
            { text: 'いえや びる', hint: 'たてもの。', emoji: 'たてもの' },
            { text: 'あさと ゆうがた', hint: 'ちょうせき。', emoji: 'ちょうせき' },
        ]
    },
    countries_new: {
        category: 'せかいの くに',
        questionPrompt: 'これは どんな くに？',
        items: [
            { text: 'イタリア', hint: 'ぴざが ゆうめい', emoji: '🍕' },
            { text: 'オーストラリア', hint: 'こあらが いる', emoji: '🐨' },
            { text: 'インド', hint: 'かれーが ゆうめい', emoji: '🍛' },
            { text: 'アメリカ', hint: 'はんばーがー', emoji: '🍔' },
            { text: 'エジプト', hint: 'ぴらみっど', emoji: '🐪' },
            { text: 'にほん', hint: 'おすし', emoji: '🍣' },
        ]
    },
    animals_new: {
        category: 'いきもの',
        questionPrompt: 'これは どんな いきもの？',
        items: [
            { text: 'キリン', hint: 'くびが ながい', emoji: '🦒' },
            { text: 'ゾウ', hint: 'おはなが ながい', emoji: '🐘' },
            { text: 'ライオン', hint: 'どうぶつの おうさま', emoji: '🦁' },
            { text: 'イヌ', hint: 'わんわんと なく', emoji: '🐶' },
            { text: 'ネコ', hint: 'にゃーと なく', emoji: '🐱' },
            { text: 'ウサギ', hint: 'みみが ながい', emoji: '🐰' },
        ]
    },
    vehicles_new: {
        category: 'のりもの',
        questionPrompt: 'これは どんな のりもの？',
        items: [
            { text: 'きゅうきゅうしゃ', hint: 'しろくて けがにんを はこぶ', emoji: '🚑' },
            { text: 'しょうぼうしゃ', hint: 'あかくて ひを けす', emoji: '🚒' },
            { text: 'パトカー', hint: 'けいさつかん が のる', emoji: '🚓' },
            { text: 'ひこうき', hint: 'そらを とぶ', emoji: '✈️' },
            { text: 'でんしゃ', hint: 'せんろを はしる', emoji: '🚃' },
            { text: 'ふね', hint: 'うみを すすむ', emoji: '⛴️' },
        ]
    }
};

const ALL_SETS = { ...WORD_SETS, ...EXTRA_SETS };

const RECENT_LANG_HISTORY_SIZE = 5;
const recentLanguageQuestions: string[] = [];

export const generateLanguageQuestion = (): LanguageQuestion => {
    const difficulty = usePlayerStore.getState().difficulty;
    const categories = getCategories(difficulty);

    let chosenQuestion: LanguageQuestion | null = null;
    let attempts = 0;

    while (attempts < 20) {
        const categoryKey = categories[Math.floor(Math.random() * categories.length)];

        // If the category is one of the new 'WordSet' categories
        if (categoryKey in ALL_SETS) {
            const set = ALL_SETS[categoryKey as keyof typeof ALL_SETS];
            const item = set.items[Math.floor(Math.random() * set.items.length)];

            // Generate choices (e.g., correct answer + 3 random incorrect from the same set or other sets)
            const otherItems = set.items.filter(i => i.text !== item.text);
            const incorrectChoices = otherItems.sort(() => Math.random() - 0.5).slice(0, 3).map(i => i.text);
            const choices = [item.text, ...incorrectChoices].sort(() => Math.random() - 0.5);

            chosenQuestion = {
                id: `${categoryKey}-${item.text}`, // Unique ID
                category: categoryKey as LanguageQuestionCategory,
                questionStr: `${set.questionPrompt} ${item.emoji}`,
                correctAnswer: item.text,
                choices: choices,
                image: undefined, // Or use emoji as image if applicable
            };
        } else {
            // Fallback to existing ALL_QUESTIONS for 'bugs', 'countries', 'safety', 'tracing'
            // This assumes 'normal' difficulty or categories not covered by new sets
            const filteredQuestions = ALL_QUESTIONS.filter(q => categories.includes(q.category));
            const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
            const q = filteredQuestions[randomIndex];

            // Shuffle choices
            const shuffledChoices = [...q.choices].sort(() => Math.random() - 0.5);

            chosenQuestion = {
                ...q,
                choices: shuffledChoices,
            };
        }

        if (chosenQuestion && !recentLanguageQuestions.includes(chosenQuestion.questionStr)) {
            break;
        }
        attempts++;
    }

    if (chosenQuestion) {
        recentLanguageQuestions.push(chosenQuestion.questionStr);
        if (recentLanguageQuestions.length > RECENT_LANG_HISTORY_SIZE) {
            recentLanguageQuestions.shift();
        }
        return chosenQuestion;
    }

    // Fallback if loop fails
    const fallback = ALL_QUESTIONS[0];
    return {
        ...fallback,
        choices: [...fallback.choices].sort(() => Math.random() - 0.5),
    };
};
