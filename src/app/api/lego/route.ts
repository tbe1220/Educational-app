import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const body = await req.json();
        const { imageBase64 } = body;

        if (!imageBase64) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Process base64
        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      この画像はレゴブロックなどで作られた形です。
      この形から想像できる「ゲーム内で使える、ぶき（剣・銃など）」または「かぐ（椅子など）」を１つ考えてください。
      以下のJSON形式で必ず返答してください。回答はすべて「ひらがな（カタカナもOK）」のみを使用し、漢字は一切使わないでください。
      
      {
        "name": "アイテムのなまえ（例：ほのおのつるぎ）",
        "type": "weapon または furniture",
        "emoji": "アイテムをあらわす絵文字を1つ（例：🔥）",
        "power": 強さや価値などの数値（100〜1000のランダムな数字）
      }
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Extract JSON from potential markdown blocks
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        if (!jsonMatch) {
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        const itemData = JSON.parse(jsonMatch[0]);

        return NextResponse.json(itemData);

    } catch (error: any) {
        console.error("Gemini API error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
