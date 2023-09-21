import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AlertConfirm, Button, Preloader } from "../../components";
import * as action from "../../redux/actions";
import { ALERT_CONFIRM } from "../../redux/type";

const Index = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [id, setId] = useState("");

  const { load_condition, all_condition } = useSelector((state) => state.condition);
  const { open_confirm } = useSelector((state) => state.alert);

  const loadData = async () => {
    await dispatch(action.getAllCondition());
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const removeData = async () => {
    await dispatch(action.deleteCondition(id));
    loadData();
  };

  const redirectToUpdate = (id) => {
    history.push({
      pathname: "/condition/update",
      state: {
        id: id,
      },
    });
  };

  return load_condition ? (
    <Preloader />
  ) : (
    <Container className="pb-5">
      <AlertConfirm open={open_confirm} type="question" message="Yakin ingin nenghapus data ini ?" onConfirm={removeData} />
      <div style={{ width: "15%", marginBottom: "20px" }}>
        <Button label="Tambah Kondisi" variant="success" onClick={() => history.push("/condition/add")} />
      </div>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {all_condition.map((condition, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{condition.name}</td>

                <td className="d-flex flex-row gap-2">
                  <Button label="Update" variant="success" onClick={() => redirectToUpdate(condition.id)} />
                  <Button
                    label="Hapus"
                    variant="danger"
                    onClick={() => {
                      setAlert(condition.id);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Index;
