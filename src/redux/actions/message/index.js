import { UseGetAction, UsePostAction } from "../../../utils";

import { 
    COUNT_MESSAGE,
    GET_ALL_MESSAGE,
    READ_MESSAGE
} from "../../type";

export const allMessage = (page, limit, search) => 
    UseGetAction(
        "all-messages", 
        GET_ALL_MESSAGE, 
        {page: page, limit: limit, search: search},
        true
    );

export const readMessage = (id) => 
    UsePostAction(
        'message/read',
        READ_MESSAGE,
        {id: id},
        undefined,
        false
    );

export const countMessageUnRead = () => 
    UseGetAction(
        "count-messages-unread", 
        COUNT_MESSAGE, 
        undefined,
        false,
    );
