import { SHOW_ALERT } from '../../redux/type';
import { API } from '../config/api';

export const UsePostAction = (url, type, data, queries, isFile) => async(dispatch) => {
    try{
        let qr = '?';
        if(queries != undefined){
            for(let query in queries){
                qr += `${query}=${queries[query]}&`
            }
            url += qr;
        }
        
        let config = {};

        config = {
            headers: {
                'Content-Type': isFile ? 'multipart/form-data' : 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        }
        
        const response = await API.post(url, data, config);
        
        if(response.data.status == 'success'){
            if(url == 'login'){
                localStorage.setItem('token', response.data.token);
            }else if(url == 'logout'){
                localStorage.removeItem("token");
                window.location.reload();
            }else{
                if(response.data.status == "success" && url != 'message/read'){
                    await dispatch({
                        type: SHOW_ALERT,
                        payload: {
                            open: true,
                            type: 'success',
                            message: response.data.message
                        }
                    });
                }else if(response.data.status == "fail"){
                    await dispatch({
                        type: SHOW_ALERT,
                        payload: {
                            open: true,
                            type: 'error',
                            message: response.data.message
                        }
                    });
                }
            }
        }else{
            await dispatch({
                type: SHOW_ALERT,
                payload: {
                    open: true,
                    type: 'error',
                    message: response.data.message
                }
            });
        }

        return response.data;
    } catch (err) {
        if(url != 'message/read'){
            await dispatch({
                type: SHOW_ALERT,
                payload: {
                    open: true,
                    type: 'error',
                    message: err.response.data.message
                }
            });
        }
    }
}