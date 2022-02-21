import axios from "axios";
import {API_URL} from "../url";

const instance = axios.create({
    baseURL: API_URL+"api/",
    headers: {
      "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
      const token = JSON.parse(localStorage.getItem('token'));
      if (token) {
        config.headers["x-access-token"] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
  
      if (originalConfig.url !== "/auth/login" && err.response) {
        console.log(err.config);
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
  
          try {
            const rs = await instance.post("/auth/refresh_token", {
              requestToken: JSON.parse(localStorage.getItem("refreshToken")),
            });
  
            const { accessToken } = rs.data;
            console.log(rs.data.accessToken);
            localStorage.setItem("token", JSON.stringify(accessToken));
            originalConfig.headers["x-access-token"] = accessToken;
            return instance(originalConfig);
          } catch (_error) {
            //console.log(_error.response.data.message);
            return Promise.reject(_error);
          }
        }
      }
  
      return Promise.reject(err);
    }
  );
  
export default instance;