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
    [listPage, setListPage] = useState([]),
    [idRepair, setIdRepair] = useState(""),
    [typeRepair, setTypeRepair] = useState("all"),
    [typeRepairAsset, setTypeRepairAsset] = useState(1),
    [showModalFilter, setShowModalFilter] = useState(false),
    [showModalRepair, setShowModalRepair] = useState(false);

    const { load_repair, all_repair } = useSelector((state) => state.repair);
    const { open_confirm } = useSelector((state) => state.alert);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);
    const {load_auth, profile} = useSelector((state) => state.auth);
    const { load_term, all_term_detail } = useSelector((state) => state.term);

    const loadData = async () => {
        await dispatch(action.allRepair(page, limit, from, to, typeRepair));
        await dispatch(action.getTermDetail(3));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleShowModalFilter = () => {
        showModalFilter ? setShowModalFilter(false) : setShowModalFilter(true);
    }

    const handleShowModalRepair = () => {
        showModalRepair ? setShowModalRepair(false) : setShowModalRepair(true);
    }

    const loadPagination = async(page) => {
        setPage(page);
        await dispatch(action.allRepair(page, limit, from, to, typeRepair));
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);

    const setAlert = async (id) => {
        setIdRepair(id);
    
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
        let response = await dispatch(action.deleteRepair(idRepair));
        if(response.status == 'success'){
            loadData();
        }   
    }

    const handleSelect = async(select) => {
        setLimit(select);
        await dispatch(action.allRepair(1, select, from, to, typeRepair));
    }

    const handleFilter = async() => {
        handleShowModalFilter();
        await dispatch(action.allRepair(1, limit, from, to, typeRepair));
    }

    return load_repair && load_pagination ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <AlertConfirm 
                open={open_confirm} 
                type="question" 
                message="Yakin ingin nenghapus data ini ?" 
                onConfirm={removeData} 
            />
            <Gap width={0} height={10} /> 
            <Row className='d-flex gap-2 justify-content-between hide_on_print'>
                <Col sm={12} md={3} lg={2}>
                    <Button 
                        label="Tambah Perbaikan"
                        variant="success" 
                        size="md"
                        customClass='hide_on_print'
                        onClick={() => {
                            handleShowModalRepair();
                        }} 
                    />
                    <Gap width={0} height={20} />
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
                <Col sm={12} md={8} lg={9} className="align-self-end">
                    <Row className='d-flex gap-3 flex-row justify-content-end'>
                        <Col sm={12} md={12} lg={3} className='align-self-end h-100'>
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
                            <Gap width={0} height={20} /> 
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
                </Col>
            </Row>
            <Gap width={0} height={20} /> 
            <Table striped bordered responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Penanggung Jawab</th>
                    <th>Jenis</th>
                    <th>Menyetujui / Menolak</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th className='hide_on_print'>Aksi</th>
                </tr>
                </thead>
                <tbody>
                    {all_repair && all_repair.length > 0 ? (
                        all_repair.map((repair, index) => {
                            return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{repair.responsible.name}</td>
                                <td>{repair.type == 1 ? 'Sarana' : 'Prasarana'}</td>
                                <td>{repair.approval ? repair.approval.name : "-"}</td>
                                <td>
                                    <span className={`p-2 rounded text-white fw-bold  ${repair.id_status == 1 ? 'bg-warning' : repair.id_status == 4 ? 'bg-danger' : "bg-success"}`}>
                                        {repair.status_repair.name}
                                    </span>
                                </td>
                                <td>{format(new Date(repair.created_at), 'dd-MM-yyyy')}</td>
                                <td className="d-flex flex-row gap-2 hide_on_print">
                                    <Button
                                        label="Detail"
                                        variant="dark"
                                        customClass='hide_on_print'
                                        onClick={() => {
                                            history.push({
                                                pathname: '/asset/repair/detail',
                                                state: {
                                                    id: repair.id
                                                }
                                            });
                                        }}
                                    />
                                    {/* {repair.id_status == 1 && profile.id_position == 1 ? (
                                        <Button
                                            label="Hapus"
                                            variant="danger"
                                            customClass='hide_on_print'
                                            onClick={() => {
                                                setAlert(repair.id);
                                            }}
                                        />
                                    ) : null } */}
                                </td>
                            </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center">Data tidak ditemukan</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Gap width={0} height={10} />
            <div className='hide_on_print'>
                {pagination && 
                <ListGroup className='d-flex flex-row flex-wrap justify-content-center'>
                    {all_repair && all_repair.length > 0 && listPage.map((list, index) => {
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
                title="Filter Perbaikan Barang"
                handleClose={handleShowModalFilter}
                body={
                    <div>
                        <Row className='d-flex gap-3 flex-row align-self-end'>
                            <Col sm={12} md={12} lg={12}>
                                <Form>
                                    <Form.Label>Jenis Asset</Form.Label>
                                    <Form.Select
                                        aria-label="Default select example"
                                        defaultValue={typeRepair}
                                        onChange={(e) => {
                                            setTypeRepair(e.target.value);
                                        }}
                                    >   
                                        <option key='all' value='all' selected={typeRepair == 'all' ? true : false}>Semua</option>
                                        {all_term_detail.map((term_detail, index) => {
                                            return (
                                                <option key={index} value={term_detail.key} selected={typeRepair == String(term_detail.key) ? true : false}>{term_detail.name}</option>
                                            );
                                        })}
                                    </Form.Select>
                                </Form>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <Input
                                    label="Dari"
                                    type="date"
                                    onChange={(e) => {
                                        setFrom(e.target.value);
                                    }}
                                    value={from}
                                />
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <Input
                                    label="Sampai"
                                    type="date"
                                    onChange={(e) => {
                                        setTo(e.target.value);
                                    }}
                                    value={to}
                                />
                            </Col>
                            <Col sm={12} md={12} lg={12} className='align-self-end h-100'>
                                <div className='d-grid'>
                                    <Button 
                                        label="Filter"
                                        size="md"
                                        onClick={() => {
                                            handleFilter();
                                        }}
                                    />
                                </div>
                                <Gap width={0} height={20} className='hide_on_print' />
                            </Col>
                        </Row>
                    </div>
                }
            />
            <Modal
                show={showModalRepair}
                size="lg"
                title="Filter Perbaikan Barang"
                handleClose={handleShowModalRepair}
                body={
                    <div>
                        <Row className='d-flex gap-3 flex-row align-self-end'>
                            <Col sm={12} md={12} lg={12}>
                                <Form>
                                    <Form.Label>Jenis Asset</Form.Label>
                                    <Form.Select
                                        aria-label="Default select example"
                                        defaultValue={typeRepair}
                                        onChange={(e) => {
                                            setTypeRepairAsset(e.target.value);
                                        }}
                                    >   
                                        {all_term_detail.map((term_detail, index) => {
                                            return (
                                                <option key={index} value={term_detail.key} selected={typeRepair == String(term_detail.key) ? true : false}>{term_detail.name}</option>
                                            );
                                        })}
                                    </Form.Select>
                                </Form>
                            </Col>
                            <Col sm={12} md={12} lg={12} className='align-self-end h-100'>
                                <div className='d-grid'>
                                    <Button 
                                        label="Filter"
                                        size="md"
                                        onClick={() => {
                                            history.push({
                                                pathname: '/asset/repair/create',
                                                state: {
                                                    typeRepair: typeRepairAsset
                                                }
                                            });
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
            />
        </div>
    )
}

export default Index