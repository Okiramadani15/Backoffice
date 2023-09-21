import { UseDeleteAction } from "../../../utils/useDeleteAction";
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";
import { UseUpdateAction } from "../../../utils/useUpdateAction";

import { 
    CHANGE_STATUS_LOAN,
  CREATE_LOAN, 
  DECLINE_LOAN, 
  DELETE_LOAN, 
  DETAIL_LOAN, 
  GET_LOAN,
  UPDATE_DETAIL_LOAN,
  UPDATE_LOAN,
} from "../../type/loan";

export const createLoan = (data) => 
    UsePostAction(
        "create-loan", 
        CREATE_LOAN, 
        data,
        undefined,
        false
    );

export const getLoan = (page, limit, from, now, type) =>
    UseGetAction(
        'all-loan',
        GET_LOAN,
        {page: page, limit: limit, from: from, now: now, type: type},
        true,
    );

export const deleteLoan = (id) =>
    UseDeleteAction(
        'delete-loan',
        DELETE_LOAN,
        {id: id}
    );

export const detailLoan = (id) =>
    UseGetAction(
        'detail-loan',
        DETAIL_LOAN,
        {id: id},
        false,
    );

export const changeStatusLoan = (data) => 
    UsePostAction(
        "change-status-loan", 
        CHANGE_STATUS_LOAN, 
        data,
        undefined,
        true
    );

export const updateLoan = (data) => 
    UsePostAction(
        "update-loan", 
        UPDATE_LOAN, 
        data,
        undefined,
        false
    );

export const updateDetailLoan = (data) => 
    UsePostAction(
        "update-detail-loan", 
        UPDATE_DETAIL_LOAN, 
        data,
        undefined,
        false
    );

export const loanDecline = (data) => 
    UsePostAction(
        "loan/on-decline", 
        DECLINE_LOAN, 
        data,
        undefined,
        true
    );