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

  const { load_user, all_user } = useSelector((state) => state.user);
  const { open_confirm } = useSelector((state) => state.alert);

  const loadData = async () => {
    await dispatch(action.getAllUser());
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
    await dispatch(action.deleteUser(id));
    loadData();
  };

  const redirectToUpdate = (id) => {
    history.push({
      pathname: "/user/update",
      state: {
        id: id,
      },
    });
  };

  const redirectToAdd = () => {
    history.push("/register");
  };

  return load_user ? (
    <Preloader />
  ) : (
    <Container className="pb-5">
      <AlertConfirm open={open_confirm} type="question" message="Yakin ingin nenghapus data ini ?" onConfirm={removeData} />
      <div style={{ width: "15%", marginBottom: "20px" }}>
        <Button label="Tambah User" variant="success" onClick={() => history.push("/register")} />
      </div>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Alamat</th>
            <th>No Telp</th>
            <th>Jenis Kelamin</th>
            <th>Jabatan</th>
            <th>Photo</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {all_user.map((user, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
                <td>{user.gender.name}</td>
                <td>{user.position.name}</td>
                <td>{user.photo}</td>

                <td className="d-flex flex-row gap-2">
                  <Button label="Update" variant="success" onClick={() => redirectToUpdate(user.id)} />
                  <Button
                    label="Hapus"
                    variant="danger"
                    onClick={() => {
                      setAlert(user.id);
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
