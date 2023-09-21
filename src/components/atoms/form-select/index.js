import React from "react";
import { Form } from "react-bootstrap";

const Index = ({ setFieldValue, onChange, all_gender }) => {
  return (
    <div>
      <Form>
        <Form.Label>Jenis Kelamin</Form.Label>
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => {
            setFieldValue("id_gender", e.target.value);
          }}
        >
          <option value="Pilih Jenis Kelamin">Pilih Jenis Kelamin</option>;
          {all_gender.map((gender, index) => {
            return (
              <option key={index} value={gender.id}>
                {gender.name}
              </option>
            );
          })}
        </Form.Select>
      </Form>
    </div>
  );
};

export default Index;
