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


function Register(){
    
    const [data, setData] = useState({
        username:"",
        email:"",
        password:""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [usernameErr, setUsernameErr] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [loading, setloading] = useState(false);

    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const { alert, setAlert } = useAlert();

    const handleChange = (e) =>{
        setData(prev =>{
            return {
                ...prev,
                [e.target.name]:e.target.value
            };
        });

        if(emailErr) setEmailErr("");
        if(passwordErr) setPasswordErr("");
        if(usernameErr) setUsernameErr("");
    }

    const handleInvalid = (e) =>{
        e.preventDefault();
        if(e.target.name === "email"){
            setEmailErr("Invalid email");
        }else if(e.target.name === "password"){
            setPasswordErr("Invalid password");
        }else{
            setUsernameErr("username must be at least 3 characters")
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setloading(true);
        
        let url = "http://localhost:8080/api/auth/register";
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
                });
                localStorage.setItem("token", JSON.stringify(response.data.token));
                localStorage.setItem("refreshToken", JSON.stringify(response.data.refreshToken));
            }else{
                console.log(response);
            }
        }catch(err){
            setAlert({
                from:"register",
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
        if(alert.from === "register"){
            navigate("/register");
        }
    }, [navigate, alert]);

    if(loading){
        return <Loader />
    }


    return (
        <div className="register">
            
            <Box className="form" component="form" onSubmit={handleSubmit}>
                <h1>Register</h1>
                <TextField
                    className="input"
                    error={Boolean(usernameErr)}
                    helperText={usernameErr}
                    label="Username"
                    type="text"
                    name="username"
                    variant="outlined"
                    value={data.username}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    minLength={3}
                    required
                />
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
                    minLength="8"
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
                <Button variant="outlined"type="submit">Register</Button>
            </Box>
        </div>
    );
}

export default Register;