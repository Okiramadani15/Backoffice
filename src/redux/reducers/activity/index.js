import { 
    DETAIL_ACTIVITY,
    GET_ACTIVITY
} from "../../type/activity";

const initialState = {
    load_activity: false,
    all_activity: [],
    detail_activity: [],
}

export const activityReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_ACTIVITY:
            return {
                ...state,
                load_activity: false,
                all_activity: action.payload.data,
            }
        case DETAIL_ACTIVITY:
            return {
                ...state,
                load_activity: false,
                detail_activity: action.payload.data,
            }
        default:
            return state;
    }
}