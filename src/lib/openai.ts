import { Configuration, OpenAIApi } from "openai-edge";
import OpenAI from "openai";
import tencentcloud from "tencentcloud-sdk-nodejs-hunyuan";

const config = new Configuration({
    basePath: "https://free.zeroai.chat/v1",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const deepseekConfig = new Configuration({
    basePath: "https:api.lkeap.cloud.tencent.com/v1",
    apiKey: process.env.DEEPSEAK_API_KEY,
});
const deepseek = new OpenAIApi(deepseekConfig);

export async function generateImagePrompt(name: string) {
    try {
        console.log(Date.now, ": enter generateImagePrompt: ", name);
        const response = await deepseek.createChatCompletion({
            model: "deepseek-r1",
            // const response = await openai.createChatCompletion({
            // model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content:
                        "你是一个富有创造力且乐于助人的AI助手，能够为我的笔记生成有趣的缩略图描述。你的输出将被输入DALL-E API以生成缩略图。描述需要保持极简主义与扁平化风格。",
                },
                {
                    role: "user",
                    content: `请为我的笔记本标题生成缩略图描述，标题为 ${name}`,
                },
            ],
        });
        const data = await response.json();
        const image_description = data.choices[0].message.content;
        return image_description as string;
    } catch (error) {
        console.error("Error generating ImagePrompt:", error);
    }
}

const openaiForImg = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://free.zeroai.chat/v1",
});
const openaiForImgQQ = new OpenAI({
    apiKey: process.env.HUNYUAN_API_KEY,
    baseURL: "https://api.hunyuan.cloud.tencent.com/v1",
});
export async function generateImage(image_description: string) {
    try {
        console.log(Date.now, ": enter generateImage: ", image_description);
        const response = await openaiForImgQQ.images.generate({
            model: "hunyuan-turbo",
            // const response = await openaiForImg.images.generate({
            //     model: "dall-e-3",
            prompt: image_description,
            n: 1,
            // size: "256x256",
        });
        const image_url = response.data[0].url;
        return image_url as string;
    } catch (error) {
        console.log("Error generate Image", error);
    }
}

//tencent
const HunyuanClient = tencentcloud.hunyuan.v20230901.Client;
const clientConfig = {
    credential: {
        secretId: process.env.HUNYUAN_SECRET_ID,
        secretKey: process.env.HUNYUAN_SECRET_KEY,
    },
    region: "ap-guangzhou",
    profile: {
        httpProfile: {
            endpoint: "hunyuan.tencentcloudapi.com",
        },
    },
};
// 实例化要请求产品的client对象,clientProfile是可选的
const client = new HunyuanClient(clientConfig);
export async function generateImageTencent(image_description: string) {
    const params = { Prompt: image_description, RspImgType: "url" };
    const data = await client.TextToImageLite(params);
    return data.ResultImage;
}
