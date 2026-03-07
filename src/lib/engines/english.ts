export type EnglishQuestionCategory = 'animals' | 'foods' | 'colors' | 'phrases';

export interface EnglishQuestion {
    id: string;
    category: EnglishQuestionCategory;
    englishText: string;     // Text to be spoken
    japaneseMeaning: string; // The correct translation in Hiragana
    choices: string[];       // 4 choices
    explanationText: string; // Explanation when wrong
}

import { usePlayerStore } from "@/store/usePlayerStore";

const ENGLISH_DATA: EnglishQuestion[] = [
    // Animals (Easy/Normal)
    { id: 'ea1', category: 'animals', englishText: 'Dog', japaneseMeaning: 'いぬ', choices: ['ねこ', 'いぬ', 'うさぎ', 'とり'], explanationText: 'Dog は 「いぬ」 だよ。' },
    { id: 'ea2', category: 'animals', englishText: 'Cat', japaneseMeaning: 'ねこ', choices: ['いぬ', 'ねこ', 'さる', 'うま'], explanationText: 'Cat は 「ねこ」 だよ。ニャーってなくよ。' },
    { id: 'ea3', category: 'animals', englishText: 'Elephant', japaneseMeaning: 'ぞう', choices: ['きりん', 'らいおん', 'ぞう', 'くま'], explanationText: 'Elephant は はなが ながい 「ぞう」 だよ。' },

    // Animals (Hard)
    { id: 'ea4', category: 'animals', englishText: 'Hippopotamus', japaneseMeaning: 'かば', choices: ['かば', 'さい', 'ぞう', 'わに'], explanationText: 'Hippopotamus は おおきな くちの 「かば」 だよ。' },

    // Fruits and Foods
    { id: 'ef1', category: 'foods', englishText: 'Apple', japaneseMeaning: 'りんご', choices: ['みかん', 'ぶどう', 'りんご', 'ばなな'], explanationText: 'Apple は あかい 「りんご」 だよ。' },
    { id: 'ef2', category: 'foods', englishText: 'Water', japaneseMeaning: 'みず', choices: ['みず', 'おちゃ', 'じゅーす', 'ぎゅうにゅう'], explanationText: 'Water は のむ 「みず」 だよ。' },
    { id: 'ef3', category: 'foods', englishText: 'Banana', japaneseMeaning: 'ばなな', choices: ['りんご', 'ばなな', 'ぶどう', 'いちご'], explanationText: 'Banana は きいろい 「ばなな」 だよ。' },
    { id: 'ef4', category: 'foods', englishText: 'Bread', japaneseMeaning: 'ぱん', choices: ['ごはん', 'にく', 'さかな', 'ぱん'], explanationText: 'Bread は ふわふわな 「ぱん」 だよ。' },

    // Colors
    { id: 'ec1', category: 'colors', englishText: 'Red', japaneseMeaning: 'あか', choices: ['あお', 'きいろ', 'あか', 'みどり'], explanationText: 'Red は りんごや いちごの いろ、「あか」だよ。' },
    { id: 'ec2', category: 'colors', englishText: 'Blue', japaneseMeaning: 'あお', choices: ['あお', 'あか', 'くろ', 'しろ'], explanationText: 'Blue は うみの いろ、「あお」だよ。' },
    { id: 'ec3', category: 'colors', englishText: 'Yellow', japaneseMeaning: 'きいろ', choices: ['あお', 'あか', 'きいろ', 'みどり'], explanationText: 'Yellow は ひまわりや ばななの いろ、「きいろ」だよ。' },

    // Phrases
    { id: 'ep1', category: 'phrases', englishText: 'I want to play.', japaneseMeaning: 'あそびたい', choices: ['たべたい', 'ねむたい', 'あそびたい', 'かえりたい'], explanationText: 'I want to は「〜したい」、playは「あそぶ」。だから「あそびたい」だよ。' },
    { id: 'ep2', category: 'phrases', englishText: 'What is your name?', japaneseMeaning: 'おなまえは？', choices: ['なんさい？', 'おなまえは？', 'げんき？', 'すきないろは？'], explanationText: 'Nameは「なまえ」。だから「おなまえは？」ってきいてるよ。' },
    { id: 'ep3', category: 'phrases', englishText: 'How old are you?', japaneseMeaning: 'なんさい？', choices: ['なんさい？', 'おなまえは？', 'どこにいくの？', 'なにがすき？'], explanationText: 'How old は「とし」をきくことば。「なんさい？」だよ。' },
    { id: 'ep4', category: 'phrases', englishText: 'Thank you!', japaneseMeaning: 'ありがとう', choices: ['ごめんなさい', 'こんにちは', 'さようなら', 'ありがとう'], explanationText: 'Thank you は 「ありがとう」 っておれいをいう ことばだよ。' },
    { id: 'ep5', category: 'phrases', englishText: 'Good morning.', japaneseMeaning: 'おはよう', choices: ['こんにちは', 'こんばんは', 'おはよう', 'さようなら'], explanationText: 'Good morning は あさに いう あいさつ、「おはよう」だよ。' },
];

let lastEnglishQuestionId = "";

export const generateEnglishQuestion = (): EnglishQuestion => {
    const difficulty = usePlayerStore.getState().difficulty;

    let filteredData = ENGLISH_DATA;
    if (difficulty === 'easy') {
        filteredData = ENGLISH_DATA.filter(q => q.category === 'animals' || q.category === 'colors' || q.category === 'foods');
    } else if (difficulty === 'normal') {
        filteredData = ENGLISH_DATA.filter(q => q.id !== 'ea4'); // Exclude hard specifically
    }
    // Hard includes everything

    let chosenQuestion: EnglishQuestion | null = null;
    let attempts = 0;

    while (attempts < 5) {
        const randomIndex = Math.floor(Math.random() * filteredData.length);
        const q = filteredData[randomIndex];

        if (q.id !== lastEnglishQuestionId) {
            chosenQuestion = q;
            break;
        }
        attempts++;
    }

    if (!chosenQuestion) {
        chosenQuestion = filteredData[0];
    }

    lastEnglishQuestionId = chosenQuestion.id;

    const shuffledChoices = [...chosenQuestion.choices].sort(() => Math.random() - 0.5);
    return {
        ...chosenQuestion,
        choices: shuffledChoices,
    };
};
