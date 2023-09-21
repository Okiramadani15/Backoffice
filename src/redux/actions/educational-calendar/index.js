import { UseDeleteAction, UseGetAction, UsePostAction, UseUpdateAction } from "../../../utils";
import { 
    CREATE_EDUCATIONAL_CALENDAR, 
    DELETE_EDUCATIONAL_CALENDAR, 
    GET_EDUCATIONAL_CALENDAR, 
    UPDATE_EDUCATIONAL_CALENDAR
} from "../../type";


export const getAllCalendar = (page, limit, search) => 
    UseGetAction(
        'educational-calendar',
        GET_EDUCATIONAL_CALENDAR,
        {page: page, limit: limit, search: search},
        true
    )

export const deleteCalendar = (id) => 
    UseDeleteAction(
        'educational-calendar/delete',
        DELETE_EDUCATIONAL_CALENDAR,
        {id: id},
    )

export const createCalendar = (data) => 
    UsePostAction(
        'educational-calendar/create',
        CREATE_EDUCATIONAL_CALENDAR,
        data,
        undefined,
        false,
    );

export const updateCalendar = (data) => 
    UseUpdateAction(
        'educational-calendar/update',
        UPDATE_EDUCATIONAL_CALENDAR,
        data,
        undefined,
    );