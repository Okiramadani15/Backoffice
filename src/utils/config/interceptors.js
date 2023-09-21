import { API } from "./api";

export const Interceptors = () => {
    API.interceptors.request.use(
        (config) => {
            
            const token = localStorage.getItem('token');
            if (token) {
                localStorage.setItem('token', token);
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            
            return config;
        },
        (err) => {
            Promise.reject(err)
        }
    );
      
    // response Interceptors
    API.interceptors.response.use(
        (res) => {
            return res;
        },
        (err) => {
            const originalConfig = err.config;
            if (originalConfig.url !== "login" && err.response) {
                if(err.response.status == 401 && !originalConfig._retry){
                    originalConfig._retry = true;
                    localStorage.removeItem('token');
                    return API(originalConfig);
                }
            }
            return Promise.reject(err);
        }
    );
}