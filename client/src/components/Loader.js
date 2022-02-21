
const Loader = () => {
    const loaderContainer = {
        width:"100vw",
        height:"100vh",
        backgroundColor:"white",
        display:"grid",
        placeItems:"center",
        maxWidth:"100%"
    }
    const loader = {
        width:"10vmax",
        height:"10vmax",
        borderBottom:"5px solid rgba(0, 0, 0, 0.719)",
        borderRadius:"50%",
        animation:"loadingRotate 800ms linear infinite"
    };
    return (
      <div style={loaderContainer} className="loading">
        <div style={loader}></div>
      </div>
    );
  };
  
  export default Loader;