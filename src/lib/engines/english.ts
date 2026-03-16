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

    // Additional Conversational Phrases
    { id: 'ep6', category: 'phrases', englishText: 'I am hungry.', japaneseMeaning: 'おなかがすいた', choices: ['おなかがすいた', 'のどがかわいた', 'ねむたい', 'げんきだよ'], explanationText: 'Hungry は「おなかがすいた」っていういみだよ。' },
    { id: 'ep7', category: 'phrases', englishText: 'See you!', japaneseMeaning: 'またね', choices: ['こんにちは', 'またね', 'ごめんなさい', 'ありがとう'], explanationText: 'See you は かえるときに いう「またね」だよ。' },
    { id: 'ep8', category: 'phrases', englishText: 'Here you are.', japaneseMeaning: 'はい、どうぞ', choices: ['はい、どうぞ', 'ありがとう', 'ごめんなさい', 'いただきます'], explanationText: 'Here you are は ものを はたすときに いう「はい、どうぞ」だよ。' },
    { id: 'ep9', category: 'phrases', englishText: 'I am sorry.', japaneseMeaning: 'ごめんなさい', choices: ['ありがとう', 'こんにちは', 'ごめんなさい', 'さようなら'], explanationText: 'I am sorry は あやまるときに いう「ごめんなさい」だよ。' },
    { id: 'ep10', category: 'phrases', englishText: 'Let\'s go!', japaneseMeaning: 'さあ、いこう', choices: ['まって', 'さあ、いこう', 'かえろう', 'あそぼう'], explanationText: 'Let\'s go は いっしょに しゅっぱつする「さあ、いこう」だよ。' },

    // Additional Batch 5 
    { id: 'ea5', category: 'animals', englishText: 'Monkey', japaneseMeaning: 'さる', choices: ['ごりら', 'さる', 'いるか', 'きつね'], explanationText: 'Monkey は 「さる」 だよ。' },
    { id: 'ea6', category: 'animals', englishText: 'Rabbit', japaneseMeaning: 'うさぎ', choices: ['ねずみ', 'うさぎ', 'こあら', 'いぬ'], explanationText: 'Rabbit は 「うさぎ」 だよ。' },
    { id: 'ef5', category: 'foods', englishText: 'Milk', japaneseMeaning: 'ぎゅうにゅう', choices: ['みず', 'おちゃ', 'ぎゅうにゅう', 'じゅーす'], explanationText: 'Milk は うしさんからしぼる 「ぎゅうにゅう」 だよ。' },
    { id: 'ec4', category: 'colors', englishText: 'Green', japaneseMeaning: 'みどり', choices: ['あお', 'あか', 'きいろ', 'みどり'], explanationText: 'Green は はっぱの いろ、「みどり」だよ。' },
    { id: 'ep11', category: 'phrases', englishText: 'Good night.', japaneseMeaning: 'おやすみなさい', choices: ['おはよう', 'こんにちは', 'おやすみなさい', 'さようなら'], explanationText: 'Good night は ねるまえに いう「おやすみなさい」だよ。' },
    { id: 'ep12', category: 'phrases', englishText: 'I like apples.', japaneseMeaning: 'りんごがすき', choices: ['りんごがきらい', 'りんごがすき', 'みかんがすき', 'ばなながすき'], explanationText: 'I like は「すき」という意味だよ。' },

    // Additional Sentences requested (Normal/Hard)
    // Additional Sentences requested (Normal/Hard)
    { id: 'ep13', category: 'phrases', englishText: 'I\'m looking for my toy.', japaneseMeaning: 'おもちゃを さがしている', choices: ['おもちゃを みつけた', 'おもちゃを かっている', 'おもちゃを さがしている', 'おもちゃを なくした'], explanationText: 'Looking for は「さがしている」という意味だよ。' },
    { id: 'ep14', category: 'phrases', englishText: 'I want to learn English.', japaneseMeaning: 'えいごを ならいたい', choices: ['えいごを はなせる', 'えいごを ならいたい', 'えいごが すき', 'えいごが むずかしい'], explanationText: 'want to learn は「ならいたい」という意味だよ。' },
    { id: 'ep15', category: 'phrases', englishText: 'I\'m looking for a rainbow beetle.', japaneseMeaning: 'ニジイロクワガタを さがしている', choices: ['かぶとむしを つかまえた', 'ニジイロクワガタを さがしている', 'てんとうむしが すき', 'くわがたを もっている'], explanationText: 'rainbow beetle は「ニジイロクワガタ」だよ。' },
    { id: 'ep16', category: 'phrases', englishText: 'Can I borrow your crayon?', japaneseMeaning: 'クレヨンを かりてもいい？', choices: ['クレヨンを かしてね', 'クレヨンを かりてもいい？', 'クレヨンを あげるよ', 'クレヨンを つかっているよ'], explanationText: 'Can I borrow は「かりてもいい？」と聞くときにつかうよ。' },
    { id: 'ep17', category: 'phrases', englishText: 'Can I have a cookie?', japaneseMeaning: 'クっきーを もらってもいい？', choices: ['クッキーを あげるよ', 'クッキーを もらってもいい？', 'クッキーが きらい', 'クッキーを たべたよ'], explanationText: 'Can I have は「もらってもいい？」と聞くときにつかうよ。' },
    { id: 'ep18', category: 'phrases', englishText: 'Help me.', japaneseMeaning: 'たすけて', choices: ['ありがとう', 'こっちにきて', 'たすけて', 'がんばって'], explanationText: 'Help me は「たすけて」と おねがいする ことばだよ。' },
    { id: 'ep19', category: 'phrases', englishText: 'Wait a minute.', japaneseMeaning: 'ちょっと まって', choices: ['いそいで', 'ちょっと まって', 'もう いいよ', 'さあ いこう'], explanationText: 'Wait a minute は「ちょっと まって」という意味だよ。' },
    { id: 'ep20', category: 'phrases', englishText: 'You\'re welcome.', japaneseMeaning: 'どういたしまして', choices: ['ありがとう', 'ごめんなさい', 'こんにちは', 'どういたしまして'], explanationText: 'You\'re welcome は ありがとう と言われた時に返す「どういたしまして」だよ。' },
    { id: 'ep21', category: 'phrases', englishText: 'I don\'t know.', japaneseMeaning: 'わからない', choices: ['しっているよ', 'わからない', 'きいてみて', 'わすれた'], explanationText: 'I don\'t know は「わからない」「しらない」という意味だよ。' },
    { id: 'ep22', category: 'phrases', englishText: 'Come here.', japaneseMeaning: 'こっちにきて', choices: ['あっちにいって', 'ちょっと まって', 'こっちにきて', 'いっしょにあそぼう'], explanationText: 'Come here は「こっちにきて」とよぶ ことばだよ。' },

    // Batch 11 Additions
    { id: 'ea7', category: 'animals', englishText: 'Giraffe', japaneseMeaning: 'きりん', choices: ['きりん', 'ぞう', 'しまうま', 'かば'], explanationText: 'Giraffe は くびがながい「きりん」だよ。' },
    { id: 'ea8', category: 'animals', englishText: 'Lion', japaneseMeaning: 'らいおん', choices: ['とら', 'くま', 'らいおん', 'ちーたー'], explanationText: 'Lion は どうぶつの おうさま「らいおん」だよ。' },
    { id: 'ea9', category: 'animals', englishText: 'Bear', japaneseMeaning: 'くま', choices: ['くま', 'さる', 'いるか', 'きつね'], explanationText: 'Bear は おおきくて つよい「くま」だよ。' },
    { id: 'ea10', category: 'animals', englishText: 'Tiger', japaneseMeaning: 'とら', choices: ['とら', 'らいおん', 'ねこ', 'ひょう'], explanationText: 'Tiger は しましまもようの「とら」だよ。' },
    { id: 'ea11', category: 'animals', englishText: 'Pig', japaneseMeaning: 'ぶた', choices: ['ぶた', 'うし', 'にわとり', 'うま'], explanationText: 'Pig は ピンクいろの「ぶた」だよ。ぶひぶひ鳴くよ。' },

    { id: 'ep23', category: 'phrases', englishText: 'It is sunny.', japaneseMeaning: 'はれているね', choices: ['あめがふっている', 'はれているね', 'ゆきがふっている', 'かぜがつよい'], explanationText: 'Sunny は 太陽が出て「はれている」って意味だよ。' },
    { id: 'ep24', category: 'phrases', englishText: 'Wash your hands.', japaneseMeaning: 'てを あらって', choices: ['てを あらって', 'かおを あらって', 'はを みがいて', 'おふろに はいって'], explanationText: 'Wash your hands は「てを あらって」と言う意味だよ。' },
    { id: 'ep25', category: 'phrases', englishText: 'Are you ready?', japaneseMeaning: 'じゅんびできた？', choices: ['もう できたよ', 'じゅんびできた？', 'まだだよ', 'いそいで'], explanationText: 'Are you ready は「じゅんびできた？」と聞く言葉だよ。' },
    { id: 'ep26', category: 'phrases', englishText: 'Where are you?', japaneseMeaning: 'どこにいるの？', choices: ['なにしてるの？', 'どこにいるの？', 'だれといるの？', 'いつかえるの？'], explanationText: 'Where は「どこ」という意味。「どこにいるの？」と探す時に使うよ。' },
    { id: 'ep27', category: 'phrases', englishText: 'It is fun!', japaneseMeaning: 'たのしい！', choices: ['かなしい', 'さびしい', 'こわい', 'たのしい！'], explanationText: 'fun は「たのしい」という意味だよ。' },
    { id: 'ep28', category: 'phrases', englishText: 'Good job!', japaneseMeaning: 'よくできたね', choices: ['すごいね', 'よくできたね', 'がんばったね', 'おつかれさま'], explanationText: 'Good job は 頑張った時に褒める「よくできたね」だよ。' },
    { id: 'ep29', category: 'phrases', englishText: 'Don\'t give up!', japaneseMeaning: 'あきらめないで！', choices: ['あきらめないで！', 'がんばって！', 'もうやめて', 'やすもう'], explanationText: 'Don\'t give up は「あきらめないで！」と応援する言葉だよ。' }
];

const RECENT_ENGLISH_HISTORY_SIZE = 5;
const recentEnglishQuestionIds: string[] = [];

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

    while (attempts < 15) {
        const randomIndex = Math.floor(Math.random() * filteredData.length);
        const q = filteredData[randomIndex];

        if (!recentEnglishQuestionIds.includes(q.id)) {
            chosenQuestion = q;
            break;
        }
        attempts++;
    }

    if (!chosenQuestion) {
        chosenQuestion = filteredData[0];
    }

    recentEnglishQuestionIds.push(chosenQuestion.id);
    if (recentEnglishQuestionIds.length > RECENT_ENGLISH_HISTORY_SIZE) {
        recentEnglishQuestionIds.shift();
    }

    const shuffledChoices = [...chosenQuestion.choices].sort(() => Math.random() - 0.5);
    return {
        ...chosenQuestion,
        choices: shuffledChoices,
    };
};
