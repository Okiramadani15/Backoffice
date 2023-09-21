import { SET_PAGINATION } from "../../redux/type";
import { API } from "../config/api";

export const UseGetAction = (url, type, queries, isPagination) => async(dispatch) => {
    try{
        let qr = '?';
        if(queries != undefined){
            for(let query in queries){
                qr += `${query}=${queries[query]}&`
            }
            url += qr;
        }

        const response = await API.get(url);
        
        if(response.data.status == 'success'){
            await dispatch({
                type: type,
                payload: {
                    loading: false,
                    data: response.data.data
                }
            });

            if(isPagination){
                await dispatch({
                    type: SET_PAGINATION,
                    payload: {
                        loading: false,
                        data: response.data.pagination
                    }
                });
            }
        }

        return response.data;


    }catch(error){
        console.log("error get actions : ", error);
    }
}