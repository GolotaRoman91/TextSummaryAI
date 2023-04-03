import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

const API_ENDPOINT = "/api/generate";
const CONTENT_TYPE = "application/json";
const SUMMARIZE_MODE = "Summarize";
const MAIN_LINES_MODE = "MainLines";

function TextSummarizerForm({
    onSubmit,
    mode,
    setMode,
    textAreaInput,
    setTextAreaInput,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit}>
            <TextAreaInput
                value={textAreaInput}
                onChange={(e) => setTextAreaInput(e.target.value)}
            />
            <ModeButtons mode={mode} setMode={setMode} />
            <Spacing />
            <SubmitButton isSubmitting={isSubmitting} />
        </form>
    );
}

function TextAreaInput({ value, onChange }) {
    return (
        <div className={styles.textareaWrapper}>
            <textarea
                name="text"
                placeholder="Enter your text here"
                value={value}
                onChange={onChange}
                className={styles.textarea}
            ></textarea>
        </div>
    );
}

function ModeButtons({ mode, setMode }) {
    return (
        <div className={styles.buttons}>
            <ModeButton
                mode={SUMMARIZE_MODE}
                currentMode={mode}
                setMode={setMode}
            />
            <ModeButton
                mode={MAIN_LINES_MODE}
                currentMode={mode}
                setMode={setMode}
            />
        </div>
    );
}

function ModeButton({ mode, currentMode, setMode }) {
    const isSelected = currentMode === mode;
    const className = `${styles.button} ${isSelected ? styles.selected : ""}`;

    return (
        <button
            type="button"
            className={className}
            onClick={() => setMode(mode)}
        >
            {mode}
        </button>
    );
}

function Spacing() {
    return <div className={styles.spacing}></div>;
}

function SubmitButton({ isSubmitting }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
        >
            Summarize Text
        </button>
    );
}

async function fetchResult(textAreaInput, mode) {
    const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": CONTENT_TYPE,
        },
        body: JSON.stringify({ text: textAreaInput, mode }),
    });

    if (response.status !== 200) {
        const data = await response.json();
        throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
        );
    }

    return response.json();
}

export default function Home() {
    const [textAreaInput, setTextAreaInput] = useState("");
    const [result, setResult] = useState();
    const [mode, setMode] = useState(SUMMARIZE_MODE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const data = await fetchResult(textAreaInput, mode);
            setResult(data.result);
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <Head>
                <title>Text Summarizer</title>
                <link rel="icon" href="/icon.svg" />
            </Head>
            <main className={styles.main}>
                <img src="/icon.svg" className={styles.icon} />
                <h3>Text Summarizer</h3>
                <TextSummarizerForm
                    onSubmit={onSubmit}
                    mode={mode}
                    setMode={setMode}
                    textAreaInput={textAreaInput}
                    setTextAreaInput={setTextAreaInput}
                    isSubmitting={isSubmitting}
                />
                {result && <ResultContainer result={result} />}
            </main>
        </div>
    );
}

function ResultContainer({ result }) {
    return <div className={styles.resultContainer}>{result}</div>;
}
