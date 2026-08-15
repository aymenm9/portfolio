import { useState, useRef, useEffect } from 'react'
import { TbMessageChatbot } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { UserChat, BotChat } from './chatComp';
import '../css/chatbot.css';
import 'github-markdown-css/github-markdown.css';

export default function ChatBot({ apiUrl }) {

    const [chatBot, setChatBot] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const startChatBot = () => setChatBot(true);
    const closeChatBot = () => setChatBot(false);
    const inputRef = useRef();

    const sendMassage = (e) => {
        if (e.type === 'click' || (e.key === 'Enter')) {
            const userText = inputRef.current.value.trim();
            if (!userText || loading) return;

            const user_input = {
                role: 'user',
                text: userText,
            };

            const data = {
                user_input,
                chat_history: {
                    history: chatHistory,
                },
            };

            setLoading(true);
            fetch(`${apiUrl}/api/v1/chat_bot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then((responce) => {
                if (responce.ok) return responce.json();
                return null;
            }).then((res) => {
                const bot = res
                    ? {
                        role: 'bot',
                        text: res.text ?? res.response ?? res.reply ?? res.message ?? res.output ?? '',
                        type: res.type === 'html' ? 'html' : 'markdown',
                    }
                    : { role: 'bot', text: 'Something went wrong. Please try again.', type: 'markdown' };
                setChatHistory((prev) => [...prev, user_input, bot]);
                inputRef.current.value = '';
            }).catch(() => {
                setChatHistory((prev) => [...prev, user_input, { role: 'bot', text: 'Network error — the bot service may be waking up. Try again in a moment.', type: 'markdown' }]);
            }).finally(() => setLoading(false));
        }
    };
    const chatRef = useRef(null);
    useEffect(() => {
        if (chatBot && chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatHistory, chatBot, loading]);



    return (
        <div className="chat-bot">
            {
                chatBot ? (
                    <div className='chat'>

                        <div className='chat-header'>
                            <h4>Aymen-Bot</h4>
                            <button onClick={closeChatBot} className='close-chat'><IoMdCloseCircle size={25} /></button>
                        </div>
                        <hr />



                        <ul className='chat-body' ref={chatRef}>
                            {chatHistory.map((chat, index) => {
                                if (!chat) return null;
                                return chat.role === 'user'
                                    ? <UserChat chat={chat} key={index} />
                                    : <BotChat chat={chat} key={index} />
                            })}
                            {loading && <li className="bot-chat chat-typing">Aymen-Bot is typing<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></li>}
                        </ul>

                        <div className='chat-footer'>
                            <hr />
                            <div className='chat-input'>
                                <input ref={inputRef} type="text" placeholder='enter your question' onKeyDown={sendMassage} disabled={loading} />
                                <button onClick={sendMassage} disabled={loading}><IoMdSend /></button>
                            </div>
                        </div>


                    </div>

                ) : (
                    <button onClick={startChatBot} className='start-chat'><span className="icon"><TbMessageChatbot /></span><span className='text'>start-chat</span></button>
                )
            }

        </div>
    );
}