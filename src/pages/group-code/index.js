import React, { useEffect, useState } from "react";
import { Col, Container, Form, ListGroup, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AlertConfirm, Button, Gap, Input, Modal, Preloader } from "../../components";
import * as action from "../../redux/actions";
import { ALERT_CONFIRM } from "../../redux/type";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  const dispatch = useDispatch();

  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [listPage, setListPage] = useState([]);

  const { load_code, code_with_pagination } = useSelector((state) => state.groupCode);
  const { load_pagination, pagination } = useSelector((state) => state.pagination);
  const { open_confirm } = useSelector((state) => state.alert);

  const loadData = async () => {
    await dispatch(action.allCodeWithPagination(page, limit, search));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadCode = async(page) => {
    setPage(page);
    await dispatch(action.allCodeWithPagination(page, limit, search));
  }

  useEffect(() => {
    if(!pagination.isArray){
        if(Object.keys(pagination).length > 0){
            setListPage(pagination.list_page);
        }
    }
  }, [pagination]);

  const setAlert = async (id) => {
    setId(id);

    await dispatch({
      type: ALERT_CONFIRM,
      payload: {
        open_confirm: true,
        type: "question",
        message: "Yakin ingin nenghapus data ini ?",
      },
    });
  };

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
          response = await dispatch(action.updateCode(values));
      }else{
          response = await dispatch(action.addCode(values));
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
  }

  const removeData = async () => {
    await dispatch(action.deleteCode(id));
    loadData();
  };

  const handleSearch = async(keyword) => {
    setSearch(keyword);
    await dispatch(action.allCodeWithPagination(1, limit, keyword));
  }

  const handleSelect = async(select) => {
    setLimit(select);
    await dispatch(action.allCodeWithPagination(1, select, search));
  }

  return load_code && load_pagination ? (
    <Preloader />
  ) : (
    <div className="p-4">
      <AlertConfirm open={open_confirm} type="question" message="Yakin ingin nenghapus data ini ?" onConfirm={removeData} />
      <Row className='d-flex justify-content-between'>
          <Col sm={12} md={3} lg={2}>
            <div className='d-grid'>
                <Button
                    label="Tambah Kode Golongan" 
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
            <th>Nama</th>
            <th>Kode</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {code_with_pagination.length > 0 ? (
            code_with_pagination.map((code, index) => {
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{code.name}</td>
                  <td>{code.code}</td>
                  <td className="d-flex flex-row gap-2">
                    <>
                      <Button 
                        label="Update" 
                        variant="success" 
                        onClick={() => {
                          setFieldValue('id', code.id);
                          setFieldValue('name', code.name);
                          setFieldValue('code', code.code);
                          setFieldValue('action', "update");
                          handleShow();
                        }} 
                      />
                      <Button
                        label="Hapus"
                        variant="danger"
                        onClick={() => {
                          setAlert(code.id);
                        }}
                      />
                    </>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
                <td colSpan={4} className="text-center">Data tidak ditemukan</td>
            </tr>
          )}
        </tbody>
      </Table>

      {code_with_pagination.length > 0 && pagination && 
        <ListGroup className='d-flex flex-row flex-wrap justify-content-center'>
          {listPage.map((list, index) => {
            return (
              <ListGroup.Item 
                key={index}
                onClick={() => loadCode(list.page)}
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
        title="Jabatan"
        size='md'
        body={
          <div>
              <Input
                  label="Nama Golongan"
                  autofocus
                  required
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
                  label="Kode Golongan"
                  required
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
  );
};

export default Index;
