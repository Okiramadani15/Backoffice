import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Gap, Input, Preloader } from "../../components";
import * as action from "../../redux/actions/";
import { Container } from "react-bootstrap";

const Index = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const { load_condition, detail } = useSelector((state) => state.condition);

  const loadData = async () => {
    await dispatch(action.detialCondition(location.state.id));
  };

  useEffect(() => {
    loadData();
  }, []);

  const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
    initialValues: {
      id: location.state.id,
      id: "",
      name: "",
    },
    onSubmit: async (values) => {
      let response = await dispatch(action.updateCondition(values));
      if (response.status == "success") {
        history.goBack();
      }
    },
    validationSchema: Yup.object().shape({
      id: Yup.string().required("Tidak boleh kosong!"),
      name: Yup.string().required("Tidak boleh kosong!"),
    }),
  });

  useEffect(() => {
    if (detail.length != 0) {
      setFieldValue("id", detail.id);
      setFieldValue("name", detail.name);
    }
  }, [detail]);

  return load_condition ? (
    <Preloader />
  ) : (
    <Container>
      {/* <Input
        label="Id"
        autofocus
        required
        placeholder="example"
        type="number"
        onChange={(e) => {
          setFieldValue("id", e.target.value);
        }}
        value={values.id}
      />
      {touched.id && errors.id && (
        <span className="text-danger" style={{ fontSize: "12px" }}>
          {errors.id}
        </span>
      )} */}
      <Gap width={0} height={20} />

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
      <Gap width={0} height={40} />

      <Button label="Tambah" onClick={handleSubmit} />
    </Container>
  );
};

export default Index;
