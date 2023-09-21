import { UseGetAction } from "../../../utils";
import { GET_TERM_DETAIL } from "../../type/term";


export const getTermDetail = (id_term) => 
    UseGetAction(
        'term-detail',
        GET_TERM_DETAIL,
        {id_term: id_term},
        false,
    );