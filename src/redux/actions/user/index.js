import { UseDeleteAction } from "../../../utils/useDeleteAction";
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";

import {
    CREATE_USER,
    DELETE_USER,
    GET_ALL_USER,
    DETAIL_USER,
    UPDATE_USER,
} from "../../type/user";

export const getAllUser = (page, limit, search) => 
    UseGetAction(
        'all-user',
        GET_ALL_USER,
        {page: page, limit: limit, search: search},
        true,
    );

export const deleteUser = (id) =>
    UseDeleteAction(
        'delete-user',
        DELETE_USER,
        {id: id}
    );

export const createUser = (data) =>
    UsePostAction(
        'register',
        CREATE_USER,
        data,
        undefined,
        true,
    );

export const detailUser = (id) => UseGetAction("detail-user", DETAIL_USER, { id: id }, false);

export const updateUser = (data) =>
  UsePostAction(
    "update-user",
    UPDATE_USER,
    data,
    undefined,
    true,
  );
