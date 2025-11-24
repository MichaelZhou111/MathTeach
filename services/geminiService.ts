import { GoogleGenAI } from "@google/genai";
import { MathProblem, MathOperation } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Generates a short, fun, 1-sentence story visualization for a math problem.
 * Designed for 6-year-olds with a car racing theme.
 */
export const generateMathStory = async (problem: MathProblem): Promise<string> => {
  if (!process.env.API_KEY) {
    return "你能解开这个赛车谜题吗？";
  }

  try {
    const prompt = `
      你是一个针对6岁儿童的赛车手数学教练。
      请用一个非常简短、有趣的单句故事来可视化这道数学题：
      ${problem.num1} ${problem.operation} ${problem.num2} = ?

      规则：
      1. 使用适合6岁儿童的简单中文。
      2. 使用有趣的表情符号（汽车 🚗、赛车 🏎️、卡车 🚚、轮胎 🛞、加油站 ⛽、红绿灯 🚦、奖杯 🏆）来代表数字。
      3. 不要透露答案。
      4. 保持在25个字以内。
      5. 充满热情，语气要像是在解说一场精彩的比赛！

      例子：
      - "赛道上有3辆红车 🚗，又冲来了2辆蓝车 🚙，现在一共有几辆车？"
      - "维修站有5个轮胎 🛞，被赛车拿走了2个，还剩几个？"
      - "每辆卡车运送2个油桶 🛢️，3辆卡车一共运送了多少个？"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text?.trim() || "让我们一起数一数赛车吧！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "赛车手，你能算出这个数字吗？";
  }
};

/**
 * Generates a congratulatory message in Chinese.
 */
export const generateCheer = async (): Promise<string> => {
    if (!process.env.API_KEY) return "太棒了！";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "给我一句简短的（3-5个字）、热情的中文赞美，用来表扬刚刚做对数学题的6岁孩子。带上赛车相关的emoji。",
        });
        return response.text?.trim() || "冠军速度！🏆";
    } catch (e) {
        return "真棒！🎉";
    }
}