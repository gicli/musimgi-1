import { GoogleGenAI, Type } from "@google/genai";
import { Flower, ResponseData } from "../types";

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY가 설정되지 않았습니다. 추천 기능을 사용하려면 Google Gemini API 키가 필요합니다.");
  }
  return new GoogleGenAI({ apiKey });
};

const flowerSchema: any = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      rank: { type: Type.INTEGER },
      name: { type: Type.STRING },
      englishName: { type: Type.STRING, description: "Common English name for image search" },
      plantingPeriod: { type: Type.STRING },
      bloomingPeriod: { type: Type.STRING },
      characteristics: { type: Type.STRING },
      caution: { type: Type.STRING },
      relatedFlowers: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["name", "description"]
        },
        description: "5 related popular varieties or similar flowers with brief descriptions"
      },
    },
    required: ["rank", "name", "englishName", "plantingPeriod", "bloomingPeriod", "characteristics", "caution", "relatedFlowers"],
  },
};

export const identifyFlower = async (base64Image: string, mimeType: string): Promise<ResponseData> => {
  const ai = getAIClient();
  
  const prompt = `
    이 이미지에 있는 꽃이 무엇인지 식별하고, 해당 꽃에 대한 상세 가드닝 가이드를 마크다운(Markdown) 형식으로 작성해 주세요.
    
    [지침]
    1. 답변에 제목(예: '# 장미 가이드')을 포함하지 마세요.
    2. 답변은 반드시 아래의 [구성 순서]를 엄격히 지켜야 합니다.

    [구성 순서]
    1. 식별 결과: 꽃의 이름(한글 및 영문)을 명확히 밝히세요.
    2. 묘종 시기 및 개화 시기: 이 꽃을 심기 좋은 시기와 꽃이 피는 시기를 설명하세요.
    3. 꽃의 특징: 이 꽃만의 매력이나 특징을 설명하세요.
    4. 키울 때 주의사항: 관리법(물주기, 햇빛 등)을 상세히 알려주세요.
    5. 인기 품종 TOP 5: 추천하는 품종 5가지를 간단히 소개해 주세요.

    친절하고 전문적인 가드너의 톤으로 답변해 주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        { text: prompt }
      ],
      config: {
        temperature: 0.4,
      }
    });

    const content = response.text;
    if (!content) throw new Error("꽃을 식별하지 못했습니다.");

    // 이름 추출 시도 (첫 줄이나 특정 패턴에서)
    const nameMatch = content.match(/꽃의 이름.*:?\s*([가-힣\s]+)/) || content.match(/\*\*([가-힣\s]+)\*\*/);
    const flowerName = nameMatch ? nameMatch[1].trim() : "식별된 꽃";

    return {
      type: 'detail',
      name: flowerName,
      content: content
    };
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("이미지 분석 중 오류가 발생했습니다. 선명한 꽃 사진을 업로드해 주세요.");
  }
};

export const getFlowerRecommendations = async (userQuery?: string): Promise<ResponseData> => {
  const ai = getAIClient();
  const date = new Date();
  const currentMonth = (date.getMonth() + 1) + "월";
  
  const query = userQuery?.trim() || "";
  
  // 일반적인 시기별 추천인지, 특정 식물에 대한 질문인지 판단
  const isGeneralQuery = !query || /뭐심지|뭐 심지|추천|지금|이달|^\d{1,2}월?$/.test(query);

  if (!isGeneralQuery) {
    const prompt = `
      사용자가 특정 꽃인 '${query}'에 대해 상세 정보를 요청했습니다. 
      당신은 전문 가드너로서 다음 지침에 따라 반드시 마크다운(Markdown) 형식으로 답변해 주세요.

      [지침]
      1. 답변에 제목(예: '# ${query} 가이드')을 포함하지 마세요. (UI에서 자동으로 표시됨)
      2. '${query}'의 정확한 영문 일반명(예: Hydrangea, Rose, Lily, Tulip, Pansy 등)을 먼저 확인하세요.
      3. 답변은 반드시 아래의 [구성 순서]를 엄격히 지켜야 합니다.

      [구성 순서]
      
      0. 메인 이미지: 답변의 가장 처음에 '${query}'의 정확한 이미지를 포함하세요.
         - 형식: ![${query} 메인](https://image.pollinations.ai/prompt/botanical%20photo%20of%20a%20real%20{영문명}%20flower%20in%20a%20garden,%20high%20resolution?width=1200&height=600&nologo=true)
         - {영문명} 부분에 반드시 파악한 영문 이름을 넣으세요.

      1. 묘종 시기 및 개화 시기: '${query}'을(를) 심기 좋은 시기(묘종 시기)와 꽃이 피는 시기(개화 시기)를 상세히 설명하세요.
      2. 꽃의 특징: '${query}'만의 독특한 매력이나 식물학적 특징을 설명하세요.
      3. 키울 때 주의사항: '${query}'을(를) 건강하게 키우기 위해 꼭 알아야 할 관리법(물주기, 햇빛, 온도, 토양 등)이나 주의할 점을 상세히 나열하세요.
      4. 인기 품종 TOP 5 및 소개: 가장 인기 있는 '${query}' 품종 5가지를 추천하고 각각에 대해 간단히 소개해 주세요. 
         - **중요: 인기 품종 소개에는 이미지를 절대 포함하지 마세요. 오직 텍스트로만 설명하세요.**

      친절하고 전문적인 톤으로 답변해 주세요.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      const content = response.text;
      if (!content || content.length < 10) {
        throw new Error("Gemini가 충분한 답변을 생성하지 못했습니다.");
      }

      return {
        type: 'detail',
        name: `${query}`,
        content: content
      };
    } catch (error) {
      console.error("Gemini Detail Query Error:", error);
      throw new Error(`'${query}'에 대한 정보를 가져오는 중 오류가 발생했습니다.`);
    }
  }

  // 일반적인 시기별 추천
  let context = query;
  if (!context || context === '지금' || context === '뭐심지' || context === '뭐 심지' || context.includes('뭐심지')) {
    context = `${currentMonth}에 한국에서 심기 가장 좋은 인기 꽃 묘종 TOP 10`;
  }

  const prompt = `
    사용자 입력: "${context}"
    당신은 대한민국 최고의 가드닝 전문가입니다. 
    현재 시기(${currentMonth}) 또는 사용자가 요청한 시기에 한국에서 심기 가장 좋은 꽃 '묘종(모종)' 10가지를 추천하세요.
    초보자가 기르기 쉬운 인기 종류를 우선순위로 정렬하여 JSON 형식으로 응답하세요.
    
    각 꽃에 대해 다음을 포함해야 합니다:
    1. 'englishName': 이미지 검색을 위한 정확한 영문 일반명.
    2. 'plantingPeriod': 묘종 시기.
    3. 'bloomingPeriod': 개화 시기.
    4. 'characteristics': 꽃의 특징.
    5. 'caution': 키울 때 주의사항.
    6. 'relatedFlowers': 해당 꽃의 **인기 품종 5가지** (이름과 간단한 특징/소개 포함).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: flowerSchema,
        temperature: 0.2, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("결과를 가져오지 못했습니다.");

    const data = JSON.parse(text) as Flower[];
    return {
      type: 'list',
      flowers: data.sort((a, b) => a.rank - b.rank)
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
