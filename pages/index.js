import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
    const [textAreaInput, setTextAreaInput] = useState("");
    const [result, setResult] = useState();
    const [mode, setMode] = useState("Summarize");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: textAreaInput, mode }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                );
            }

            setResult(data.result);
            // setTextAreaInput("");
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
                <form onSubmit={onSubmit}>
                    <div className={styles.textareaAndButtons}>
                        <div className={styles.textareaWrapper}>
                            <textarea
                                name="text"
                                placeholder="Enter your text here"
                                value={textAreaInput}
                                onChange={(e) =>
                                    setTextAreaInput(e.target.value)
                                }
                                className={styles.textarea}
                            ></textarea>
                        </div>
                        <div className={styles.buttons}>
                            <button
                                type="button"
                                className={`${styles.button} ${
                                    mode === "Summarize" ? styles.selected : ""
                                }`}
                                onClick={() => setMode("Summarize")}
                            >
                                Summarize
                            </button>
                            <button
                                type="button"
                                className={`${styles.button} ${
                                    mode === "MainLines" ? styles.selected : ""
                                }`}
                                onClick={() => setMode("MainLines")}
                            >
                                MainLines
                            </button>
                        </div>
                    </div>
                    <div className={styles.spacing}></div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles.submitButton}
                    >
                        Summarize Text
                    </button>
                </form>
                {result && (
                    <div className={styles.resultContainer}>{result}</div>
                )}
            </main>
        </div>
    );
}
