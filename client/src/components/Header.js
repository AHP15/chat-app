import { useAuth } from "../context/userContext";


function Header(){
    const {user, setUser} = useAuth();
    function handleLogout(){
        setUser({
            isLoggedIn:false,
            info:null,
            token:null,
            refreshToken:null,
        })
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
    }    
    const headerStyle = {
        display: 'flex',
        width:"100%",
        height:"10vh",
        alignItems: 'center',
        border:"1px solid white",
        marginBottom:"10px",
        color:"white",
    };

    return (
        <header className="header" style={headerStyle}>
            <h1 style={{flex:"1", margin:"10px"}}>Kalam</h1>
            <h4 style={{margin:"10px"}}>Hello, {user.info?.username}</h4>
            <p onClick={handleLogout} style={{ 
                margin:"10px", 
                backgroundColor:"rgba(255, 255, 255, 0.2)", 
                borderRadius:"5px",
                cursor:"pointer",
                padding:"15px",
                transition:"0.3s"
            }}>Logout</p>
        </header>
    );
}

export default Header;