import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Gap, Input, Modal, Preloader } from '../../components';
import * as action from "../../redux/actions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { AssetDefault } from '../../assets';

const Index = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const imageRef = useRef();

    const [showModal, setShowModal] = useState(false),
    [showModalDetail, setShowModalDetail] = useState(false),
    [idDetail, setIdDetail] = useState(""),
    [quantityReceived, setQuantityReceived] = useState(0),
    [maxQuantity, setMaxQuantity] = useState(0),
    [imagePreview, setImagePreview] = useState(AssetDefault);

    const { load_loan, detail_loan } = useSelector((state) => state.loan);
    const {load_term, all_term_detail} = useSelector((state) => state.term);
    const {load_auth, profile} = useSelector((state) => state.auth);

    const loadData = async () => {
        await dispatch(action.detailLoan(location.state.id));
        await dispatch(action.getTermDetail(1));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleShowModal = () => {
        showModal ? setShowModal(false) : setShowModal(true);
    }

    const handleShowModalDetail = () => {
        showModalDetail ? setShowModalDetail(false) : setShowModalDetail(true);
    }

    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            id: location.state.id,
            id_status: "",
            reason_reject: "-",
            photo: "",
        },
        onSubmit: async (values) => {
            if(values.id_status == 4){
                let data = {
                    id: values.id,
                    id_status: values.id_status,
                    reason_reject: values.reason_reject
                }

                let response = await dispatch(action.loanDecline(data));
                if(response.status == "success"){
                    loadData();
                    handleShowModal();
                }
            }else{
                const formData = new FormData();
                formData.append('id', values.id);
                formData.append('id_status', values.id_status);
                formData.append('reason_reject', values.reason_reject);
                formData.append('photo', values.photo);
    
                let response = await dispatch(action.changeStatusLoan(formData));
                if(response.status == "success"){
                    loadData();
                    handleShowModal();
                }

            }

        },
        validationSchema: Yup.object().shape({
            id: Yup.string().required("Tidak boleh kosong!"),
            id_status: Yup.string().required("Tidak boleh kosong!"),
            reason_reject: Yup.string().required("Tidak boleh kosong!"),
        }),
    });

    const redirectToUpdate = (id, detail) => {
        let tmpData = [];
        detail.map((tmpDetail) => {
            let datas = {
                id_asset: tmpDetail.asset.id,
                id_detail_loan: tmpDetail.id,
                asset_name: tmpDetail.asset.name,
                first_location: tmpDetail.asset.location,
                id_location_now: tmpDetail.location_now.id,
                location_now: tmpDetail.location_now.name,
                total_asset: tmpDetail.asset.total,
                quantity_loan: tmpDetail.quantity
            }

            tmpData.push(datas);
        })

        history.push({
            pathname :'/asset/loan/update',
            state: {
                id: id,
                data: tmpData,
            }
        })
    }

    const handleUpdateQuantity = async() => {
        let data = {
            id: idDetail,
            quantity_received: quantityReceived
        }
        
        let response = await dispatch(action.updateDetailLoan(data));
        if(response.status == "success"){
            loadData();
            handleShowModalDetail();
        }
    }

    const handleImageRef = () => {
        imageRef.current.click();
    }
    
    const handleSelectImage = (image) => {
        if (image.target.files.length !== 0) {
            setFieldValue('photo', image.target.files[0]);
            setImagePreview(URL.createObjectURL(image.target.files[0]));
        }
    }

    return load_loan ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <Gap width={0} height={30} />
            {detail_loan.responsible && detail_loan.status_loan && 
                <Row>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Peminjaman</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {location.state.typeAsset == 1 ? 'Sarana' : 'Prasarana'}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Penanggung Jawab</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_loan.responsible.name}
                        </div>
                    </Col>
                    <Col xs={4} sm={10} md={2} className="mb-1">
                        <div>Jabatan</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_loan.responsible.position.name}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>No Handphone</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_loan.responsible.phone}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Tanggal Pengajuan</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {format(new Date(detail_loan.created_at), 'dd-MM-yyyy')}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Durasi Peminjaman</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {format(new Date(detail_loan.from), 'dd-MM-yyyy')} - {format(new Date(detail_loan.to), 'dd-MM-yyyy')}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Status</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className={`px-2`}>:</span>
                            <span className={` px-2 py-1 rounded text-white text-black-on-print 
                                ${detail_loan.id_status == 1 ? 'bg-warning' 
                                    : detail_loan.id_status == 4 ? 'bg-danger' 
                                    : "bg-success"}`}>{detail_loan.status_loan.name
                                }</span>
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Tujuan Peminjaman</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_loan.reason}
                        </div>
                    </Col>
                    
                    {detail_loan.id_status == 4 ? (
                        <>
                            <Col xs={4} sm={2} md={2} className="mb-1">
                                <Gap width={0} height={20} />
                                <div>Deskripsi Penolakan</div>
                            </Col>
                            <Col xs={8} sm={10} md={10}>
                                <Gap width={0} height={20} />
                                <div>
                                    <span className={`px-2`}>:</span>
                                    {detail_loan.reason_reject ? detail_loan.reason_reject : "-"}
                                </div>
                            </Col>
                        </>
                    ) : detail_loan.id_status == 3 ? (
                        <>
                        <Col xs={4} sm={2} md={2} className="mb-1">
                            <Gap width={0} height={20} />
                            <div>Disetujui Oleh</div>
                        </Col>
                        <Col xs={8} sm={10} md={10}>
                            <Gap width={0} height={20} />
                            <div>
                                <span className={`px-2`}>:</span>
                                {detail_loan.approval ? detail_loan.approval.name : "-"}
                            </div>
                        </Col>
                    </>
                    ) : ""}

                    <Col className='d-flex my-3 align-self-end'>
                        <Row className='w-100'>
                            {detail_loan.id_status < 2 ? (
                                <Col sm={12} md={12} lg={4}>
                                    <Gap width={0} height={30} />
                                    <Button 
                                        label="Update Peminjaman"
                                        variant="success"
                                        size="md"
                                        customClass="hide_on_print"
                                        fullwidth
                                        onClick={() => redirectToUpdate(detail_loan.id, detail_loan.detail)}
                                    />
                                </Col>
                            ) : null}
                            {profile.id_position <= 2 && detail_loan.id_status == 1 ? (
                                <Col sm={12} md={12} lg={4}>
                                    <Gap width={10} height={30} />
                                    <Button 
                                        label="Diprosess"
                                        variant="dark"
                                        size="md"
                                        fullwidth
                                        customClass="hide_on_print"
                                        onClick={() => {
                                            setFieldValue('id_status', 2);
                                            handleShowModal();
                                        }}
                                    />
                                    {/* <Button 
                                        label="Ditolak"
                                        variant="danger"
                                        size="md"
                                        fullwidth
                                        customClass="hide_on_print"
                                        onClick={() => {
                                            setFieldValue('id_status', 4);
                                            handleShowModal();
                                        }}
                                    /> */}
                                </Col>
                            ) : profile.id_position <= 2 && detail_loan.id_status == 2 && detail_loan.total_loan == detail_loan.total_received ? (
                                <Col sm={12} md={12} lg={4}>
                                    <Gap width={10} height={30} />
                                    <Button 
                                        label="Selesai"
                                        variant="dark"
                                        size="md"
                                        fullwidth
                                        customClass="hide_on_print"
                                        onClick={() => {
                                            setFieldValue('id_status', 5);
                                            handleShowModal();
                                        }}
                                    />
                                </Col>
                            ) : null}
                            {profile.id_position <= 2 && detail_loan.id_status == 1 ? (
                                <Col sm={12} md={12} lg={4}>
                                    <Gap width={10} height={30} />
                                    <Button 
                                        label="Ditolak"
                                        variant="danger"
                                        size="md"
                                        fullwidth
                                        customClass="hide_on_print"
                                        onClick={() => {
                                            setFieldValue('id_status', 4);
                                            handleShowModal();
                                        }}
                                    />
                                </Col>
                            ) : null}
                            <Col sm={12} md={12} lg={4} className="align-self-end">
                                <Gap width={10} height={30} />
                                <Button 
                                    label="Print"
                                    variant="dark"
                                    size="md"
                                    fullwidth
                                    customClass="hide_on_print"
                                    onClick={() => {
                                        window.print();
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            }
            <Gap width={0} height={20} />
            <Table bordered responsive >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama Barang</th>
                        <th>Lokasi Aset</th>
                        <th>Lokasi Saat Ini</th>
                        <th>Dipinjam</th>
                        <th>Dikembalikan</th>
                        <th className='hide_on_print'>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {detail_loan && detail_loan.detail && detail_loan.detail.map((detail, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{detail.asset.name}</td>
                                <td>{detail.asset.location}</td>
                                <td>{detail.location_now.name}</td>
                                <td>{detail.quantity}</td>
                                <td>{detail.quantity_received}</td>
                                <td className='hide_on_print'>
                                    {detail_loan.id_status == 2 && detail.quantity_received < detail.quantity ? (
                                        <Button
                                            label={<FontAwesomeIcon icon={faEdit} />}
                                            variant="success"
                                            onClick={() => {
                                                handleShowModalDetail();
                                                setMaxQuantity(detail.quantity);
                                                setIdDetail(detail.id);
                                            }}
                                        />
                                    ) : null}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Gap width={0} height={30} />
            <Row>
                {detail_loan.image_report ?
                    <Col sm={6}>
                        <h5>Sebelum</h5>
                        <img src={process.env.REACT_APP_BASE_URL + detail_loan.image_report.image_before} width='100%' />
                    </Col>
                : null}
                {detail_loan.image_report ?
                    detail_loan.image_report.image_after ? 
                        <Col sm={6}>
                            <h5>Sesudah</h5>
                            <img src={process.env.REACT_APP_BASE_URL + detail_loan.image_report.image_after} width='100%' />
                        </Col>
                    : null
                : null}
            </Row>
            <Gap width={0} height={30} />
            <Modal
                show={showModal}
                size="md"
                title={`Peminjaman ${values.id_status == 2 ? 'Diproses' : values.id_status == 4 ? 'Ditolak' : values.id_status == 5 ? 'Selesai' : null }`}
                handleClose={handleShowModal}
                body={
                    <div>
                        {/* <Form>
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue=""
                                onChange={(e) => {
                                    setFieldValue("id_status", e.target.value);
                                }}
                            >
                                <option value="" disabled>Pilih Status</option>;
                                {all_term_detail.map((term_detail, index) => {
                                    return (
                                        term_detail.key != 3 ? 
                                            <option key={index} value={term_detail.key} >
                                                {term_detail.name}
                                            </option>
                                        : null
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        {touched.id_status && errors.id_status && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.id_status}
                        </span>
                        )} */}
                        <Gap width={0} height={20} />
                        {values.id_status == 4 ? 
                            <>
                                <Input 
                                    label="Alasan Penolakan"
                                    autofocus
                                    required
                                    type="text"
                                    value={values.reason_reject}
                                    onChange={(e) => setFieldValue('reason_reject', e.target.value)}
                                />
                                {touched.reason_reject && errors.reason_reject && (
                                    <span className="text-danger" style={{ fontSize: "12px" }}>
                                        {errors.reason_reject}
                                    </span>
                                )}
                            </>
                            : ""
                        }
                        {values.id_status == 2 || values.id_status == 5 ?
                            <>
                                <h5 className='text-center mb-2'>Foto Barang</h5>
                                <div width='100%' className='d-flex justify-content-center'>
                                    <img src={imagePreview} alt="Photo Profile" className="" onClick={handleImageRef} width='50%' height='50%' style={{cursor: 'pointer'}} />
                                    <input type="file" className="d-none" ref={imageRef} onChange={(e) => {handleSelectImage(e)}} />
                                    <Gap width={0} height={10} />
                                </div>
                            </>
                        : null}
                        {values.id_status != 4 && <p className='text-center text-danger'>Maximal 2MB</p>}

                        <Gap width={0} height={20} />
                        <div className='d-grid'>
                            <Button 
                                label="Simpan"
                                variant="success" 
                                size="md"
                                onClick={() => {
                                    values.reason_reject == "" ? 
                                    setFieldValue('reason_reject', '-') 
                                    : setFieldValue('reason_reject', values.reason_reject);
                                    handleSubmit();
                                }} 
                            />
                        </div>
                    </div>
                }
            />

            <Modal
                show={showModalDetail}
                size="md"
                title="Detail Barang"
                handleClose={handleShowModalDetail}
                body={
                    <div>
                        <Gap width={0} height={20} />
                        <Input 
                            label="Barang Diterima"
                            autofocus
                            required
                            type="text"
                            value={quantityReceived}
                            onChange={(e) => setQuantityReceived(e.target.value)}
                        />
                        {isNaN(quantityReceived) ? (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {"Harus Angka"}
                            </span>
                        ) : quantityReceived < 1  ? (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {"Minimum quantity 1"}
                            </span>
                        ) : quantityReceived > maxQuantity  ? (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {"Barang tidak balance"}
                            </span>
                        ) : ""}
                        <Gap width={0} height={20} />
                        <div className='d-grid'>
                            <Button 
                                label="Simpan"
                                variant="success" 
                                size="md"
                                disabled={isNaN(quantityReceived) || quantityReceived < 1 || quantityReceived > maxQuantity ? true : false}
                                onClick={() => {
                                    handleUpdateQuantity();
                                }} 
                            />
                        </div>
                    </div>
                }
            />
            <Gap width={0} height={50} />
        </div>
    )
}

export default Index