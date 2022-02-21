import { useEffect, useState } from "react";
import { useAuth } from "../context/userContext";
import "../styles/Sidebar.css";
import Skeleton from '@mui/material/Skeleton';
import ChatCard from "./ChatCard";
import ContactCard from "./ContactCard";


function Sidebar({New}){
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() =>{
        if(user.info){
            setLoading(false);
            setChats(true);
        }
    }, [user]);

    useEffect(() =>{
        if(chats){
            setData(user.info?.chats);
        }else{
            setData(user.info?.contacts);
        }
    }, [chats, user]);

    function handleClick(){
        if(chats){
            New("chat");
        }else{
            New("contact")
        }
    }


    if(loading){
        return (
            <div className="sidebar">
                {
                    Array(4).fill(null).map((_, i) => (
                        <Skeleton
                        className="skeleton" 
                        key={i} 
                        variant="rectangular" 
                        width="90%" 
                        height={118}
                        />
                    ))
                }
            </div>
        );
    }

    return (
        <div className="sidebar">
            <div className="sidebar_container">
                <p
                  onClick={() =>setChats(prev => !prev)}
                  style={{
                    transform:`${chats? 'scale(1)':'scale(0.8)'}`
                  }}
                >Chats</p>
                <p 
                  onClick={() =>setChats(prev => !prev)}
                  style={{
                    transform:`${!chats? 'scale(1)':'scale(0.8)'}`
                  }}
                >Contacts</p>
            </div>
            <div className="sidebar_content">
                {
                    chats
                    ?data?.map(element => <ChatCard key={element.id} chat={element} />)
                    :data?.map(element => <ContactCard key={element.id} contact={element} />)
                }
            </div>
            <p
               onClick={handleClick}
               className="new_btn"
            >{chats? "New Chat":"New Contact"}</p>
        </div>
    );
}

export default Sidebar;