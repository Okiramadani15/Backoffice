import { faArrowRotateRight, faChevronLeft, faChevronRight, faEdit, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Col, Container, Form, ListGroup, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { AlertConfirm, Button, Gap, Input, Preloader } from '../../components';
import * as action from '../../redux/actions/';
import { ALERT_CONFIRM } from '../../redux/type';

const Index = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [id, setId] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [search, setSearch] = useState("");
    const [listPage, setListPage] = useState([]);

    const {load_user, all_user} = useSelector((state) => state.user);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);
    const {open_confirm} = useSelector((state) => state.alert);

    const loadData = async() => {
        await dispatch(action.getAllUser(page, limit, search));
    }

    useEffect(() => {
        loadData();
    }, []);

    const loadUser = async(page) => {
        setPage(page);
        await dispatch(action.getAllUser(page, limit, search));
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);

    const setAlert = async(id) => {
        setId(id);

        await dispatch({
            type: ALERT_CONFIRM,
            payload: {
                open_confirm: true,
                type: "question",
                message: "Yakin ingin nenghapus data ini ?"
            }
        });
    }

    const removeUser = async() => {
        let response = await dispatch(action.deleteUser(id));
        if(response.status == 'success'){
            loadData();
        }
    }

    const redirectToUpdate = (idUser) => {
        history.push({
            pathname: '/user/update',
            state: {
                id: idUser
            }
        });
    }

    const handleSearch = async(keyword) => {
        setSearch(keyword);
        await dispatch(action.getAllUser(1, limit, keyword));
    }

    const handleSelect = async(select) => {
        setLimit(select);
        await dispatch(action.getAllUser(1, select, search));
    }

    return load_user && load_pagination ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <AlertConfirm open={open_confirm} type="question" message="Yakin ingin nenghapus data ini ?" onConfirm={removeUser} />
            <Row className='d-flex justify-content-between'>
                <Col sm={12} md={3} lg={2}>
                    <div className='d-grid'>
                        <Button
                            label="Tambah User" 
                            variant="success" 
                            size="md"
                            onClick={() => history.push('/user/register')} 
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
                            handleSearch(e.target.value);
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
                        <th>Foto</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Alamat</th>
                        <th>No HP</th>
                        <th>JK</th>
                        <th>Jabatan</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {all_user.map((user, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={process.env.REACT_APP_BASE_URL + user.photo} className="img-fluid" style={{height: '50px', width: '50px'}} />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.address}</td>
                                <td>{user.phone}</td>
                                <td>{user.gender.name}</td>
                                <td>{user.position.name}</td>
                                <td>
                                    <div className='d-flex flex-column gap-2'>
                                        <Button label={<FontAwesomeIcon icon={faEdit} />} variant="success" onClick={() => redirectToUpdate(user.id)} />
                                        <Button label={<FontAwesomeIcon icon={faTrashAlt} />} fullwidth variant="danger" onClick={() => {
                                            setAlert(user.id);
                                        }} />
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            {all_user.length > 0 && pagination && 
                <ListGroup className='d-flex flex-row flex-wrap justify-content-center mt-3 mb-5'>
                    {listPage.map((list, index) => {
                        return (
                        <ListGroup.Item 
                            key={index}
                            onClick={() => loadUser(list.page)}
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
                </ListGroup>
            }
        </div>
    )
}

export default Index