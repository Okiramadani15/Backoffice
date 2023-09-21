

import { UseDeleteAction, UseGetAction, UsePostAction } from '../../../utils';
import {
    ALL_REPAIR, CHANGE_STATUS_REPAIR, CREATE_REPAIR, DELETE_REPAIR, DETAIL_REPAIR, UPDATE_REPAIR
} from '../../type/repair';

export const allRepair = (page, limit, from, now, type) => 
    UseGetAction(
        'all-repair',
        ALL_REPAIR,
        {page: page, limit: limit, from: from, now: now, type: type},
        true,
    );

export const createRepair = (data) =>
    UsePostAction(
        'create-repair',
        CREATE_REPAIR,
        data,
        undefined,
        true,
    );

export const detailRepair = (id) =>
    UseGetAction(
        'repair/detail',
        DETAIL_REPAIR,
        {id: id},
        false,
    );

export const updateRepair = (data) =>
    UsePostAction(
        'repair/update',
        UPDATE_REPAIR,
        data,
        undefined,
        true,
    );

export const changeStatusRepair = (data) =>
    UsePostAction(
        'repair/change-status',
        CHANGE_STATUS_REPAIR,
        data,
        undefined,
        true
    );

export const deleteRepair = (id) =>
    UseDeleteAction(
        'repair/delete',
        DELETE_REPAIR,
        {id: id},
    );