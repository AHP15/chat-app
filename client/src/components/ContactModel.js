import { useState } from "react";
import { Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useAlert } from "../context/alertContext";
import api from "../services/api";
import { useAuth } from "../context/userContext";

function ContactModel({close}){
    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState(null);
    const [loading , setLoading] = useState(false);
    const {alert, setAlert} = useAlert();
    const {user, setUser} = useAuth();

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        let url = "/contact/new";

        try{
            const response = await api.put(url, {email});
            if(response.data.success) {
                setUser(prev => ({
                    ...prev,
                    info:{
                        ...prev.info,
                        contacts:[...prev.info.contacts, {
                            username:response.data.contact.username,
                            id:response.data.contact.id,
                            email:response.data.contact.email
                        }]
                    }
                }));

                setAlert({
                    from:"contactModel",
                    type:"success",
                    message:"contact has been added successfully"
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
            });
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
                <h1>New Contact</h1>
                <input
                    type="email"
                    value={email}
                    onChange={(e) =>setEmail(e.target.value)}
                    onInvalid={() =>setEmailErr("Invalid email")}
                    required
                />
                <p>{emailErr}</p>
                <Button
                  type="submit"
                  variant="outlined"
                  style={{marginTop:"15px"}}
                  disabled={loading}
                >Submit</Button>
            </form>
        </div>
    );
}

export default ContactModel;