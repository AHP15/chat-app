import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import ChatModel from "./ChatModel";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../styles/Dashboard.css"
import ContactModel from "./ContactModel";

function Dashboard(){
    const { user } = useAuth();
    const navigate = useNavigate();
    const [model, setModel] = useState(null);

    useEffect(() =>{
        if(!user.isLoggedIn){
            navigate("/")
        }
    }, [user, navigate]);
    
    return (
        <div className="dashboard">
            <Header />
            <Sidebar New={setModel} />
            {model === "chat" && <ChatModel close={() =>setModel(null)} />}
            {model === "contact" && <ContactModel close={() =>setModel(null)} />}
        </div>
    );
}

export default Dashboard;