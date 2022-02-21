import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button, IconButton } from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Loader from "./Loader";
import axios from "axios";
import "../styles/Login.css";
import { useAlert } from "../context/alertContext";
import { API_URL } from "../url";


function Login(){
    
    const [data, setData] = useState({
        email:"",
        password:""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const { alert, setAlert} = useAlert();

    const handleChange = (e) =>{
        setData(prev =>{
            return {
                ...prev,
                [e.target.name]:e.target.value
            };
        });

        setEmailErr("");
        setPasswordErr("");
    }

    const handleInvalid = (e) =>{
        e.preventDefault();
        if(e.target.name === "email"){
            setEmailErr("Invalid email");
        }else{
            setPasswordErr("Invalid password");
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setloading(true);
        
        let url = API_URL+"api/auth/login";
        const config = {
            headers: {
            "Content-Type": "application/json",
          },
        }
        try{
            const response = await axios.post(url, data, config);
            if(response.data.success){
                setUser({
                   isLoggedIn:true,
                   info:response.data.user,
                   token:response.data.token,
                   refreshToken:response.data.refreshToken
                })
                localStorage.setItem("token", JSON.stringify(response.data.token));
                localStorage.setItem("refreshToken", JSON.stringify(response.data.refreshToken));
            }else{
                console.log(response);
            }
        }catch(err){
            setAlert({
                from:"login",
                type:"error",
                message:err.response?.data.message || err.message
            });
        }
        setloading(false);
    }



    useEffect(() =>{
        if(user.isLoggedIn){
            navigate("/chat");
        }
    }, [navigate, user]);

    useEffect(() =>{
        if(alert.from === "login"){
            navigate("/");
        }
    }, [alert, navigate])

    if(loading){
        return <Loader />
    }


    return (
        <div className="login">
            
            <Box className="form" component="form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <TextField
                    className="input"
                    error={Boolean(emailErr)}
                    helperText={emailErr}
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    name="email"
                    variant="outlined"
                    value={data.email}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    required
                />
                <div className="password_container">
                <TextField
                    className="input"
                    error={Boolean(passwordErr)}
                    helperText={passwordErr}
                    id="outlined-adornment-password"
                    type={showPassword? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    label="Password"
                    required
                />
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>setShowPassword(prev =>!prev)}
                    className="show_password"
                >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
                </div>
                <Button variant="outlined"type="submit">Login</Button>
                <Button
                    className="create"
                    variant="outlined"
                    onClick={() =>navigate('/register')}
                >Create account</Button>
            </Box>
        </div>
    );
}

export default Login;