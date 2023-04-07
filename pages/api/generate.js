import { Configuration, OpenAIApi } from "openai";
import {
    codeExplainText,
    summarizeText,
    mainLinesText,
} from "../prompts/prompts";
import axios from "axios";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    const mode = req.body.mode || "Summarize";

    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message:
                    "OpenAI API key not configured, please follow instructions in README.md",
            },
        });
        return;
    }

    const text = req.body.text || "";
    if (text.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid text",
            },
        });
        return;
    }

    try {
        const prompt = generatePrompt(text, mode);

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: prompt,
                    },
                    {
                        role: "user",
                        content: text,
                    },
                ],
                temperature: 0.6,
                max_tokens: 2000,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const completion = response.data.choices[0].message.content.trim();
        res.status(200).json({ result: completion });
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
}

function generatePrompt(text, mode) {
    console.log(mode);
    const modes = {
        Summarize: summarizeText,
        MainLines: mainLinesText,
        CodeExplain: codeExplainText,
    };

    const inputText = modes[mode];
    if (!inputText) {
        throw new Error(`Unsupported mode: ${mode}`);
    }

    return inputText;
}
