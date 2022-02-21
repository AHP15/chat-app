import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/userContext";
import { useAlert } from "../context/alertContext";
import CloseIcon from '@mui/icons-material/Close';
import api from "../services/api";


function ChatModel({close}){
    const [loading , setLoading] = useState(false);
    const { user , setUser} = useAuth();
    const [data, setData] = useState({
        name:"",
        users:[user.info.id]
    });
    const { setAlert} = useAlert();
    const handleInvalid = () =>{
        setAlert({
            from:"chatModel",
            type:"warning",
            message:"Please specify a chat name"
        })
    };
    const handleChange = (id) => {
        // if the client has been select a contact and want to removes it
        if(data.users.includes(id)){
            setData(prev => {
                return {
                    ...prev,
                    users:[...prev.users.filter(_id => _id !== id)],
                };
            });
        }else{
            // else just add contact to 
            setData(prev => {
                return {
                    ...prev,
                    users:[...prev.users, id],
                }
            })
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        let url = "/chat/new"
        if(data.users.length === 0) {
            setAlert({
                from:"chatModel",
                type:"warning",
                message:"Please specify a chat users"
            })
        }
        setLoading(true);
        try{
            const response = await api.post(url,data);
            if(response.data.success){
                setUser(prev => ({
                    ...prev,
                    info:{
                        ...prev.info,
                        chats:[...prev.info.chats, {
                            name:response.data.chat.name,
                            id:response.data.chat._id
                        }]
                    }
                }));

                setAlert({
                    from:"chatModel",
                    type:"success",
                    message:"chat has been created successfully"
                })
            }else{
                console.log(response);
            }
            close();
        }catch(err){
            console.log(err)
            setAlert({
                from:"chatModel",
                type:"error",
                message:err.response.data.message || err.message
            })
        }

        setLoading(false);
    }

    return (
        <div className="model">
            <form onSubmit={handleSubmit}>
                <IconButton
                   onClick={close}
                   style={{position: 'absolute', top: '10px', right: '10px'}}
                >
                    <CloseIcon />
                </IconButton>
                <h1>New Chat</h1>
                <input
                   type="text"
                   name="name"
                   placeholder="Chat name"
                   value={data.name}
                   onChange={(e) =>setData(prev =>({...prev, name:e.target.value}))}
                   onInvalid={handleInvalid}
                   required
                />

                <div className="contact_container">
                    {
                        user.info?.contacts?.map(contact => (
                            <div>
                                <input
                                   type="checkbox"
                                   value={data.users.includes(contact.id)}
                                   onChange={() =>handleChange(contact.id)}
                                   name={contact.email}
                                />
                                <label htmlFor={contact.email}>{contact.email}</label>
                            </div>
                        ))
                    }
                </div>

                <Button
                   type="submit"
                   variant="outlined"
                   disabled={loading}
                >Submit</Button>
            </form>
        </div>
    );
}

export default ChatModel;