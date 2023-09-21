import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, subDays } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Col, Form, ListGroup, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { AlertConfirm, Button, Gap, Input, Preloader, Modal } from '../../components';
import * as action from "../../redux/actions";
import { ALERT_CONFIRM } from '../../redux/type';

const Index = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1),
    [limit, setLimit] = useState(10),
    [listPage, setListPage] = useState([]),
    [idLoan, setIdLoan] = useState(""),
    [from, setFrom] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd')),
    [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd')),
    [showModalFilter, setShowModalFilter] = useState(false),
    [showModaChooselLoan, setShowModalChooseLoan] = useState(false),
    [typeLoan, setTypeLoan] = useState('all'),
    [typeLoanAsset, setTypeLoanAsset] = useState(1);

    const { load_loan, all_loan } = useSelector((state) => state.loan);
    const { open_confirm } = useSelector((state) => state.alert);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);
    const {load_auth, profile} = useSelector((state) => state.auth);
    const { load_term, all_term_detail } = useSelector((state) => state.term);

    const loadData = async () => {
        await dispatch(action.getLoan(page, limit, from, to, typeLoan));
        await dispatch(action.getTermDetail(3));
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadPagination = async(page) => {
        setPage(page);
        await dispatch(action.getLoan(page, limit, from, to, typeLoan));
    }

    const handleModalFilter = () => {
        showModalFilter ? setShowModalFilter(false) : setShowModalFilter(true);
    }

    const handleModalChooseLoan = () => {
        showModaChooselLoan ? setShowModalChooseLoan(false) : setShowModalChooseLoan(true);
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);

    const setAlert = async (id) => {
        setIdLoan(id);
    
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
        let response = await dispatch(action.deleteLoan(idLoan));
        if(response.status == 'success'){
            loadData();
        }   
    }

    const handleSelect = async(select) => {
        setLimit(select);
        await dispatch(action.getLoan(page, limit, from, to, typeLoan));
    }

    const handleFilter = async() => {
        await dispatch(action.getLoan(page, limit, from, to, typeLoan));
        handleModalFilter();
    }

    return load_loan && load_pagination ? (
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
            <Row className='d-flex justify-content-between'>
                <Col sm={12} md={3} lg={2}>
                    <Button 
                        label="Tambah Peminjaman"
                        variant="success" 
                        size="md"
                        customClass='hide_on_print'
                        onClick={() => {
                            handleModalChooseLoan();
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
                                        handleModalFilter();
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
                </Col>
            </Row>
            <Gap width={0} height={20} /> 
            <Table striped bordered responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Penanggung Jawab</th>
                    <th>Jenis</th>
                    <th>Yang Menyetujui / Menolak</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Alasan Peminjaman</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                    {all_loan.length > 0 ? (
                        all_loan.map((loan, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{loan.responsible.name}</td>
                                    <td>{loan.type == 1 ? 'Sarana' : 'Prasarana'}</td>
                                    <td>{loan && loan.approval ? loan.approval.name : "-"}</td>
                                    <td>{format(new Date(loan.created_at), 'dd-MM-yyyy')}</td>
                                    <td>
                                        <span className={`text-white p-2 rounded fw-bold ${
                                            loan.id_status == 1 ? 'bg-warning' 
                                            : loan.id_status == 4 ? 'bg-danger'
                                            : 'bg-success'
                                        }`}>
                                            {loan.status_loan.name}
                                        </span>
                                    </td>
                                    <td>{loan.reason}</td>
                                    <td className="d-flex flex-row gap-2">
                                        <Button 
                                            label="Detail" 
                                            variant="dark" 
                                            size="sm"
                                            onClick={() => {
                                                history.push({
                                                    pathname: '/asset/loan/detail',
                                                    state: {
                                                        id: loan.id,
                                                        typeAsset: loan.type
                                                    }
                                                });
                                            }} 
                                        />
                                        {/* {profile.id_position == 1 ? (
                                            <Button
                                                label="Hapus"
                                                variant="danger"
                                                onClick={() => {
                                                    setAlert(loan.id);
                                                }}
                                            />
                                        ) : null} */}
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
                    {all_loan && all_loan.length > 0 && listPage.map((list, index) => {
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
                title="Filter Peminjaman Barang"
                handleClose={handleModalFilter}
                body={
                    <div>
                        <Row className='d-flex gap-3 flex-row align-self-end'>
                            <Col sm={12} md={12} lg={12}>
                                <Form>
                                    <Form.Label>Jenis Asset</Form.Label>
                                    <Form.Select
                                        aria-label="Default select example"
                                        defaultValue={typeLoan}
                                        onChange={(e) => {
                                            setTypeLoan(e.target.value);
                                        }}
                                    >   
                                        <option key='all' value='all' selected={typeLoan == 'all' ? true : false}>Semua</option>
                                        {all_term_detail.map((term_detail, index) => {
                                            return (
                                                <option key={index} value={term_detail.key} selected={typeLoan == String(term_detail.key) ? true : false}>{term_detail.name}</option>
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
                            </Col>
                        </Row>
                    </div>
                }
            />
            <Modal
                show={showModaChooselLoan}
                size="lg"
                title="Peminjaman Barang"
                handleClose={handleModalChooseLoan}
                body={
                    <div>
                        <Row className='d-flex gap-3 flex-row align-self-end'>
                            <Col sm={12} md={12} lg={12}>
                                <Form>
                                    <Form.Label>Jenis Asset</Form.Label>
                                    <Form.Select
                                        aria-label="Default select example"
                                        defaultValue={typeLoanAsset}
                                        onChange={(e) => {
                                            setTypeLoanAsset(e.target.value);
                                        }}
                                    >   
                                        {all_term_detail.map((term_detail, index) => {
                                            return (
                                                <option key={index} value={term_detail.key} selected={typeLoanAsset == String(term_detail.key) ? true : false}>{term_detail.name}</option>
                                            );
                                        })}
                                    </Form.Select>
                                </Form>
                            </Col>
                            <Col sm={12} md={12} lg={12} className='align-self-end h-100'>
                                <div className='d-grid'>
                                    <Button 
                                        label="Tambah"
                                        size="md"
                                        onClick={() => {
                                            history.push({
                                                pathname: '/asset/loan/create',
                                                state: {
                                                    typeLoan: typeLoanAsset
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