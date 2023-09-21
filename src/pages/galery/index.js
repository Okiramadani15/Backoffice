import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Container, Form, ListGroup, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AlertConfirm, Button, Gap, Input, Modal, Preloader } from "../../components";
import * as action from "../../redux/actions";
import { ALERT_CONFIRM } from "../../redux/type";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { AssetDefault } from '../../assets';

const Index = () => {
  const dispatch = useDispatch();
  const imageRef = useRef();

  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [listPage, setListPage] = useState([]);
  const [imagePreview, setImagePreview] = useState(AssetDefault);

  const { load_galery, all_galery } = useSelector((state) => state.galery);
  const { open_confirm } = useSelector((state) => state.alert);

  const loadData = async () => {
    await dispatch(action.getAllGalery());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleShow = () => {
    showModal ? setShowModal(false) : setShowModal(true);
  };


  const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
    initialValues: {
        id: "",
        photo: "",
        preview: "",
    },

    onSubmit: async (values) => {
        const formData = new FormData();
        formData.append("id", values.id);
        formData.append("preview", values.photo);
        formData.append("photo", values.photo);

        handleShow();
        
        let response = await dispatch(action.updateGalery(formData));
        console.log(response);
        
        if (response.status == "success") {
          setImagePreview(AssetDefault);
            loadData();
            handleShow();
        }
    },
    validationSchema: Yup.object().shape({
        id: Yup.string().required("Tidak boleh kosong!"),
        photo: Yup.string().required("Tidak boleh kosong!"),
        preview: Yup.string().required("Tidak boleh kosong!"),
    }),
  });

  const handleImageRef = () => {
    imageRef.current.click();
}

  const handleSelectImage = (image) => {
    if (image.target.files.length !== 0) {
        setFieldValue('photo', image.target.files[0]);
        setFieldValue('preview', image.target.files[0]);
        setImagePreview(URL.createObjectURL(image.target.files[0]));
    }
}

  return load_galery ? (
    <Preloader />
  ) : (
    <div className="p-4">
      <Row>
        {all_galery.map((galery, index) => {
          return (
            <Col sm='12' md='6' lg='4' xl='3' className="mb-3" key={index}>
              <Card>
                <Card.Img variant="top" src={process.env.REACT_APP_BASE_URL + galery.path} style={{aspectRatio: 16/9}} className="mb-1" />
                <Button 
                  label='Edit' 
                  variant='primary' 
                  size='md' 
                  onClick={() => {
                    handleShow();
                    setFieldValue('id', galery.id);
                  }} 
                  fullwidth 
                />
              </Card>
            </Col>
          )
        })}
      </Row>
      <Modal 
          show={showModal} 
          handleClose={handleShow}
          title="Edit Gambar"
          size='md'
          body={
            <div>
              <img src={imagePreview} alt="Photo Profile" onClick={handleImageRef} style={{cursor: 'pointer'}} />
              <input type="file" className="d-none" ref={imageRef} onChange={(e) => {handleSelectImage(e)}} />
              {touched.photo && errors.photo && (
                <span className="text-danger" style={{ fontSize: "12px" }}>
                    {errors.photo}
                </span>
              )}
              <Gap width={0} height={10} />
              <div className="d-grid">
                  <Button label="Simpan" size="md" onClick={() => {
                    handleSubmit();
                  }} />
              </div>
            </div>
          }
      />
    </div>
  );
};

export default Index;
