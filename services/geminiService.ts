import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Flower } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const flowerSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      rank: { type: Type.INTEGER },
      name: { type: Type.STRING },
      englishName: { type: Type.STRING, description: "Scientific or common English name of the flower for image generation" },
      plantingPeriod: { type: Type.STRING, description: "When to sow seeds or plant seedlings" },
      bloomingPeriod: { type: Type.STRING, description: "When the flower blooms" },
      characteristics: { type: Type.STRING, description: "Key features of the flower" },
      caution: { type: Type.STRING, description: "Care instructions or warnings" },
      relatedFlowers: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "5 specific varieties of this flower ranked by popularity"
      },
    },
    required: ["rank", "name", "englishName", "plantingPeriod", "bloomingPeriod", "characteristics", "caution", "relatedFlowers"],
  },
};

export const getFlowerRecommendations = async (userQuery?: string): Promise<Flower[]> => {
  const date = new Date();
  const currentMonth = date.toLocaleString('ko-KR', { month: 'long' });
  
  let context = userQuery?.trim();
  if (!context || context === '지금' || context === '뭐심지' || context === '뭐 심지' || context.includes('뭐심지') || context.includes('뭐 심지')) {
    context = `${currentMonth}에 한국에서 심기 가장 좋은 인기 묘종 TOP 10`;
  }

  const prompt = `
    사용자 입력: "${context}"

    당신은 한국의 가드닝 전문가 AI입니다. 
    사용자의 입력에 맞춰 다음 규칙에 따라 꽃 추천 리스트를 JSON으로 작성하세요.

    1. **대상 시기:** 현재 시점(${currentMonth}) 또는 사용자가 지정한 시기.
    2. **추천 기준:** 씨앗 파종보다는 초보자가 접근하기 쉬운 '묘종(모종)' 식재를 우선으로 합니다.
    3. **정렬:** 한국 내 유통량과 인기가 가장 높은 순서대로 1위부터 10위까지 정렬하세요.
    4. **내용:** 한국 기후에 적합한 정보를 제공하며, 설명은 친절한 한국어로 작성하세요.

    응답은 반드시 지정된 JSON 스키마 형식을 따라야 합니다.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: flowerSchema,
        temperature: 0.3, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(text) as Flower[];
    return data.sort((a, b) => a.rank - b.rank);

  } catch (error) {
    console.error("Error fetching flower data:", error);
    throw error;
  }
};