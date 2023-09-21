import React, { useEffect } from 'react'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { SHOW_ALERT } from '../../../redux/type';
import { useDispatch } from 'react-redux';

const Index = ({open, type, message}) => {
    const MySwal = withReactContent(Swal);
    const dispatch = useDispatch();
    
    useEffect(() => {
        open ? (
            MySwal.fire({
                position: 'top-center',
                icon: type == "success" ? 'success' : "error",
                title: message,
                showConfirmButton: false,
            }).then((result) => {
                if(result.isConfirmed || result.isDenied || result.isDismissed){
                    dispatch({
                        type: SHOW_ALERT,
                        payload: {
                            open: false
                        }
                    });
                }
            })
        ) : <></>;
    }, [open]);
    
    return (
        <></>
    )
}

export default Index