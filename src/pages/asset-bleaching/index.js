import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@themesberg/react-bootstrap';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Col, ListGroup, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { AlertConfirm, AlertConfirm as AlertOnApprove, Button, Gap, Preloader } from '../../components';

import * as action from "../../redux/actions";
import { ALERT_APPROVE, ALERT_CONFIRM } from '../../redux/type';

const Index = () => {
    const dispatch = useDispatch();

    const limit = 15;
    const [page, setPage] = useState(1),
    [listPage, setListPage] = useState([]),
    [idBleaching, setIdBleaching] = useState(0),
    [status, setStatus] = useState(1);

    const { load_bleaching, get_bleaching } = useSelector((state) => state.bleaching);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);
    const { open_confirm, open_approve } = useSelector((state) => state.alert);
    const {load_auth, profile} = useSelector((state) => state.auth);

    const loadData = async() => {
        await dispatch(action.getAllAssetBleaching(page, limit));
    }

    useEffect(() => {
        loadData();
    }, []);

    const loadPagination = async(page) => {
        setPage(page);
        await dispatch(action.getAllAssetBleaching(page, limit));
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);

    const updateStatus = async () => {
        let data = {
            id: idBleaching,
            status: status
        }

        await dispatch(action.changeStatus(data));
        loadData();
    };

    const bleachingOnDecline = async() => {
        let data = {
            id: idBleaching,
            status: status
        }
        
        let response = await dispatch(action.changeStatus(data));

        if(response.status == "success"){
            loadData();
        }
    }

    const setAlert = async (id, status, type) => {
        setIdBleaching(id);
        setStatus(status);

        if(type == 'approve'){
            await dispatch({
              type: ALERT_CONFIRM,
              payload: {
                    open_confirm: true,
                    type: "question",
                    message: '',
              },
            });
        }else{
            await dispatch({
                type: ALERT_APPROVE,
                payload: {
                    open_approve: true,
                    type: "question",
                    message: '',
                },
            });
        }
    
    };

    // const setAlertDecline = async (id, status) => {
    //     setIdBleaching(id);
    //     setStatus(status);
    
    //     await dispatch({
    //       type: ALERT_APPROVE,
    //       payload: {
    //         open_approve: true,
    //         type: "question",
    //         message: '',
    //       },
    //     });
    // };

    return load_bleaching  && load_pagination? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <AlertConfirm 
                open={open_confirm} 
                type="question" 
                message="Pemutihan Asset Disetujui, Yakin ?" 
                onConfirm={updateStatus} 
            />

            <AlertOnApprove 
                open={open_approve} 
                type="question" 
                message={"Pemutihan Asset Ditolak, Yakin ?"}
                onConfirm={bleachingOnDecline} 
                typeRedux="approve"
            />
            <Row className='mb-4'>
                <Col sm={12} md={3}>
                    <div className='d-grid'>
                        <Button 
                            label="Cetak Laporan"
                            size="md"
                            onClick={() => {
                                window.print();
                            }}
                            customClass='hide_on_print'
                        />
                    </div>
                </Col>
            </Row>
            <Table striped bordered responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Penanggung Jawab</th>
                    <th>Asset</th>
                    <th>Jenis</th>
                    <th>Disetujui</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                    {get_bleaching.map((bleaching, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{bleaching.responsible.name}</td>
                                <td>{bleaching.asset.name}</td>
                                <td>{bleaching.asset.type_asset.name}</td>
                                <td>{bleaching.approve ? bleaching.approve.name : "-"}</td>
                                <td>{format(bleaching.created_at * 1000, 'dd/MM/yyyy')}</td>
                                <td>
                                    <span className={` p-2
                                        ${bleaching.status == 1 ? 'bg-warning' : bleaching.status == 2 ? 'bg-danger text-white' : 'bg-success text-white' }`}
                                    >
                                        {bleaching.status == 1 ? 'Pending' : bleaching.status == 2 ? 'Ditolak' : 'Disetujui' }
                                    </span>
                                </td>
                                <td>
                                    {bleaching.status == 1 && profile.id_position == 1 &&
                                        <div className='d-flex gap-2'>
                                            <Button 
                                                label="Disetujui" 
                                                variant="success" 
                                                size="sm"
                                                onClick={() => {
                                                    setAlert(bleaching.id, 3, 'approve');
                                                }} 
                                            />
                                            <Button 
                                                label="Ditolak" 
                                                variant="danger" 
                                                size="sm"
                                                onClick={() => {
                                                    setAlert(bleaching.id, 2, 'decline');
                                                }} 
                                            />
                                        </div>
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Gap width={0} height={10} />
            {pagination && 
            <ListGroup className='d-flex flex-row flex-wrap justify-content-center hide_on_print'>
                {get_bleaching.length > 0 && listPage.map((list, index) => {
                    return (
                        <ListGroup.Item 
                            key={index}
                            onClick={() => loadPagination(list.page)}
                            className={`cursor-pointer hide_on_print ${list.active == true ? "active" : ""}`}
                            disabled={list.page == "" ? true : false}
                        >
                            {index == 0 ? (
                                <FontAwesomeIcon icon={faChevronLeft} />
                            ) : index == listPage.length - 1 ? (
                                <FontAwesomeIcon icon={faChevronRight} />
                            ) : (
                                list.label
                            )}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>}
            <Gap width={0} height={30} />
        </div>
    )
}

export default Index