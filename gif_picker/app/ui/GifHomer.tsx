"use client";
import React, { useState } from 'react';
import GIPHY_API_KEY from "@/TOKEN";

// Определяем тип переменных
interface Message {
    type: "text" | "gif";
    content?: string;
    url?: string;
    time: number;
}
interface Gif {
    id: string;
    images: {
        fixed_height: {
            url: string;
        };
    };
}

const GifHomer = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [gifs, setGif] = useState<Gif[]>([]);
    const [giphyShow, setGiphyShow] = useState(false);

    // Поиск gif через API
    const gifSearch = async (word: string) => {
        try {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${word}&limit=12`, 
                { method: 'GET' }
            );
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    // Отправка gif
    const sendGif = (gifUrl: string) => {
        const time = new Date().getTime();
        setMessages([...messages, { type: "gif", url: gifUrl, time }]);
        setInput("");
        setGiphyShow(false);
    };

    // Разделение текста на части
    const renderInputText = () => {
        const command = "/gif ";
        if (input.startsWith(command)) {
            const word = input.slice(command.length); // Получаем текст после команды
            return (
                    <span className="highlight">{command}</span>

            );
        }
    };


    // Установка сообщения и проверка на команду
    const messageInput = async (event: { target: { value: any; }; }) => {
        const value = event.target.value;
        setInput(value);
    
        if (value.startsWith("/gif ")) {
            const word = value.slice(5);
            if (word.trim()) {
                setGiphyShow(true);
                const getGif = await gifSearch(word);
                setGif(getGif);
            } else {
                setGiphyShow(false);
            }
        } else {
            setGiphyShow(false);
        }
    };

    // отправки сообщения
    const keyDown = (event: { key: string; }) => {
        if (event.key === "Enter" && input.trim() && !giphyShow) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: "text", content: input, time: Date.now() }
            ]);
            setInput("");
            setGiphyShow(false);
        }
    };

    return (
        <div className="container">
            <div className="main-block">

                {/* чат */}
                <div className="chat">
                    {messages.map((msg, index) => (
                        <div key={index} className="message-container">
                            {msg.type === "text" ? (
                                <div className="text-message">
                                    <p>{msg.content}</p>
                                </div>
                            ) : (
                                <div className="gif-message">
                                    <img src={msg.url} alt="gif" />
                                </div>
                            )}
                            <span className="message-time">
                                {new Date(msg.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                </div>

                {/* всплывающее окно */}
                {giphyShow && (
                    <div className="gif-window">
                        <div className="scrolling">
                        <div className="gif-grid">
                            {gifs.length > 0 ? (
                                gifs.map(gif => (
                                    <img
                                        key={gif.id}
                                        src={gif.images.fixed_height.url}
                                        className="gif-item"
                                        onClick={() => sendGif(gif.images.fixed_height.url)}
                                    />
                                ))
                            ) : (
                                <p></p>
                            )}
                        </div>
                        </div>
                    </div>
                )}

                {/* ввод */}
                <div className="input-div">
                    <div className="input-preview">
                        {renderInputText()}
                    </div>
                    <input
                        className="input-block roboto-regular"
                        placeholder="Напишите сообщение..."
                        value={input}
                        onChange={messageInput}
                        onKeyDown={keyDown}
                        spellCheck={false}
                    />
                </div>
            </div>

        </div>

}

export default GifHomer;
