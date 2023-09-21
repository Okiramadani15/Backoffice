import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";


import { 
    LOGIN, 
    LOGOUT, 
    PROFILE,
} from "../../type";

export const signIn = (data) => 
    UsePostAction(
        'login',
        LOGIN,
        data,
        undefined,
        false,
    );

export const getProfile = () =>
    UseGetAction(
        'profile',
        PROFILE,
        undefined,
    );

export const logout = (data) => 
    UsePostAction(
        'logout',
        LOGOUT,
        data,
        undefined,
        false,
    );

