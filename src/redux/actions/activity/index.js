import { UseDeleteAction, UseGetAction, UsePostAction } from "../../../utils";
import { CREATE_ACTIVITY, DELETE_ACTIVITY, DETAIL_ACTIVITY, GET_ACTIVITY, UPDATE_ACTIVITY } from "../../type";



export const getActivity = (page, limit, search) => 
    UseGetAction(
        'all-activity',
        GET_ACTIVITY,
        {page: page, limit: limit, search: search},
        true,
    );

export const deleteActivity = (id) => 
    UseDeleteAction(
        'activity/delete',
        DELETE_ACTIVITY,
        {id: id}
    );

export const createActivity = (data) =>
    UsePostAction(
        'activity/create',
        CREATE_ACTIVITY,
        data,
        undefined,
        true,
    );

export const detailActivity = (id) => 
    UseGetAction(
        'activity/detail',
        DETAIL_ACTIVITY,
        {id: id},
        false,
    );

export const updateActivity = (data) =>
    UsePostAction(
        'activity/update',
        UPDATE_ACTIVITY,
        data,
        undefined,
        true,
    );