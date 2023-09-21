import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Col, Form, ListGroup, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { AlertConfirm, Button, Gap, Input, Modal, Preloader, Select } from '../../components';
import * as action from "../../redux/actions";
import { ALERT_CONFIRM } from '../../redux/type';
import { useFormik } from "formik";
import * as Yup from "yup";
import { getSemester } from '../../redux/actions/semester';

const Index = () => {
    const dispatch = useDispatch();

    const [page, setPage] = useState(1),
    [limit, setLimit] = useState(10),
    [search, setSearch] = useState(""),
    [listPage, setListPage] = useState([]),
    [idCalendar, setIdCalendar] = useState(""),
    [showModal, setShowModal] = useState(false);

    const { load_calendar, all_calendar } = useSelector((state) => state.calendar);
    const { load_semester, all_semester } = useSelector((state) => state.semester);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);
    const { open_confirm } = useSelector((state) => state.alert);

    const loadData = async() => {
        await dispatch(action.getAllCalendar(page, limit, search));
        await dispatch(action.getSemester());
    }

    useEffect(() => {
        loadData();
    }, []);

    const loadCalendar = async(page) => {
        setPage(page);
        await dispatch(action.getAllCalendar(page, limit, search));
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);

    const setAlert = async (id) => {
        setIdCalendar(id);
    
        await dispatch({
          type: ALERT_CONFIRM,
          payload: {
            open_confirm: true,
            type: "question",
            message: "Yakin ingin nenghapus data ini ?",
          },
        });
    };

    const removeCalendar = async() => {
        let response = await dispatch(action.deleteCalendar(idCalendar));
        if(response.status == 'success'){
            loadData();
        }   
    }

    const handleShow = () => {
        showModal ? setShowModal(false) : setShowModal(true);
    };

    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            id: "",
            description: "",
            from: "",
            to: "",
            id_semester: "",
        },
        onSubmit: async (values) => {
            
            let response = null;
            if(values.action == "update"){
                response = await dispatch(action.updateCalendar(values));
            }else{
                response = await dispatch(action.createCalendar(values));
            }
            
            if (response.status == "success") {
                handleReset();
                loadData();
                handleShow();
            }
        },
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Tidak boleh kosong!"),
            from: Yup.string().required("Tidak boleh kosong!"),
            to: Yup.string().required("Tidak boleh kosong!"),
            id_semester: Yup.string().required("Tidak boleh kosong!"),
            action: Yup.string().required("Tidak boleh kosong!"),
        }),
    });

    const searchLocation = async(keyword) => {
        setSearch(keyword);
        await dispatch(action.getAllCalendar(1, limit, keyword));
    }

    const handleSelect = async(select) => {
        setLimit(select);
        await dispatch(action.getAllCalendar(1, select, search));
    }

    return load_calendar && load_pagination && load_semester ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <AlertConfirm 
                open={open_confirm} 
                type="question" 
                message="Yakin ingin nenghapus data ini ?" 
                onConfirm={removeCalendar} 
            />
            <Row className='d-flex justify-content-between'>
                <Col sm={12} md={3} lg={3}>
                    <div className='d-grid'>
                        <Button
                            label="Kalender Pendidikan" 
                            variant="success" 
                            size="md"
                            onClick={() => {
                                setFieldValue('action', "create");
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
                        <th>Keterangan</th>
                        <th>Dari</th>
                        <th>Sampai</th>
                        <th>Semester</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {all_calendar.length > 0 ? (
                        all_calendar.map((calendar, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{calendar.description}</td>
                                    <td>{format(new Date(calendar.from), 'dd-MM-yyyy')}</td>
                                    <td>{format(new Date(calendar.to), 'dd-MM-yyyy')}</td>
                                    <td>{calendar.semester.name}</td>
                                    <td className="d-flex flex-row gap-2">
                                        <Button 
                                            label="Ubah" 
                                            variant="success" 
                                            size="sm"
                                            onClick={() => {
                                                setFieldValue('id', calendar.id);
                                                setFieldValue('description', calendar.description);
                                                setFieldValue('from', calendar.from);
                                                setFieldValue('to', calendar.to);
                                                setFieldValue('id_semester', calendar.id_semester);
                                                setFieldValue('action', "update");
                                                handleShow();
                                            }} 
                                        />
                                        <Button
                                            label="Hapus"
                                            variant="danger"
                                            onClick={() => {
                                                setAlert(calendar.id);
                                            }}
                                        />
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
            <div>
                {pagination && 
                <ListGroup className='d-flex flex-row flex-wrap justify-content-center'>
                    {all_calendar.length > 0 && listPage.map((list, index) => {
                        return (
                            <ListGroup.Item 
                                key={index}
                                onClick={() => loadCalendar(list.page)}
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
            <Modal 
                show={showModal} 
                handleClose={handleShow}
                title="Kalender Pendidikan"
                body={
                    <div>
                        <Input
                            label="Keterangan"
                            autofocus
                            required
                            placeholder=""
                            type="text"
                            onChange={(e) => {
                                setFieldValue("description", e.target.value);
                            }}
                            value={values.description}
                        />
                        {touched.description && errors.description && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.description}
                            </span>
                        )}
                        <Gap width={0} height={20} />
                        <Input 
                            label="Dari" 
                            required 
                            type="date"
                            onChange={(e) => {
                                setFieldValue("from", e.target.value);
                            }}
                            value={values.from}
                        />
                        {touched.from && errors.from && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.from}
                            </span>
                        )}
                        <Gap width={0} height={20} />
                        <Input 
                            label="Sampai" 
                            required 
                            type="date"
                            onChange={(e) => {
                                setFieldValue("to", e.target.value);
                            }}
                            value={values.to}
                        />
                        {touched.to && errors.to && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.to}
                            </span>
                        )}
                        <Gap width={0} height={20} />
                        <Select 
                            label="Semester" 
                            required
                            handleOption={(e) => {
                                setFieldValue('id_semester', e.target.value)
                            }}
                            listOption={
                                all_semester.map((semester, index) => {
                                    return (
                                        <option 
                                            key={index} 
                                            value={semester.id} 
                                            selected={semester.id == values.id_semester ? true : false}
                                        >
                                            {semester.name}
                                        </option>
                                    )
                                })
                            }
                        />
                        {touched.id_semester && errors.id_semester && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.id_semester}
                            </span>
                        )}
                        <Gap width={0} height={20} />
                        <Button
                            label="Simpan"
                            size="md"
                            fullwidth
                            onClick={handleSubmit}
                        />
                    </div>
                }
            />
        </div>
    )
}

export default Index