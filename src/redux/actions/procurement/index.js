import { UseDeleteAction, UseGetAction, UsePostAction, UseUpdateAction } from "../../../utils";
import { 
    APPROVE_PROCUREMENT, 
    CHANGE_STATUS_PROCUREMENT, 
    CREATE_PROCUREMENT, 
    DECLINE_PROCUREMENT, 
    DELETE_PROCUREMENT, 
    DETAIL_PROCUREMENT, 
    GET_PROCUREMENT, 
    PROCESS_PROCUREMENT, 
    UPDATE_DETAIL_PROCUREMENT, 
    UPDATE_PROCUREMENT ,
    FINISH_DETAIL_PROCUREMENT,
    COMPLETE_PROCUREMENT,
    EXPORT_PROCUREMENT,
    DOCUMENT_PROCUREMENT
} from "../../type/procurement";


export const getProcurement = (page, limit, from, now, typeProcurement) => 
    UseGetAction(
        'all-procurement',
        GET_PROCUREMENT,
        {page: page, limit: limit, from: from, now: now, type: typeProcurement},
        true,
    );

export const deleteProcurement = (id) =>
    UseDeleteAction(
        'delete-procurement',
        DELETE_PROCUREMENT,
        {id: id},
    );

export const detailProcurement = (id) =>
    UseGetAction(
        'detail-procurement',
        DETAIL_PROCUREMENT,
        {id: id},
        false,
    );

export const createProcurement = (data) =>
    UsePostAction(
        'create-procurement',
        CREATE_PROCUREMENT,
        data,
        undefined,
        true,
    );

export const updateProcurement = (data) =>
    UsePostAction(
        'update-procurement',
        UPDATE_PROCUREMENT,
        data,
        undefined,
        true,
    );

export const updateDetailProcurement = (data) =>
    UsePostAction(
        'update-detail-procurement',
        UPDATE_DETAIL_PROCUREMENT,
        data,
        undefined,
        false
    );

export const processProcurement = (data) =>
    UsePostAction(
        'procurement/on-process',
        PROCESS_PROCUREMENT,
        data,
        undefined,
        false
    );

export const approveProcurement = (data) =>
    UsePostAction(
        'procurement/on-approve',
        APPROVE_PROCUREMENT,
        data,
        undefined,
        false
    );

export const declineProcurement = (data) =>
    UsePostAction(
        'procurement/on-decline',
        DECLINE_PROCUREMENT,
        data,
        undefined,
        false
    );

export const procurementCompleted = (data) =>
    UsePostAction(
        'procurement/on-completed',
        COMPLETE_PROCUREMENT,
        data,
        undefined,
        false
    );

export const changeStatusProcurement = (data) =>
    UsePostAction(
        'procurement/change-status',
        CHANGE_STATUS_PROCUREMENT,
        data,
        undefined,
        false
    );

export const finishDetailProcurement = (data) =>
    UsePostAction(
        'procurement/finish-detail-procurement',
        FINISH_DETAIL_PROCUREMENT,
        data,
        undefined,
        true
    );


export const exportProcurement = () =>
    UsePostAction(
        'procurement/export',
        EXPORT_PROCUREMENT,
        undefined,
        undefined,
        true
    );

export const documentProcurement = (id) =>
    UseGetAction(
        'procurement/document',
        DOCUMENT_PROCUREMENT,
        {id: id},
        false,
    );