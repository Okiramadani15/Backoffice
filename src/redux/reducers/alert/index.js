import { 
    ALERT_APPROVE,
    ALERT_COMPLETED,
    ALERT_CONFIRM, 
    ALERT_DECLINE, 
    ALERT_PROCESS, 
    SHOW_ALERT,
} from "../../type/alert";

const initialState = {
    open: false,
    open_confirm: false,
    open_process: false,
    open_approve: false,
    open_decline: false,
    open_completed: false,
    type: '',
    message: '',
}

export const alertReducer = (state = initialState, action) => {
    switch(action.type){
        case SHOW_ALERT:
            return {
                ...state,
                open: action.payload.open,
                type: action.payload.type,
                message: action.payload.message,
            }
        case ALERT_CONFIRM:
            return {
                ...state,
                open_confirm: action.payload.open_confirm,
                type: action.payload.type,
                message: action.payload.message,
            }
        case ALERT_PROCESS:
            return {
                ...state,
                open_process: action.payload.open_process,
                type: action.payload.type,
                message: action.payload.message,
            }
        case ALERT_APPROVE:
            return {
                ...state,
                open_approve: action.payload.open_approve,
                type: action.payload.type,
                message: action.payload.message,
            }
        case ALERT_DECLINE:
            return {
                ...state,
                open_decline: action.payload.open_decline,
                type: action.payload.type,
                message: action.payload.message,
            }
        case ALERT_COMPLETED:
            return {
                ...state,
                open_completed: action.payload.open_completed,
                type: action.payload.type,
                message: action.payload.message,
            }
        default:
            return state;
    }
}