import { 
    ALL_CONDITION_ASSET,
    DETAIL_ASSET,
    EXPORT_ASSET,
    IMPORT_ASSET,
    GET_ALL_ASSET,
    LIST_ASSET
} from "../../type/asset";

const initialState = {
    load_asset: false,
    all_asset: [],
    list_asset: [],
    detail_asset: [],
    all_condition_asset: [],
}

export const assetReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_ALL_ASSET:
            return {
                ...state,
                load_asset: false,
                all_asset: action.payload.data,
            }
        case LIST_ASSET:
            return {
                ...state,
                load_asset: false,
                list_asset: action.payload.data,
            }
        case DETAIL_ASSET:
            return {
                ...state,
                load_asset: false,
                detail_asset: action.payload.data,
            }
        case ALL_CONDITION_ASSET:
            return {
                ...state,
                load_asset: false,
                all_condition_asset: action.payload.data,
            }
        case EXPORT_ASSET:
            return {
                ...state,
                load_asset: false,
                export_asset: action.payload.data,
            }
        case IMPORT_ASSET:
            return {
                ...state,
                load_asset: false,
                all_asset: action.payload.data,
            }
        default:
            return state;
    }
}