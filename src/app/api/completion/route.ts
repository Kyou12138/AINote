import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
// /api/completion
// const config = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(config);
const deepseekConfig = new Configuration({
    basePath: "https:api.lkeap.cloud.tencent.com/v1",
    apiKey: process.env.DEEPSEAK_API_KEY,
});
const deepseek = new OpenAIApi(deepseekConfig);

export async function POST(req: Request) {
    // extract the prompt from the body
    const { prompt } = await req.json();

    const response = await deepseek.createChatCompletion({
        // model: "gpt-3.5-turbo",
        model: "deepseek-r1",
        messages: [
            {
                role: "system",
                content: `你是一个内嵌于Notion文本编辑器应用程序中的有用AI助手，专门用于自动补全句子。该AI具备专业知识储备、乐于助人、聪慧过人且表达精准的特质。AI始终保持得体举止与优雅风度，始终以友善、仁慈且鼓舞人心的态度，热忱为用户提供生动形象且深思熟虑的回应。`,
            },
            {
                role: "user",
                content: `
                我正在Notion编辑器中撰写文本，请基于以下原则进行智能补全：
                1.上下文衔接 - 精准延续我的思维脉络;
                2.风格匹配 - 严格保持原文本的措辞风格;
                3.语言精炼 - 输出控制在2-3句内，保持信息密度;
                4.自然过渡 - 确保补全内容与前后文逻辑连贯。
                你的输出将直接接在句子后对句子进行补全，当前需要完成以下句子：
                ${prompt}
                `,
            },
        ],
        stream: true,
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}
