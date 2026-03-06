export type MathQuestionType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'clock';

import { usePlayerStore } from "@/store/usePlayerStore";

export interface MathQuestion {
    id: string;
    type: MathQuestionType;
    questionStr: string;     // e.g. "5 + 3 =" or "時計の画像(データ)"
    correctAnswer: number | string; // clock might use string like "3:30" or "3じ はん" depending on UI
    choices: (number | string)[]; // 4 choices for kids
    hintDots?: number; // How many dots to show for hint
}

const generateChoices = (correct: number, count: number = 4): number[] => {
    const choices = new Set<number>();
    choices.add(correct);

    while (choices.size < count) {
        // Generate variations near the correct answer to make them realistic distractors
        const variation = Math.floor(Math.random() * 5) + 1;
        const sign = Math.random() > 0.5 ? 1 : -1;
        const wrong = Math.max(0, correct + (variation * sign));
        if (wrong !== correct) {
            choices.add(wrong);
        }
    }

    return Array.from(choices).sort(() => Math.random() - 0.5);
};

export const generateAddition = (difficulty: string): MathQuestion => {
    let maxSum = 30;
    if (difficulty === 'easy') maxSum = 10;
    if (difficulty === 'hard') maxSum = 100;

    const a = Math.floor(Math.random() * (maxSum - 1)) + 1;
    const b = Math.floor(Math.random() * (maxSum - a)) + 1;
    const answer = a + b;

    return {
        id: crypto.randomUUID(),
        type: 'addition',
        questionStr: `${a} ＋ ${b} ＝`,
        correctAnswer: answer,
        choices: generateChoices(answer),
        hintDots: a
    };
};

const generateSubtraction = (difficulty: string): MathQuestion => {
    let maxVal = 20;
    if (difficulty === 'easy') maxVal = 10;
    if (difficulty === 'hard') maxVal = 50;

    const a = Math.floor(Math.random() * maxVal) + 5;
    const b = Math.floor(Math.random() * (a - 1)) + 1;
    const answer = a - b;

    return {
        id: crypto.randomUUID(),
        type: 'subtraction',
        questionStr: `${a} － ${b} ＝`,
        correctAnswer: answer,
        choices: generateChoices(answer),
        hintDots: a
    };
};

const generateMultiplication = (difficulty: string): MathQuestion => {
    // easy skips this normally, but if forced, keep it small
    let scale = difficulty === 'hard' ? 9 : 5;
    const a = Math.floor(Math.random() * scale) + 1; // 1 to scale
    const b = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const answer = a * b;

    return {
        id: crypto.randomUUID(),
        type: 'multiplication',
        questionStr: `${a} × ${b} ＝`,
        correctAnswer: answer,
        choices: generateChoices(answer),
        hintDots: a
    };
};

const generateDivision = (difficulty: string): MathQuestion => {
    // Division is inverse of multiplication.
    let scale = difficulty === 'hard' ? 9 : 5;
    const b = Math.floor(Math.random() * scale) + 1;
    const answer = Math.floor(Math.random() * 9) + 1;
    const a = b * answer;

    return {
        id: crypto.randomUUID(),
        type: 'division',
        questionStr: `${a} ÷ ${b} ＝`,
        correctAnswer: answer,
        choices: generateChoices(answer),
        hintDots: a
    };
};

const generateClock = (difficulty: string): MathQuestion => {
    // generate a time, e.g., 3:00 or 4:30
    const hour = Math.floor(Math.random() * 12) + 1;

    // Easy: only full hours (00). Normal: 00 or 30. Hard: 00, 15, 30, 45
    let minutes = 0;
    if (difficulty === 'normal') {
        minutes = Math.random() > 0.5 ? 30 : 0;
    } else if (difficulty === 'hard') {
        const mins = [0, 15, 30, 45];
        minutes = mins[Math.floor(Math.random() * mins.length)];
    }

    const hourStr = hour.toString();
    const minStr = minutes === 0 ? "00" : minutes.toString();

    // Format choices nicely like "3じ 30ふん"
    const answerStr = `${hour}じ${minutes === 0 ? '' : ` ${minutes}ふん`}`;

    const choices = [answerStr];
    while (choices.length < 4) {
        const wrongH = Math.floor(Math.random() * 12) + 1;
        let wrongM = 0;
        if (difficulty === 'normal') wrongM = Math.random() > 0.5 ? 30 : 0;
        if (difficulty === 'hard') {
            const mins = [0, 15, 30, 45];
            wrongM = mins[Math.floor(Math.random() * mins.length)];
        }
        const wrongStr = `${wrongH}じ${wrongM === 0 ? '' : ` ${wrongM}ふん`}`;
        if (!choices.includes(wrongStr)) {
            choices.push(wrongStr);
        }
    }

    // Shuffle choices
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    return {
        id: crypto.randomUUID(),
        type: 'clock',
        questionStr: `${hour}:${minStr}`,
        correctAnswer: answerStr,
        choices,
        hintDots: undefined
    };
};
// Generate a random math question based on selected difficulty
export const generateMathQuestion = (): MathQuestion => {
    const difficulty = usePlayerStore.getState().difficulty;

    // Choose type based on difficulty and random chance
    let types: MathQuestionType[] = ['addition', 'subtraction'];

    if (difficulty === 'easy') {
        types = ['addition', 'subtraction']; // only basic math for young kids
    } else if (difficulty === 'normal') {
        types = ['addition', 'subtraction', 'multiplication', 'clock', 'division'];
    } else if (difficulty === 'hard') {
        types = ['addition', 'subtraction', 'multiplication', 'division', 'clock'];
    }

    const type = types[Math.floor(Math.random() * types.length)];

    switch (type) {
        case 'addition':
            return generateAddition(difficulty);
        case 'subtraction':
            return generateSubtraction(difficulty);
        case 'multiplication':
            return generateMultiplication(difficulty);
        case 'division':
            return generateDivision(difficulty);
        case 'clock':
            return generateClock(difficulty);
    }
};
