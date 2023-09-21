import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Button, Gap, Input } from "../../components";
import * as action from "../../redux/actions/";

const Index = () => {
  const dispatch = useDispatch();

  const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values) => {
      let response = await dispatch(action.addCondition(values));
      if (response.status == "success") {
        handleReset();
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Tidak boleh kosong!"),
    }),
  });

  return (
    <Container>
      <Input
        label="Nama"
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

      <Gap width={0} height={40} />

      <Button label="Tambah" onClick={handleSubmit} />
    </Container>
  );
};
export default Index;
