import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { useAlert } from './context/alertContext';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useAuth } from './context/userContext';
import { useEffect } from 'react';
import api from './services/api';
import ChatRoom from './components/ChatRoom';

function App() {

  const {alert, setAlert} = useAlert();
  const { user, setUser } = useAuth();

  function handleClose(){
    setAlert({
      from:null,
      type:null,
      message:null,
    });
  }
  

  useEffect(() =>{
    async function getUserInfo(){
      let url = "/user/profile";

      try{
        const response = await api.get(url);

        if(response.data.success){
          setUser(prev => ({
            ...prev,
            info:response.data.user
          }));
        }else{
          console.log(response);
        }
      }catch(err){
        console.log(err.response.data.message || err.message);
        let MSG = err.response.data.message || err.message;
        if(
          MSG === "Refresh token is not in database!"
          || MSG === "Refresh token was expired. Please make a new login request"
        ){
          MSG = "Please make a new Login";
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }

        setAlert({
          from:"app",
          type:"error",
          message:MSG
        });

        setUser({
          isLoggedIn:false,
          info:null,
          token:null,
          refreshToken:null,
        });
      }

    }

    if(user.isLoggedIn && user.token && !user.info){
      getUserInfo();
    }
  }, [user])

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Dashboard />} />
          <Route path="/chat/:id" element={<ChatRoom />} />
        </Routes>
      </Router>

      {alert.type && (
          <Alert
            onClose={handleClose}
            className="alert"
            severity={alert.type}
          >
            <AlertTitle>{alert.type}</AlertTitle>
            {alert.message}
          </Alert>
      )}
    </div>
  );
}

export default App;
