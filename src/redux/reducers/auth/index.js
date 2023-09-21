import { 
    LOGIN, 
    PROFILE,
} from "../../type";

const initialState = {
    load_auth: true,
    profile: [],
}

export const authReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN: 
            return {
                ...state,
                load_auth: false,
            }
        case PROFILE: 
            return {
                ...state,
                load_auth: false,
                profile: action.payload.data
            }
        default: 
            return state;
    }
}
