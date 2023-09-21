import { UseDeleteAction, UseGetAction, UsePostAction } from "../../../utils";

import { 
    ALL_CONDITION_ASSET,
    CREATE_ASSET,
    DELETE_ASSET,
    DETAIL_ASSET,
    EXPORT_ASSET,
    IMPORT_ASSET,
    GET_ALL_ASSET,
    LIST_ASSET,
    UPDATE_ASSET,
} from "../../type";


export const getAllAsset = (page, limit, search, type, location, work_unit) =>
    UseGetAction(
        "all-assets", 
        GET_ALL_ASSET, 
        {page: page, limit: limit, search: search, type: type, location: location, work_unit: work_unit},
        true
    );

export const listAsset = (type, id_location) =>
    UseGetAction(
        "list-assets", 
        LIST_ASSET, 
        {type: type, id_location: id_location},
        false,
    );

export const createAsset = (data) => 
    UsePostAction(
        'create-asset',
        CREATE_ASSET,
        data,
        undefined,
        true
    );

export const detailAsset = (id) => 
    UseGetAction(
        'detail-asset',
        DETAIL_ASSET,
        {id: id},
        false,
    );

export const updateAsset = (data) => 
    UsePostAction(
        'update-asset',
        UPDATE_ASSET,
        data,
        undefined,
        true
    );

export const deleteAsset = (id) => 
    UseDeleteAction(
        'delete-asset',
        DELETE_ASSET,
        {id: id},
    );

export const getAllConditionAsset = () => 
    UseGetAction(
        'condition-asset',
        ALL_CONDITION_ASSET,
        undefined,
        false,
    );

export const exportAsset = (search, type, location, work_unit) =>
    UseGetAction(
        "export-assets", 
        EXPORT_ASSET, 
        {search: search, type: type, location: location, work_unit: work_unit},
        true
    );

export const importAsset = (data) => 
    UsePostAction(
        'import-assets',
        IMPORT_ASSET,
        data,
        undefined,
        true
    );