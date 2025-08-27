
import { GoogleGenAI, Type } from "@google/genai";
import type { Nutrients } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalyzedFoodData {
  name: string;
  nutrients: Nutrients;
}

const foodSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "ชื่อของอาหารในรูปภาพ (ภาษาไทย)",
    },
    calories: {
      type: Type.NUMBER,
      description: "ปริมาณแคลอรี่โดยประมาณ",
    },
    protein: {
      type: Type.NUMBER,
      description: "ปริมาณโปรตีนโดยประมาณ (กรัม)",
    },
    carbs: {
      type: Type.NUMBER,
      description: "ปริมาณคาร์โบไฮเดรตโดยประมาณ (กรัม)",
    },
    fat: {
      type: Type.NUMBER,
      description: "ปริมาณไขมันโดยประมาณ (กรัม)",
    },
  },
  required: ["name", "calories", "protein", "carbs", "fat"],
};


export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<AnalyzedFoodData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "วิเคราะห์รูปภาพอาหารนี้ในฐานะนักโภชนาการ ประเมินชื่ออาหารและสารอาหารหลักสำหรับหนึ่งหน่วยบริโภคมาตรฐาน (แคลอรี่, โปรตีน, คาร์โบไฮเดรต, ไขมัน) และตอบกลับเป็นภาษาไทยในรูปแบบ JSON ที่กำหนดเท่านั้น",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: foodSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);

    return {
      name: parsedData.name || 'ไม่สามารถระบุชื่ออาหารได้',
      nutrients: {
        calories: parsedData.calories || 0,
        protein: parsedData.protein || 0,
        carbs: parsedData.carbs || 0,
        fat: parsedData.fat || 0,
      },
    };
  } catch (error) {
    console.error("Error analyzing food image with Gemini:", error);
    throw new Error("ไม่สามารถวิเคราะห์รูปภาพอาหารได้ กรุณาลองอีกครั้งหรือกรอกข้อมูลด้วยตนเอง");
  }
};
