"use client";
import { useState } from "react";
import { fetchGifs } from "./GifSearch";

const Home = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [gifs, setGifs] = useState([]);
    const [giphyShow, setGiphyShow] = useState(false);

    //
    const inputChange = async (event) => {
        const value = event.target.value;
        setInput(value);

        if (value.startsWith("/gif ")) {
            const word = value.slice(5);
            if (word.trim()) {
                setGiphyShow(true);
                const fetchedGifs = await fetchGifs(word);
                setGifs(fetchedGifs);
            }
        } else {
            setGiphyShow(false);
        }
    };
    //
    const sendGif = (gifUrl: string) => {
        setMessages([...messages, { type: "gif", url: gifUrl, time: new Date().toLocaleTimeString() }]);
        setInput("");
        setGiphyShow(false);
    };
    //
    const sendMessage = () => {
        if (input.trim() && !giphyShow) {
            setMessages([
                ...messages,
                { type: "text", content: input, time: new Date().toLocaleTimeString() },
            ]);
            setInput("");
        }
    };
    //
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && input.trim()) {
            sendMessage();
        }
    };
    //
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto pb-4 p-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start ${msg.type === "text" ? "mb-2" : "mb-4"}`}>
                            <div className="flex-1">
                                {msg.type === "text" ? (
                                    <div className="bg-gray-200 p-2 rounded-lg">
                                        {msg.content}
                                    </div>
                                ) : (
                                    <img src={msg.url} className="rounded-lg" />
                                )}
                            </div>
                            <div className="text-sm ml-2">{msg.time}</div>
                        </div>
                    ))}
                </div>

                {giphyShow && (
                    <div className="w-full bg-white border rounded-lg shadow-lg mt-2 max-h-40 overflow-y-auto flex flex-col">
                        {gifs.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                                {gifs.map((gif) => (
                                    <div
                                        key={gif.id}
                                        className="cursor-pointer hover:shadow-lg"
                                        onClick={() => sendGif(gif.images.fixed_height.url)}
                                    >
                                        <img
                                            src={gif.images.fixed_height.url}
                                            className="rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">Ничего не найдено</p>
                        )}
                    </div>
                )}

                <div className="relative px-1 p-2 border-t-2 bg-gray-100 rounded-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={inputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Напишите сообщение..."
                        className="border w-full rounded-lg px-4 py-2"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;

