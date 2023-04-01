import { Configuration, OpenAIApi } from "openai";

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
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(text, mode),
            temperature: 0.6,
            max_tokens: 2000,
        });
        res.status(200).json({
            result: completion.data.choices[0].text.trim(),
        });
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
        Summarize:
            "Highlight the main thing in the text and describe it in 100 words at most:",
        MainLines:
            "Highlight the main points in the text and display them as a numbered list with talking points:",
    };

    const inputText = modes[mode];
    if (!inputText) {
        throw new Error(`Unsupported mode: ${mode}`);
    }

    return `${inputText} ${text} Summary:`;
}
