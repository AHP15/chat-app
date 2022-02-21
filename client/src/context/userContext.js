import React , {useEffect, useState, useContext} from "react";

const UserContext = React.createContext();

export function useAuth(){
    return useContext(UserContext);
}

export function UserProvider({children}){
    const [user, setUser] = useState({
        isLoggedIn: JSON.parse(localStorage.getItem('token'))? true : false,
        info:null,
        token:JSON.parse(localStorage.getItem('token')) || null,
        refreshToken:JSON.parse(localStorage.getItem('refreshToken')) || null
    });

    useEffect(() =>{
        console.log(user)
    }, [user]);
    const value = {user, setUser};
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}