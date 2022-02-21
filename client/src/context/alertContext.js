import React, { useState, useContext } from 'react';

const alertContext = React.createContext();

export function useAlert(){
    return useContext(alertContext);
}

export function AlertProvider({children}){
    const [alert, setAlert] = useState({
        from:null,
        type:"",
        message:""
    });

    const value = {alert, setAlert};
    return (
        <alertContext.Provider value={value}>
            {children}
        </alertContext.Provider>
    );
}