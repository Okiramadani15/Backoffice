import { SHOW_ALERT } from "../../redux/type";
import { API } from "../config/api";

export const UseDeleteAction = (url, type, queries) => async(dispatch) => {
    try {
        let qr = '?';
        if(queries != undefined){
            for(let query in queries){
                qr += `${query}=${queries[query]}&`
            }
            url += qr;
        }

        const response = await API.delete(url);
        
        if(response.data.status == "success"){
            await dispatch({
                type: SHOW_ALERT,
                payload: {
                    open: true,
                    type: 'success',
                    message: response.data.message
                }
            });
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
    }catch(err){
        await dispatch({
            type: SHOW_ALERT,
            payload: {
                open: true,
                type: 'error',
                message: err.message
            }
        });
    }
}