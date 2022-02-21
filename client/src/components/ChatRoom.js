import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/userContext";
import ChatModel from "./ChatModel";
import ContactModel from "./ContactModel";
import Header from "./Header";
import Sidebar from "./Sidebar";
import api from "../services/api";
import { useAlert } from "../context/alertContext";
import {io} from "socket.io-client";
import  { CHAT_SERVER_URL } from "../url";
import Message from "./Message";
import "../styles/ChatRoom.css";
import { Button, IconButton, Skeleton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function connectChatServer(){
    const socket = io(CHAT_SERVER_URL, {
        auth: {
            token: JSON.parse(localStorage.getItem("token"))
        }
    });

    return socket;
}


function ChatRoom(){
    const [model, setModel] = useState(null);
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const params = useParams();
    const endChat = useRef();
    const socketRef = useRef();
    const message = useRef();

    useEffect(() =>{
        if(!user.isLoggedIn){
            navigate("/")
        }
    }, [user, navigate]);

    useEffect(() =>{
        async function getChat(){
            let url = "/chat/"+params.id;
            try{
                const response = await api.get(url);
                if(response.data.success){
                    setChat(response.data.chat);
                    console.log(response.data.chat)
                }else{
                    console.log(response);
                }
            }catch(err){
                setAlert({
                    from:"chatRoom",
                    type:"error",
                    message:err.response?.data.message || err.message
                })
            }
            setLoading(false);
        }

        getChat();
    }, []);

    useEffect(() =>{
        
        let socket = null;

        if(!socketRef.current){
            socket = connectChatServer();
            socketRef.current = socket;
            socket?.on("connect_error", (err) => {
                console.log(err);
                if(err.message === "No token is provided"){
    
                }
            });
            socket?.on("server-chat", (newMessage) =>{
                console.log(newMessage);
                setChat(prev => ({
                   ...prev,
                   messages:[...prev.messages, newMessage]
                }));
                endChat.current.scrollIntoView({smooth :true});
            });
        }
        if(chat && socketRef.current){
            socket.emit("join-chat", chat._id);
        } 

        return () => {
            socket?.disconnect();
            socketRef.current = null;
        }
    }, [chat]);

    function sendMessage(e) {
        e.preventDefault();
        let text = message.current.value;
        if(text === "")return;

        socketRef.current.emit("client-chat", {
            chatId:chat._id,
            text,
            username:user.info.username,
            userInfo:user.info.id,
        });
        message.current.value = "";
    }

    if(loading || !user.info){
        return (
            <div className="dashboard">
                <Header />
                <Sidebar New={setModel} />
                <div className="chat_room">
                    {
                        Array(5).fill(null).map((_, i) =>(
                            <Skeleton
                                key={i}
                                style={{margin:"5px auto"}}
                                width="95%"
                                height="100px"
                            />
                        ))
                    }
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Header />
            <Sidebar New={setModel} />
            {model === "chat" && <ChatModel close={() =>setModel(null)} />}
            {model === "contact" && <ContactModel close={() =>setModel(null)} />}
            <div className="chat_room">
                <h2 className="chat_header">
                    {chat?.name}
                    <IconButton onClick={() =>navigate("/chat")}style={{float: 'right'}}>
                        <CloseIcon />
                    </IconButton>
                </h2>
                <div className="chat_messages">
                    {
                        chat?.messages.map(message =>(
                            <Message
                                key={message.id}
                                username={message.username}
                                text={message.text}
                                sentAt={message.sentAt}
                            />
                        ))
                    }
                    <div ref={endChat}></div> 
                </div>
                <form onSubmit={sendMessage}>
                    <input
                       type="text"
                       name="message"
                       ref={message}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!message}
                        >send</Button>
                </form>
            </div>
        </div>
    );
}

export default ChatRoom;