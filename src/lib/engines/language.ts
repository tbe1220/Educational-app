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
    // Tracing will be handled slightly differently in UI, asking them to input a word
    // For the sake of choice-based engine compatibility initially:
    { id: 't1', category: 'tracing', questionStr: '「りんご」の さいしょの もじは？', correctAnswer: 'り', choices: ['り', 'ん', 'ご', 'み'] },
    { id: 't2', category: 'tracing', questionStr: '「くるま」の さいごの もじは？', correctAnswer: 'ま', choices: ['ま', 'る', 'く', 'た'] },
];

const ALL_QUESTIONS = [...BUG_QUESTIONS, ...COUNTRY_QUESTIONS, ...SAFETY_QUESTIONS, ...TRACING_QUESTIONS];

import { usePlayerStore } from "@/store/usePlayerStore";

// Get available categories based on difficulty
const getCategories = (difficulty: string) => {
    if (difficulty === 'easy') {
        return ['bugs', 'colors_fruits']; // Simplified categories
    } else if (difficulty === 'hard') {
        return ['countries', 'safety', 'animals_hard'];
    }
    return ['bugs', 'countries', 'safety'];
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
    }
};

const ALL_SETS = { ...WORD_SETS, ...EXTRA_SETS };

export const generateLanguageQuestion = (): LanguageQuestion => {
    const difficulty = usePlayerStore.getState().difficulty;
    const categories = getCategories(difficulty);
    const categoryKey = categories[Math.floor(Math.random() * categories.length)];

    // If the category is one of the new 'WordSet' categories
    if (categoryKey in ALL_SETS) {
        const set = ALL_SETS[categoryKey as keyof typeof ALL_SETS];
        const item = set.items[Math.floor(Math.random() * set.items.length)];

        // Generate choices (e.g., correct answer + 3 random incorrect from the same set or other sets)
        const otherItems = set.items.filter(i => i.text !== item.text);
        const incorrectChoices = otherItems.sort(() => Math.random() - 0.5).slice(0, 3).map(i => i.text);
        const choices = [item.text, ...incorrectChoices].sort(() => Math.random() - 0.5);

        return {
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

        return {
            ...q,
            choices: shuffledChoices,
        };
    }
};
