import React from "react";
import { useAuth } from "../context/userContext";
import "../styles/Message.css";

const Message = React.memo(
    ({username, text, sentAt}) => {
        const { user } = useAuth();
        let time = new Date();
        let today = `${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`;
        sentAt = sentAt?.slice(0,9) === today 
            ? `Today at ${sentAt?.slice(10)}`
            :sentAt?.slice(0,9);

        return (
            <div className={`message_container ${user.info?.username === username?"fromMe":""}`}>
                <div className="message">
                <p className="message_user">{username}</p>
                <p className="message_text">{text}</p>
                <p className="message_time">{sentAt}</p>
                </div>
            </div>
        );
    }
);


export default Message;