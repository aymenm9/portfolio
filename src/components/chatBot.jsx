import { useState,useRef, useEffect } from 'react'
import { TbMessageChatbot } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { UserChat, BotChat } from './chatComp';
import '../css/chatbot.css';
import 'github-markdown-css/github-markdown.css';

export default function ChatBot({apiUrl}) {

    const [chatBot, setChatBot] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const startChatBot = () => setChatBot(true);
    const closeChatBot = () => setChatBot(false);
    const inputRef = useRef();
    const sendMassage = (e) => {
        if (e.type === 'click' || (e.key === 'Enter')) {
            const userText = inputRef.current.value.trim();
            if (!userText) return;
    
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
    
            fetch(`${apiUrl}/api/v1/chat_bot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then((responce) => {
                if (responce.ok) {
                    return responce.json();
                }
            }).then((data) => {
                setChatHistory([...chatHistory, user_input, data]);
                inputRef.current.value = '';
            });
        }
    };
    const chatRef = useRef(null);
    useEffect(() => {
        if (chatBot && chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatHistory, chatBot]);
    


    return (
        <div className="chat-bot">
            {
                chatBot ?(
                    <div className='chat'>
                        
                        <div className='chat-header'>
                            <h4>Aymen-Bot</h4>
                            <button onClick={closeChatBot} className='close-chat'><IoMdCloseCircle size={25}/></button>
                        </div>
                        <hr />
                        
                        
                        
                        <ul className='chat-body' ref={chatRef}>
                        {chatHistory.map((chat, index) => {
                            console.log(chat);
                            if (!chat) return null;
                            return chat.role === 'user' 
                                ? <UserChat chat={chat} key={index}/> 
                                : <BotChat chat={chat} key={index}/>
                            })} 
                        </ul>
                        
                        <div className='chat-footer'>
                            <hr />
                            <div className='chat-input'>
                            <input ref={inputRef} type="text" placeholder='enter you question' onKeyDown={sendMassage}/><button><IoMdSend onClick={sendMassage}/></button>
                            </div>
                        </div>
                        
                        
                    </div>
                    
                ):(
                    <button onClick={startChatBot} className='start-chat'><span className='icom'><TbMessageChatbot /></span><span className='text'>start-chat</span></button>
                )
            }
            
        </div>
    );
}