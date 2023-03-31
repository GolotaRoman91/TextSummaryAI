import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
    const [textAreaInput, setTextAreaInput] = useState("");
    const [result, setResult] = useState();

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: textAreaInput }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                );
            }

            setResult(data.result);
            setTextAreaInput("");
        } catch (error) {
            console.error(error);
            alert(error.message);
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
                    <textarea
                        name="text"
                        placeholder="Enter your text here"
                        value={textAreaInput}
                        onChange={(e) => setTextAreaInput(e.target.value)}
                    ></textarea>
                    <div className={styles.spacing}></div> {/* Add this line */}
                    <input type="submit" value="Summarize Text" />
                </form>
                <div className={styles.result}>{result}</div>
            </main>
        </div>
    );
}
