import React, { useEffect } from 'react'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { ALERT_APPROVE, ALERT_COMPLETED, ALERT_CONFIRM, ALERT_DECLINE, ALERT_PROCESS } from '../../../redux/type';

const Index = ({open, type, message, onConfirm, typeRedux}) => {
    const MySwal = withReactContent(Swal);
    const dispatch = useDispatch();

    useEffect(() => {
        open ? (
            MySwal.fire({
                title: message,
                icon: type,
                showCancelButton: true,
                confirmButtonText: 'Ya',
                cancelButtonText: 'Tidak',
            }).then((result) => {
                if(result.isConfirmed || result.isDenied || result.isDismissed){
                    if(result.isConfirmed){
                        onConfirm();
                    }

                    if(typeRedux == "process"){
                        dispatch({
                            type: ALERT_PROCESS,
                            payload: {
                                open_process: false
                            }
                        });
                    }else if(typeRedux == "approve"){
                        dispatch({
                            type: ALERT_APPROVE,
                            payload: {
                                open_approve: false
                            }
                        });
                    }else if(typeRedux == "decline"){
                        dispatch({
                            type: ALERT_DECLINE,
                            payload: {
                                open_decline: false
                            }
                        });
                    }else if(typeRedux == "completed"){
                        dispatch({
                            type: ALERT_COMPLETED,
                            payload: {
                                open_completed: false
                            }
                        });
                    }else{
                        dispatch({
                            type: ALERT_CONFIRM,
                            payload: {
                                open_confirm: false
                            }
                        });
                    }
                }
            })
        ) : <></>;
    }, [open]);

    return (
        <></>
    )
}

export default Index