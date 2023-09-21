import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO, subDays } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Col, Form, ListGroup, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { AlertConfirm, Button, Gap, Input, Preloader, Modal } from '../../components'
import * as action from "../../redux/actions";
import { ALERT_CONFIRM } from '../../redux/type';

const Index = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [page, setPage] = useState(1),
    [limit, setLimit] = useState(10),
    [from, setFrom] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd')),
    [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd')),
    [typeProcurement, setTypeProcurement] = useState("all"),
    [listPage, setListPage] = useState([]),
    [idProcurement, setIdProcurement] = useState(""),
    [showModal, setShowModal] = useState(false),
    [showModalFilter, setShowModalFilter] = useState(false),
    [idJenisAsset, setIdJenisAsset] = useState(1);

    const { load_procurement, all_procurement } = useSelector((state) => state.procurement);
    const { open_confirm } = useSelector((state) => state.alert);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);
    const {load_auth, profile} = useSelector((state) => state.auth);
    const { load_term, all_term_detail } = useSelector((state) => state.term);

    const loadData = async () => {
        await dispatch(action.getProcurement(page, limit, from, to, typeProcurement));
        await dispatch(action.getTermDetail(3));
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadPagination = async(page) => {
        setPage(page);
        await dispatch(action.getProcurement(page, limit, from, to, typeProcurement));
    }

    const handleShowModal = () => {
        showModal ? setShowModal(false) : setShowModal(true);
    }

    const handleShowModalFilter = () => {
        showModalFilter ? setShowModalFilter(false) : setShowModalFilter(true);
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);

    const setAlert = async (id) => {
        setIdProcurement(id);
    
        await dispatch({
          type: ALERT_CONFIRM,
          payload: {
            open_confirm: true,
            type: "question",
            message: "Yakin ingin nenghapus data ini ?",
          },
        });
    };

    const removeData = async() => {
        let response = await dispatch(action.deleteProcurement(idProcurement));
        if(response.status == 'success'){
            loadData();
        }   
    }

    const handleSelect = async(select) => {
        setLimit(select);
        await dispatch(action.getProcurement(1, select, from, to, typeProcurement));
    }

    const handleFilter = async() => {
        await dispatch(action.getProcurement(1, limit, from, to, typeProcurement));
    }

    const exportPDF = async() => {
        await dispatch(action.exportProcurement());
    }

    return load_procurement && load_pagination ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <AlertConfirm 
                open={open_confirm} 
                type="question" 
                message="Yakin ingin nenghapus data ini ?" 
                onConfirm={removeData} 
            />
            <Gap width={0} height={10} className='hide_on_print' /> 
            <Row className='d-flex gap-2 justify-content-between hide_on_print'>
                <Col sm={12} md={3} lg={2} className='d-grid'>
                    <Button 
                        label="Tambah Pengadaan"
                        variant="success" 
                        size="md"
                        customClass='hide_on_print'
                        onClick={() => {
                            handleShowModal();
                        }} 
                    />
                    <Gap width={0} height={20} className='hide_on_print' />
                    <Form className='hide_on_print'>
                        <Form.Control
                            as="select"
                            size='sm'
                            value={limit}
                            onChange={e => {
                                handleSelect(e.target.value);
                            }}
                        >
                            <option value="10" className='text-center'>10</option>
                            <option value="25" className='text-center'>25</option>
                            <option value="50" className='text-center'>50</option>
                            <option value="100" className='text-center'>100</option>
                        </Form.Control>
                    </Form>
                </Col>
                <Col sm={12} md={4} lg={3} className="align-self-end">
                    <Gap width={0} height={20} className='hide_on_print' />
                    <div className='d-grid'>
                        <Button 
                            label="Filter"
                            size="md"
                            customClass='hide_on_print'
                            onClick={() => {
                                handleShowModalFilter();
                            }}
                        />
                    </div>
                    <Gap width={0} height={20} className='hide_on_print' />
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
            <Gap width={0} height={20} className='hide_on_print' /> 
            <Table striped bordered responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Penanggung Jawab</th>
                    <th>Jenis</th>
                    <th>Yang Menyetujui / Menolak</th>
                    <th>Status</th>
                    <th>Tanggal Pengajuan</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                    {all_procurement && all_procurement.length > 0 ? (
                        all_procurement.map((procurement, index) => {
                            return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{procurement.responsible.name}</td>
                                <td>{procurement.type_procurement.name}</td>
                                <td>{procurement.approval ? procurement.approval.name : "-"}</td>
                                <td>
                                    <span className={`p-2 rounded text-white fw-bold  ${procurement.id_status == 1 ? 'bg-warning' : procurement.id_status == 4 ? 'bg-danger' : "bg-success"}`}>
                                        {procurement.status_procurement.name}
                                    </span>
                                </td>
                                <td>{format(new Date(procurement.created_at), 'dd-MM-yyyy')}</td>
                                <td className="d-flex flex-row gap-2">
                                    <Button
                                        label="Detail"
                                        variant="dark"
                                        onClick={() => {
                                            history.push({
                                                pathname: '/asset/procurement/detail',
                                                state: {
                                                    id: procurement.id
                                                }
                                            });
                                        }}
                                    />
                                    {/* {procurement.id_status == 1 && profile.id_position == 1 ? (
                                        <Button
                                            label="Hapus"
                                            variant="danger"
                                            onClick={() => {
                                                setAlert(procurement.id);
                                            }}
                                        />
                                    ) : null } */}
                                </td>
                            </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center">Data tidak ditemukan</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Gap width={0} height={10} />
            <div className='hide_on_print'>
                {pagination && 
                <ListGroup className='d-flex flex-row flex-wrap justify-content-center'>
                    {all_procurement && all_procurement.length > 0 && listPage.map((list, index) => {
                        return (
                            <ListGroup.Item 
                                key={index}
                                onClick={() => loadPagination(list.page)}
                                className={`cursor-pointer ${list.active == true ? "active" : ""}`}
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
            </div>
            <Gap width={0} height={50} />
            <Modal
                show={showModalFilter}
                size="lg"
                title="Filter Pengadaan Barang"
                handleClose={handleShowModalFilter}
                body={
                    <div>
                        <Form>
                            <Form.Label>Jenis Asset</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue={typeProcurement}
                                onChange={(e) => {
                                    setTypeProcurement(e.target.value);
                                }}
                            >   
                                <option key='all' value='all' selected={typeProcurement == 'all' ? true : false}>Semua</option>
                                {all_term_detail.map((term_detail, index) => {
                                    return (
                                        <option key={index} value={term_detail.key} selected={typeProcurement == String(term_detail.key) ? true : false}>{term_detail.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        <Gap width={0} height={20} />
                        <Input
                            label="Dari"
                            type="date"
                            onChange={(e) => {
                                setFrom(e.target.value);
                            }}
                            value={from}
                        />
                        <Gap width={0} height={20} />
                        <Input
                            label="Sampai"
                            type="date"
                            onChange={(e) => {
                                setTo(e.target.value);
                            }}
                            value={to}
                        />
                        <Gap width={0} height={20} />

                        <div className='d-grid'>
                            <Button 
                                label="Filter"
                                variant="success" 
                                size="md"
                                onClick={() => {
                                    handleFilter();
                                    handleShowModalFilter();
                                }} 
                            />
                        </div>
                    </div>
                }
            />
            <Gap width={0} height={50} />
            <Modal
                show={showModal}
                size="lg"
                title="Pengadaan barang"
                handleClose={handleShowModal}
                body={
                    <div>
                        <Form>
                            <Form.Label>Jenis Asset</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue=""
                                onChange={(e) => {
                                    setIdJenisAsset(e.target.value);
                                }}
                            >
                                {all_term_detail.map((term_detail, index) => {
                                    return (
                                        <option key={index} value={term_detail.key}>{term_detail.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        <Gap width={0} height={20} />

                        <div className='d-grid'>
                            <Button 
                                label="Tambah"
                                variant="success" 
                                size="md"
                                onClick={() => {
                                    history.push({
                                        pathname: '/asset/procurement/create',
                                        state: {
                                            jenisAsset: idJenisAsset
                                        }
                                    });
                                }} 
                            />
                        </div>
                    </div>
                }
            />
        </div>
    )
}

export default Index