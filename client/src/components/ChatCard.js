import { useNavigate } from "react-router-dom";
import "../styles/ChatCard.css";

function ChatCard({chat}){
    const navigate = useNavigate();

    return (
        <div onClick={() =>navigate("/chat/"+chat.id)} className="chat_card">
            <h2>{chat.name}</h2>
        </div>
    );
}

export default ChatCard;