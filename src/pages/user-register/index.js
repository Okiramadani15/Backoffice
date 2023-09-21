import { Container, Row, Col, Form, Dropdown, DropdownButton, SplitButton, ButtonGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Button, Gap, Input, Preloader, Upload } from "../../components";
import * as action from "../../redux/actions/";
import { Male, Profile } from "../../assets";

const Index = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const imageRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(Male);

  const { load_gender, all_gender } = useSelector((state) => state.gender);
  const { load_position, all_position } = useSelector((state) => state.position);

  const loadData = async () => {
    await dispatch(action.getAllGender());
    await dispatch(action.getAllPosition());
  };

  useEffect(() => {
    loadData();
  }, []);


  const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
    initialValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      id_gender: "",
      id_position: "",
      password: "",
      photo: "",
    },

    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("phone", values.phone);
      formData.append("id_gender", values.id_gender);
      formData.append("id_position", values.id_position);
      formData.append("password", values.password);
      formData.append("photo", values.photo);

      let response = await dispatch(action.createUser(values));
      if (response.status == "success") {
        handleReset();
        history.goBack();
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Tidak boleh kosong!"),
      email: Yup.string()
            .email('Format email salah')
            .required("Tidak boleh kosong"),
      address: Yup.string().required("Tidak boleh kosong"),
      phone: Yup.string().required("Tidak boleh kosong"),
      id_gender: Yup.string().required("Tidak boleh kosong"),
      id_position: Yup.string().required("Tidak boleh kosong"),
      password: Yup.string().required("Tidak boleh kosong"),
    }),
  });

  const handleImageRef = () => {
    imageRef.current.click();
  }

  const handleSelectImage = (image) => {
    if (image.target.files.length !== 0) {
      setFieldValue('photo', image.target.files[0]);
      setImagePreview(URL.createObjectURL(image.target.files[0]));
    }
  }

  return load_gender && load_position ? (
    <Preloader />
  ) : (
    <div className="p-4">
      <Row className="d-flex align-items-start">
        <Col className="p-4" lg={4}>
          <img src={imagePreview} alt="Photo Profile" className="" />
          <input type="file" className="d-none" ref={imageRef} onChange={(e) => {handleSelectImage(e)}} />
          <Gap width={0} height={10} />
          <div className="d-grid">
            <Button label="Pilih Foto" size="sm" onClick={handleImageRef} />
          </div>
        </Col>

        <Col className="p-4" lg={8}>
          <div>
            <Input
              label="Nama"
              autofocus
              required
              placeholder=""
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
          </div>
          <Gap width={0} height={10} />
          <div>
            <Input
              label="Email"
              autofocus
              required
              placeholder="example@alhasyimiyah.ponpes.id"
              type="text"
              onChange={(e) => {
                setFieldValue("email", e.target.value);
              }}
              value={values.email}
            />
            {touched.email && errors.email && (
              <span className="text-danger" style={{ fontSize: "12px" }}>
                {errors.email}
              </span>
            )}
          </div>
          <Gap width={0} height={10} />
          <div>
            <Input
              label="Alamat"
              autofocus
              required
              placeholder=""
              type="text"
              onChange={(e) => {
                setFieldValue("address", e.target.value);
              }}
              value={values.address}
            />
            {touched.address && errors.address && (
              <span className="text-danger" style={{ fontSize: "12px" }}>
                {errors.address}
              </span>
            )}
          </div>
          <Gap width={0} height={10} />
          <div>
            <Input
              label="No. Telp/Hp"
              autofocus
              required
              placeholder="0"
              type="text"
              onChange={(e) => {
                setFieldValue("phone", e.target.value);
              }}
              value={values.phone}
            />
            {touched.phone && errors.phone && (
              <span className="text-danger" style={{ fontSize: "12px" }}>
                {errors.phone}
              </span>
            )}
          </div>
          <Gap width={0} height={10} />
          <div>
            <Form>
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Select
                aria-label="Default select example"
                defaultValue=""
                onChange={(e) => {
                  setFieldValue("id_gender", e.target.value);
                }}
              >
                <option value="" disabled>Pilih Jenis Kelamin</option>;
                {all_gender.map((gender, index) => {
                  return (
                    <option key={index} value={gender.id}>
                      {gender.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form>
            {touched.id_gender && errors.id_gender && (
              <span className="text-danger" style={{ fontSize: "12px" }}>
                {errors.id_gender}
              </span>
            )}
          </div>
          <Gap width={0} height={10} />
          <div>
            <Form>
              <Form.Label>Jabatan</Form.Label>
              <Form.Select
                aria-label="Default select example"
                defaultValue=""
                onChange={(e) => {
                  setFieldValue("id_position", e.target.value);
                }}
              >
                <option value="" disabled>Pilih Jabatan</option>;
                {all_position.map((position, index) => {
                  return (
                    position.id != 1 ? (
                      <option key={index} value={position.id}>
                        {position.name}
                      </option>
                    ) : null
                  );
                })}
              </Form.Select>
            </Form>
            {touched.id_position && errors.id_position && (
              <span className="text-danger" style={{ fontSize: "12px" }}>
                {errors.id_position}
              </span>
            )}
          </div>
          <Gap width={0} height={10} />
          <div>
            <Input
              label="Password"
              autofocus
              required
              placeholder="***"
              type="password"
              onChange={(e) => {
                setFieldValue("password", e.target.value);
              }}
              value={values.password}
            />
            {touched.password && errors.password && (
              <span className="text-danger" style={{ fontSize: "12px" }}>
                {errors.password}
              </span>
            )}
          </div>
          
          <Gap width={0} height={30} />
          <div className="d-grid">
            <Button label="Tambah" size="md" onClick={handleSubmit} />
          </div>
        </Col>
      </Row>
      <Gap width={0} height={50} />
    </div>
  );
};

export default Index;
