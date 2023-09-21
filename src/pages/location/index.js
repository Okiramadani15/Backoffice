import React, { useEffect, useMemo, useState } from 'react'
import { Col, Form, ListGroup, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { AlertConfirm, Button, Gap, Input, Modal, Preloader } from '../../components';
import * as action from "../../redux/actions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ALERT_CONFIRM } from '../../redux/type';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Index = () => {
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [idLocation, setIdLocation] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [listPage, setListPage] = useState([]);

    const { load_location, location_with_pagination } = useSelector((state) => state.location);
    const { open_confirm } = useSelector((state) => state.alert);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);

    const loadData = async () => {
        await dispatch(action.allLocationWithPagination(page, limit, search));
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadPagination = async(page) => {
        setPage(page);
        await dispatch(action.allLocationWithPagination(page, limit, search));
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);
       
    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            id: "",
            name: "",
            code: "",
            action: ""
        },
        onSubmit: async (values) => {
            
            let response = null;
            if(values.action == "update"){
                response = await dispatch(action.updateLocation(values));
            }else{
                response = await dispatch(action.addLocation(values));
            }
            
            if (response.status == "success") {
                handleReset();
                loadData();
                handleShow();
            }
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Tidak boleh kosong!"),
            code: Yup.string().required("Tidak boleh kosong!"),
            action: Yup.string().required("Tidak boleh kosong!"),
        }),
    });

    const handleShow = () => {
        showModal ? setShowModal(false) : setShowModal(true);
    };

    const setAlert = async (id) => {
        setIdLocation(id);
    
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
        let response = await dispatch(action.deleteLocation(idLocation));
        if(response.status == 'success'){
            loadData();
        }   
    }

    const searchLocation = async(location) => {
        setSearch(location);
        await dispatch(action.allLocationWithPagination(1, limit, location));
    }

    const handleSelect = async(select) => {
        setLimit(select);
        await dispatch(action.allLocationWithPagination(1, select, search));
    }

    return load_location && load_pagination ? (
        <Preloader/>
    ) : (
        <div className='p-4'>
            <AlertConfirm 
                open={open_confirm} 
                type="question" 
                message="Yakin ingin nenghapus data ini ?" 
                onConfirm={removeData} 
            />
            <Row className='d-flex justify-content-between'>
                <Col sm={12} md={3} lg={2}>
                    <div className='d-grid'>
                        <Button
                            label="Tambah Lokasi" 
                            variant="success" 
                            size="md"
                            onClick={() => {
                                setFieldValue('action', "create");
                                setFieldValue('name', "");
                                setFieldValue('code', "");
                                handleShow();
                            }} 
                        />
                    </div>
                    <Gap width={0} height={20} />
                    <Form>
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
                    <Input
                        autofocus
                        placeholder="cari..."
                        type="text"
                        onChange={(e) => {
                            searchLocation(e.target.value);
                        }}
                        value={search}
                    />
                </Col>
            </Row>
            <Gap width={0} height={10} /> 
            <Table striped bordered responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Lokasi</th>
                    <th>Kode</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                    {location_with_pagination.length > 0 ? (
                        location_with_pagination.map((location, index) => {
                            return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{location.name}</td>
                                <td>{location.code}</td>
                                <td className="d-flex flex-row gap-2">
                                    <Button 
                                        label="Ubah" 
                                        variant="success" 
                                        size="sm"
                                        onClick={() => {
                                            setFieldValue('id', location.id);
                                            setFieldValue('name', location.name);
                                            setFieldValue('code', location.code);
                                            setFieldValue('action', "update");
                                            handleShow();
                                        }} 
                                    />
                                    <Button
                                        label="Hapus"
                                        variant="danger"
                                        onClick={() => {
                                            setAlert(location.id);
                                        }}
                                    />
                                </td>
                            </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center">Data tidak ditemukan</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div>
                <Modal 
                    show={showModal} 
                    handleClose={handleShow}
                    title="Lokasi"
                    size='md'
                    body={
                        <div>
                            <Input
                                label="Lokasi"
                                autofocus
                                required
                                placeholder="example"
                                type="text"
                                onChange={(e) => {
                                    setFieldValue("name", e.target.value);
                                }}
                                value={values.name}
                            />
                            {touched.name && errors.name && (
                                <span className="text-danger" style={{ fontSize: "12px" }}>
                                    {errors.name}
                                </span>
                            )}
                            <Gap width={0} height={20} />
                            <Input
                                label="code"
                                autofocus
                                required
                                placeholder=""
                                type="text"
                                onChange={(e) => {
                                    setFieldValue("code", e.target.value);
                                }}
                                value={values.code}
                            />
                            {touched.code && errors.code && (
                                <span className="text-danger" style={{ fontSize: "12px" }}>
                                    {errors.code}
                                </span>
                            )}
                            <Gap width={0} height={20} />
                            <Button
                                label="Simpan"
                                variant="success"
                                size='md'
                                fullwidth
                                onClick={handleSubmit}
                            />
                        </div>
                    }
                />
            </div>
            <Gap width={0} height={10} />
            <div>
                {pagination && 
                <ListGroup className='d-flex flex-row flex-wrap justify-content-center'>
                    {location_with_pagination.length > 0 && listPage.map((list, index) => {
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
            <Gap width={0} height={30} />
        </div>
    )
}

export default Index