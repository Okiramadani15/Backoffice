import React, { useEffect, useState } from "react";
import { Col, Form, ListGroup, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Button, Gap, Input, Modal, Preloader } from "../../components";
import * as action from "../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

const Index = () => {
    const dispatch = useDispatch();

    const [page, setPage] = useState(1),
    [limit, setLimit] = useState(10),
    [search, setSearch] = useState(""),
    [listPage, setListPage] = useState([]),
    [showModal, setShowModal] = useState(false),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [subject, setSubject] = useState(""),
    [message, setMessage] = useState("");

    const { load_message, all_message } = useSelector((state) => state.message);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);

    const loadData = async () => {
        await dispatch(action.allMessage(page, limit, search));
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadMessage = async(page) => {
        setPage(page);
        await dispatch(action.allMessage(page, limit, search));
    }

    const handleShow = async(id, name, email, subject, message) => {
        showModal ? setShowModal(false) : setShowModal(true);
        setName(name);
        setEmail(email);
        setSubject(subject);
        setMessage(message);
        await dispatch(action.readMessage(id));
        await dispatch(action.countMessageUnRead());
        // await dispatch(action.allMessage(page, limit, search));
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);

    const handleSearch = async(keyword) => {
        setSearch(keyword);
        await dispatch(action.allMessage(1, limit, keyword));
    }

    const handleSelect = async(select) => {
        setLimit(select);
        await dispatch(action.allMessage(1, select, search));
    }
    return load_message && load_pagination ? (
        <Preloader />
    ) : (
        <div className="p-4">
            <Row className='d-flex justify-content-between align-items-end'>
                <Col sm={12} md={3} lg={2}>
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
            <Table bordered responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                {all_message.length > 0 ? (
                    all_message.map((message, index) => {
                    return (
                        <tr key={index} className={`${!message.is_read ? 'table-active' : ""}`}>
                            <td>{index + 1}</td>
                            <td>{message.name}</td>
                            <td>{message.email}</td>
                            <td>{message.subject}</td>
                            <td>{format(new Date(message.created_at), 'dd-MM-yyyy')}</td>
                            <td className="d-flex flex-row gap-2">
                                <Button
                                    label="Detail"
                                    onClick={() => {
                                        handleShow(message.id, message.name, message.email, message.subject, message.message);
                                    }}
                                />
                            </td>
                        </tr>
                    );
                    })
                ) : (
                    <tr>
                        <td colSpan={5} className="text-center">Data tidak ditemukan</td>
                    </tr>
                )}
                </tbody>
            </Table>

            {all_message.length > 0 && pagination && 
                <ListGroup className='d-flex flex-row flex-wrap justify-content-center'>
                {listPage.map((list, index) => {
                    return (
                    <ListGroup.Item 
                        key={index}
                        onClick={() => loadMessage(list.page)}
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

            <Modal 
                show={showModal} 
                handleClose={handleShow}
                title="Message"
                body={
                <div>
                    <Row className="border-bottom mb-2 pb-1">
                        <Col sm={2}>Nama</Col>
                        <Col sm={10}>{name}</Col>
                    </Row>
                    <Row className="border-bottom mb-2 pb-1">
                        <Col sm={2}>Email</Col>
                        <Col sm={10}>{email}</Col>
                    </Row>
                    <Row className="border-bottom mb-2 pb-1">
                        <Col sm={2}>Subject</Col>
                        <Col sm={10}>{subject}</Col>
                    </Row>
                    <Row className="border-bottom mb-2 pb-1">
                        <Col sm={2}>Pesan</Col>
                        <Col sm={10}>{message}</Col>
                    </Row>
                </div>
                }
            />
        </div>
    )
}

export default Index