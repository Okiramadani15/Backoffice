import { UseDeleteAction } from "../../../utils/useDeleteAction";
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";
import { UseUpdateAction } from "../../../utils/useUpdateAction";

import { CHANGE_STATUS_BLEACHING, CREATE_BLEACHING, GET_BLEACHING } from "../../type/bleaching";

export const getAllAssetBleaching = (page, limit) =>
    UseGetAction(
        "bleaching", 
        GET_BLEACHING, 
        {page: page, limit: limit},
        true
    );

export const createBleaching = (data) => 
    UsePostAction(
        "bleaching/create", 
        CREATE_BLEACHING, 
        data, 
        undefined, 
        false
    );

export const changeStatus = (data) => 
    UsePostAction(
        "bleaching/change-status", 
        CHANGE_STATUS_BLEACHING, 
        data, 
        undefined, 
        false
    );
