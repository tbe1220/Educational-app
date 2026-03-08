import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 60; // Allow enough time for Gemini API

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
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
      この画像はレゴブロックなどで作られた形です。
      この形から想像できる「ゲーム内で使える、ぶき（剣・銃など）」または「かぐ（椅子など）」を１つ考えてください。
      以下のJSON形式で必ず返答してください。回答はすべて「ひらがな（カタカナもOK）」のみを使用し、漢字や余計な文章は一切含めないでください。純粋なJSONオブジェクトのみを返してください。
      
      {
        "name": "アイテムのなまえ（例：ほのおのつるぎ）",
        "type": "weapon または furniture",
        "emoji": "アイテムをあらわす絵文字を1つ（例：🔥）",
        "power": 500
      }
      
      ※powerの値は、100から1000までのランダムな数値を「数字のみ（クォーテーションや文字列なし）」で入れてください。
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

        // Extract JSON robustly from markdown or plain text
        let jsonStr = text;
        const jsonBlockMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonBlockMatch) {
            jsonStr = jsonBlockMatch[1];
        } else {
            // Fallback: Find outermost '{' and '}'
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start !== -1 && end !== -1 && end > start) {
                jsonStr = text.substring(start, end + 1);
            }
        }

        if (!jsonStr) {
            console.error("No JSON found. Raw text:", text);
            return NextResponse.json({ error: "Failed to parse AI response: No JSON found", raw: text }, { status: 500 });
        }

        // Additional cleanup for Gemini quirks
        jsonStr = jsonStr.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

        const itemData = JSON.parse(jsonStr);

        return NextResponse.json(itemData);

    } catch (error: any) {
        console.error("Gemini API error:", error);
        return NextResponse.json({ error: "API Error or Parse Error", details: error.message }, { status: 500 });
    }
}
