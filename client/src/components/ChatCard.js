import { useNavigate } from "react-router-dom";
import "../styles/ChatCard.css";
import {IconButton} from "@mui/material";
import api from "../services/api";
import { useAlert } from "../context/alertContext";
import { useAuth } from "../context/userContext";
import { useEffect, useState } from "react";

function ChatCard({chat}){
    const navigate = useNavigate();
    const {setAlert} = useAlert();
    const {setUser} = useAuth();
    const [loading, setLoading] = useState();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    function handleClick(param){
        if(param === "navigate"){}
    }

    async function handleExit(){
        setLoading(true);
        let url = "/chat/exist";
        try {
            const response = await api.put(url ,{chatId:chat.id});
            if(response.data.success){
                setSuccess(true);
            }else{
                console.log(response);
            }
            setLoading(false);
        }catch(err){
            setLoading(false);
            setError(err.response?.data.message || err.message);
        }
    }

    useEffect(() =>{
        if(success){
            console.log(chat.id);
            setAlert({
                from:"chatCard",
                type:"success",
                message:"exiting chat successfully"
            });
            setUser(prev =>({
                ...prev,
                info:{
                    ...prev.info,
                    chats:prev.info.chats.filter(ch => ch.id !== chat.id)
                }
            }));
            navigate("/chat");
        }else if(error){
            setAlert({
                from:"chatCard",
                type:"success",
                message:error
            });
        }
    }, [success, error]);

    return (
        <div className="chat_card">
            <h2
            style={{marginRight:"25px", height:"100%", padding:"15px"}}
            onClick={() =>navigate("/chat/"+chat.id)}
            >{chat.name}</h2>
            <div className="exist_btn" onClick={handleExit}>
                <IconButton className="exist_icon">
                    {loading? "...":"exit"}
                </IconButton>
            </div>
        </div>
    );
}

export default ChatCard;