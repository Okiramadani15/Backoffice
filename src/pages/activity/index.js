import { faChevronLeft, faChevronRight, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { Card, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { NoData } from '../../assets';
import { AlertConfirm, Button, Gap, Input, Preloader } from '../../components';
import * as action from "../../redux/actions";
import { ALERT_CONFIRM } from '../../redux/type';
import { UseLimitWords } from '../../utils';
import { Markup } from 'interweave';

const Index = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [page, setPage] = useState(1),
    [limit, setLimit] = useState(15),
    [search, setSearch] = useState(""),
    [listPage, setListPage] = useState([]),
    [idActivity, setIdActivity] = useState("");;

    const { load_activity, all_activity } = useSelector((state) => state.activity);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);
    const { open_confirm } = useSelector((state) => state.alert);

    const loadData = async() => {
        await dispatch(action.getActivity(page, limit, search));
    }

    useEffect(() => {
        loadData();
    }, []);

    const loadActivity = async(page) => {
        setPage(page);
        await dispatch(action.getActivity(page, limit, search));
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);

    const setAlert = async (id) => {
        setIdActivity(id);
    
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
        let response = await dispatch(action.deleteActivity(idActivity));
        if(response.status == 'success'){
            loadData();
        }   
    }

    const searchActivity = async(keyword) => {
        setSearch(keyword);
        await dispatch(action.getActivity(1, limit, keyword));
    }

    const handleSelect = async(select) => {
        setLimit(select);
        await dispatch(action.getActivity(1, select, search));
    }

    const getText = (html) => {
        var divContainer= document.createElement("div");
        divContainer.innerHTML = html;
        return divContainer.textContent || divContainer.innerText || "";
    }
    

    return load_activity && load_pagination ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <AlertConfirm 
                open={open_confirm} 
                type="question" 
                message="Yakin ingin nenghapus data ini ?" 
                onConfirm={removeData} 
            />
            <Row className='d-flex justify-content-between'>
                {all_activity.length > 0 ? (
                    <>
                        <Col sm={12} md={3} lg={2}>
                            <div className='d-grid'>
                                <Button
                                    label="Tambah Aktifitas" 
                                    variant="success" 
                                    size="md"
                                    onClick={() => {
                                        history.push('/activity/create');
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
                                    searchActivity(e.target.value);
                                }}
                                value={search}
                            />
                        </Col>
                    </>
                ) : (
                    <Col sm={12} md={3} lg={2}>
                        <div className='d-grid'>
                            <Button
                                label="Tambah Aktifitas" 
                                variant="success" 
                                size="md"
                                onClick={() => {
                                    history.push('/activity/create');
                                }} 
                            />
                        </div>
                        <Gap width={0} height={20} />
                    </Col>
                )}
            </Row>
            
            <Gap width={0} height={30} /> 
            <Row>
                {all_activity.length > 0 ? 
                    all_activity.map((activity, index) => {
                        return (
                            <Col xs={12} sm={6} md={6} lg={4} key={index}>
                                <Card>
                                    <Card.Img variant="top" src={process.env.REACT_APP_BASE_URL + activity.image} style={{height: '300px'}} />
                                    <Card.Body>
                                        <Card.Title className='fs-3 fw-bold'>{activity.title}</Card.Title>
                                    </Card.Body>
                                    <Card.Body className='p-0 d-flex gap-3'>
                                        <Button 
                                            label={<FontAwesomeIcon icon={faEdit} />}
                                            fullwidth
                                            size="md"
                                            onClick={() => history.push({
                                                pathname: '/activity/update',
                                                state: {
                                                    id: activity.id
                                                }
                                            })}
                                        />
                                        <Button 
                                            label={<FontAwesomeIcon icon={faTrashAlt} />}
                                            size="md"
                                            fullwidth
                                            variant="danger"
                                            onClick={() => {
                                                setAlert(activity.id)
                                            }}
                                        />
                                    </Card.Body>
                                </Card>
                                <Gap width={0} height={30} /> 
                            </Col>
                        )
                    })
                    : (
                        <Col lg={4} className="mx-auto">
                            <img src={NoData} alt="No Data" />
                            <p className='text-center fw-bold fs-5'>Data tidak ditemukan !!!</p>
                        </Col>
                    )

                }
            </Row>
            <Gap width={0} height={80} />
            <div>
                {pagination && 
                <ListGroup className='d-flex flex-row flex-wrap justify-content-center'>
                    {all_activity.length > 0 && listPage.map((list, index) => {
                        return (
                            <ListGroup.Item 
                                key={index}
                                onClick={() => loadActivity(list.page)}
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