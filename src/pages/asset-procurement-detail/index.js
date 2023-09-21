import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { AlertConfirm as AlertOnProcess, AlertConfirm as AlertOnApprove, AlertConfirm as AlertOnCompleted, Button, Gap, Input, Modal, Preloader } from '../../components';
import * as action from "../../redux/actions";
import { formatCurrency } from '../../utils';
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnchor, faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ALERT_APPROVE, ALERT_COMPLETED, ALERT_DECLINE, ALERT_PROCESS } from '../../redux/type';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';

const Index = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    const [totalPrice, setTotalPrice] = useState(0),
    [isLoading, setIsLoading] = useState(true),
    [showModal, setShowModal] = useState(false),
    [showModalDetail, setShowModalDetail] = useState(false),
    [showModalDecline, setShowModalDecline] = useState(false),
    [showModalFinishedProcurement, setShowModalFinishedProcurement] = useState(false),
    [idDetail, setIdDetail] = useState(""),
    [quantityReceived, setQuantityReceived] = useState(""),
    [imageProcurement, setImageProcurement] = useState(""),
    [documentProcurement, setDocumentProcurement] = useState(""),
    [idDetailProcurement, setIdDetailProcurement] = useState("");
    
    const {load_procurement, detail_procurement, document_procurement} = useSelector((state) => state.procurement);
    const {load_term, all_term_detail} = useSelector((state) => state.term);
    const {load_auth, profile} = useSelector((state) => state.auth);
    const { open_process, open_approve, open_completed } = useSelector((state) => state.alert);

    const loadData = async() => {
        let detail = await dispatch(action.detailProcurement(location.state.id));
        let document = await dispatch(action.documentProcurement(location.state.id));
        let termDetail = await dispatch(action.getTermDetail(1));

        console.log('detail : ', detail);
        console.log('document : ', document);
        console.log('term detail : ', termDetail);
    }

    const handleModalDecline = () => {
        showModalDecline ? setShowModalDecline(false) : setShowModalDecline(true);;
    }

    const handleModalFinishedProcurement = () => {
        showModalFinishedProcurement ? setShowModalFinishedProcurement(false) : setShowModalFinishedProcurement(true);;
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let total = 0;
        setIsLoading(true);
        if(!detail_procurement.isArray){
            if(Object.keys(detail_procurement).length > 5 && Object.keys(detail_procurement.responsible).length > 0){
                detail_procurement.detail.map((tmpDetail, index) => {
                    total += tmpDetail.price * tmpDetail.quantity;
                });
                setTotalPrice(total);
            }
            setIsLoading(false);
        }
    }, [detail_procurement]);

    const handleShowModal = () => {
        showModal ? setShowModal(false) : setShowModal(true);
    }

    const handleShowModalDetail = () => {
        showModalDetail ? setShowModalDetail(false) : setShowModalDetail(true);
    }

    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            id: location.state.id,
            reason_reject: "-",
        },
        onSubmit: async (values) => {
            let response = await dispatch(action.declineProcurement(values));
            if(response.status == "success"){
                loadData();
                handleModalDecline();
            }
        },
        validationSchema: Yup.object().shape({
            id: Yup.string().required("Tidak boleh kosong!"),
            reason_reject: Yup.string().required("Tidak boleh kosong!"),
        }),
    });

    const handleUpdateQuantity = async() => {
        let data = {
            id: idDetail,
            quantity_received: quantityReceived
        }
        let response = await dispatch(action.updateDetailProcurement(data));
        if(response.status == "success"){
            loadData();
            handleShowModalDetail();
        }
    }

    const procurementOnProcess = async() =>{
        let data = {
            id: detail_procurement.id
        }
        let response = await dispatch(action.processProcurement(data));

        if(response.status == "success"){
            loadData();
        }
    }

    const procurementOnApprove = async() =>{
        let data = {
            id: detail_procurement.id
        }
        let response = await dispatch(action.approveProcurement(data));

        if(response.status == "success"){
            loadData();
        }
    }

    const procurementOnCompleted = async() =>{
        let data = {
            id: detail_procurement.id
        }
        let response = await dispatch(action.procurementCompleted(data));

        if(response.status == "success"){
            loadData();
        }
    }

    const finishDetail = async() =>{
        if(imageProcurement != "" && documentProcurement != ""){
            const formData = new FormData();
            formData.append("id", idDetailProcurement);
            formData.append("image", imageProcurement);
            formData.append("document", documentProcurement);
            
            let response = await dispatch(action.finishDetailProcurement(formData));
    
            if(response.status == "success"){
                handleModalFinishedProcurement();
                loadData();
            }
        }
    }

    const setAlert = async (id, type, paramMsg) => {
        setIdDetailProcurement(id);
        
        if(type == "process"){
            await dispatch({
              type: ALERT_PROCESS,
              payload: {
                open_process: true,
                type: "question",
                message: paramMsg,
              },
            });
        }else if(type == "approve"){
            await dispatch({
                type: ALERT_APPROVE,
                payload: {
                  open_approve: true,
                  type: "question",
                  message: paramMsg,
                },
            });
        }else if(type == "decline"){
            await dispatch({
                type: ALERT_DECLINE,
                payload: {
                  open_decline: true,
                  type: "question",
                  message: paramMsg,
                },
            });
        }else if(type == "completed"){
            await dispatch({
                type: ALERT_COMPLETED,
                payload: {
                  open_completed: true,
                  type: "question",
                  message: paramMsg,
                },
            });
        }
    };

    const handleDownload = (url, filename) => {
        axios.get(url, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, filename)
        })
    }

    const redirectToUpdate = (idAsset) => {
        history.push({
            pathname: '/asset/update',
            state: {
                id: idAsset
            }
        });
    }
      
    return load_procurement && load_term && detail_procurement.detail ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <AlertOnProcess 
                open={open_process} 
                type="question" 
                message={"Pengadaan akan diproses, yakin ?"}
                onConfirm={procurementOnProcess}
                typeRedux="process"
            />
            <AlertOnApprove 
                open={open_approve} 
                type="question" 
                message={"Pengadaan disetujui, yakin ?"}
                onConfirm={procurementOnApprove} 
                typeRedux="approve"
            />
            <AlertOnCompleted
                open={open_completed} 
                type="question" 
                message={"Pengadaan selesai, yakin ?"}
                onConfirm={procurementOnCompleted} 
                typeRedux="completed"
            />
            <Gap width={0} height={30} />
            {detail_procurement.responsible && detail_procurement.status_procurement && 
                <Row>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Pengadaan</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_procurement.type == 1 ? 'Sarana' : 'Prasarana'}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Penanggung Jawab</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_procurement.responsible.name}
                        </div>
                    </Col>
                    <Col xs={4} sm={10} md={2} className="mb-1">
                        <div>Jabatan</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_procurement.responsible.position.name}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>No Handphone</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_procurement.responsible.phone}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Tanggal Pengajuan</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {format(new Date(detail_procurement.created_at), 'dd-MM-yyyy')}
                        </div>
                    </Col>
                    {detail_procurement.id_status == 3 || detail_procurement.id_status == 5 ? (
                        <>
                            <Col xs={4} sm={2} md={2} className="mb-1">
                                <Gap width={0} height={20} />
                                <div>Disetujui Oleh</div>
                            </Col>
                            <Col xs={8} sm={10} md={10}>
                                <Gap width={0} height={20} />
                                <div>
                                    <span className={`px-2`}>:</span>
                                    {detail_procurement.approval ? detail_procurement.approval.name : "-"}
                                </div>
                            </Col>
                        </>
                    ) : ""}
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Status</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className={`px-2`}>:</span>
                            <span className={`px-2 py-1 rounded text-white text-black-on-print ${detail_procurement.id_status == 1 ? 'bg-warning' : detail_procurement.id_status == 4 ? 'bg-danger' : "bg-success"}`}>{detail_procurement.status_procurement.name}</span>
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Alasan Pengajuan</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_procurement.reason}
                        </div>
                    </Col>
                    {detail_procurement.id_status == 4 ? (
                        <>
                            <Col xs={4} sm={2} md={2} className="mb-1">
                                <Gap width={0} height={20} />
                                <div>Deskripsi Penolakan</div>
                            </Col>
                            <Col xs={8} sm={10} md={10}>
                                <Gap width={0} height={20} />
                                <div>
                                    <span className={`px-2`}>:</span>
                                    {detail_procurement.reason_reject ? detail_procurement.reason_reject : "-"}
                                </div>
                            </Col>
                        </>
                    ) : ""}

                    <Col className='d-flex my-3 align-self-end'>
                        <Row className='w-100'>
                            {detail_procurement.id_status <= 2 && profile.id_position != 3 ? (
                                <Col sm={12} md={12} lg={4}>
                                    <Gap width={0} height={30} />
                                    <Button 
                                        label="Ubah Pengajuan"
                                        variant="success"
                                        size="md"
                                        customClass="hide_on_print"
                                        fullwidth
                                        onClick={() => history.push({
                                            pathname :'/asset/procurement/update',
                                            state: {
                                                id: detail_procurement.id,
                                                data: detail_procurement.detail,
                                                jenisAsset: detail_procurement.type,
                                            }
                                        })}
                                    />
                                </Col>
                            ) : (
                                <Col sm={12} md={12} lg={4} className="align-self-start">
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
                            )}
                            {detail_procurement.id_status < 4 && profile.id_position <= 2 ? (
                                <>
                                    {detail_procurement.id_status == 1 || detail_procurement.id_status == 2 ? (
                                        <Col sm={12} md={12} lg={4}>
                                            <Gap width={10} height={30} />
                                            {detail_procurement.id_status == 1 ? (
                                                <Button 
                                                    label="Diproses"
                                                    variant="dark"
                                                    size="md"
                                                    fullwidth
                                                    customClass="hide_on_print"
                                                    onClick={() => {
                                                        setAlert(location.state.id, "process", "Pengadaan akan di proses, Yakin ?");
                                                    }}
                                                />
                                            ) : null}
                                            {detail_procurement.id_status == 2 && profile.id_position == 1 ? (
                                                <Button 
                                                    label="Disetujui"
                                                    variant="dark"
                                                    size="md"
                                                    fullwidth
                                                    customClass="hide_on_print"
                                                    onClick={() => {
                                                        setAlert(location.state.id, "approve", "Pengadaan disetujui, Yakin ?");
                                                    }}
                                                />
                                            ) : null}
                                        </Col>
                                    ) : null}
                                    <Col sm={12} md={12} lg={4}>
                                        <Gap width={10} height={30} />
                                        {detail_procurement.id_status == 2 && profile.id_position == 1 ? (
                                            <Button 
                                                label="Ditolak"
                                                variant="danger"
                                                size="md"
                                                fullwidth
                                                customClass="hide_on_print"
                                                onClick={() => {
                                                    handleModalDecline();
                                                }}
                                            />
                                        ) : null}
                                        {detail_procurement.total_procurement == detail_procurement.total_received && detail_procurement.is_complete ? (
                                            <Button 
                                                label="Selesai"
                                                variant="success"
                                                size="md"
                                                fullwidth
                                                customClass="hide_on_print"
                                                onClick={() => {
                                                    setAlert(location.state.id, "completed", "Pengadaan selesai, Yakin ?");
                                                }}
                                            />
                                        ) : null}
                                    </Col>
                                </>
                            ) : null}
                            {/* {detail_procurement.id_status > 2 ? (
                                <Col sm={12} md={12} lg={4} className="align-self-start">
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
                            ) : null} */}
                        </Row>
                    </Col>
                </Row>
            }

            <Gap width={0} height={30} />
            <h4>Daftar Pengadaan</h4>
            <Table bordered responsive >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Jenis</th>
                        <th>Lokasi</th>
                        <th>Unit Kerja</th>
                        {detail_procurement.type == 1 &&
                        <th>Dokumen Rab</th>}
                        <th>Jumlah</th>
                        <th>Diterima</th>
                        <th>Harga Satuan</th>
                        <th>Total</th>
                        <th className='hide_on_print'>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {detail_procurement && detail_procurement.detail && detail_procurement.detail.map((detail, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{detail.name}</td>
                                <td>{detail.type.name}</td>
                                <td>{detail.location.name}</td>
                                <td>{detail.unit.name}</td>
                                {detail_procurement.type == 1 && <td>
                                    <a href={process.env.REACT_APP_BASE_URL + detail.document_rab} onClick={() => handleDownload(process.env.REACT_APP_BASE_URL + detail.document_rab, `Dokumen RAB ${detail.name}`)} target='_blank'>Lihat Dokumen</a>
                                </td>}
                                <td>{detail.quantity}</td>
                                <td>{detail.quantity_received}</td>
                                <td>{formatCurrency(detail.price)}</td>
                                <td>{formatCurrency(Number(detail.quantity) * Number(detail.price))}</td>
                                <td className='hide_on_print'>
                                    {detail.quantity_received < detail.quantity && detail_procurement.id_status == 3 && profile.id_position <= 2 ? (
                                        <Button
                                            label={<FontAwesomeIcon icon={faEdit} />}
                                            variant="success"
                                            onClick={() => {
                                                handleShowModalDetail();
                                                setIdDetail(detail.id);
                                            }}
                                        />
                                    ) : detail.quantity_received == detail.quantity && detail_procurement.id_status == 3 && detail.id_status != 3 && profile.id_position <= 2 ? (
                                        <Button
                                            label={<FontAwesomeIcon icon={faCheck} />}
                                            variant="primary"
                                            onClick={() => {
                                                setIdDetailProcurement(detail.id);
                                                handleModalFinishedProcurement();
                                            }}
                                        />
                                    ) : null}

                                    {detail.quantity_received == detail.quantity && detail_procurement.id_status == 5 && detail.id_status == 3 && profile.id_position <= 2 ? (
                                        <Button 
                                            label={<FontAwesomeIcon 
                                            icon={faArrowAltCircleRight} />} 
                                            variant="success" 
                                            onClick={() => redirectToUpdate(detail.id_asset)} 
                                        />
                                    ) : null}
                                </td>
                            </tr>
                        )
                    })}
                    <tr className='fw-bold'>
                        <td colSpan={8} className="text-end">Total</td>
                        <td>{formatCurrency(totalPrice)}</td>
                    </tr>
                </tbody>
            </Table>
            
            {document_procurement.length > 0 ? (
                <div className='hide_on_print'>
                    <h4>Dokumen</h4>
                    <Table>
                        <thead>
                            <tr>
                                <td>No.</td>
                                <td>Nama Barang</td>
                                <td>Photo</td>
                                <td>Bon (Bukti Pembayaran)</td>
                            </tr>
                        </thead>
                        <tbody>
                            {document_procurement.length > 0 ?
                                document_procurement.map((document, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{document.detail.name}</td>
                                        <td>
                                            <a href={process.env.REACT_APP_BASE_URL + document.photo} target='_blank'>Lihat</a>
                                        </td>
                                        <td>
                                            <a href={process.env.REACT_APP_BASE_URL + document.document} target='_blank' onClick={() => handleDownload(process.env.REACT_APP_BASE_URL + document.document, `Bukti Pembayaran ${document.detail.name}`)}>Lihat</a>
                                        </td>
                                    </tr>
                                )
                                })
                            : null}
                        </tbody>
                    </Table>
                </div>
            ) : null}
            <Modal
                show={showModalDecline}
                size="md"
                title="Pengadaan Ditolak"
                handleClose={handleModalDecline}
                body={
                    <div>
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
                        <Gap width={0} height={20} />
                        <div className='d-grid'>
                            <Button 
                                label="Simpan"
                                variant="success" 
                                size="md"
                                onClick={() => {
                                    handleSubmit();
                                }} 
                            />
                        </div>
                    </div>
                }
            />

            <Modal
                show={showModal}
                size="md"
                title="Status Peminjaman"
                handleClose={handleShowModal}
                body={
                    <div>
                        <Form>
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
                                        <option key={index} value={term_detail.key} >
                                            {term_detail.name}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        {touched.id_status && errors.id_status && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.id_status}
                        </span>
                        )}
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
                        ) : quantityReceived.length < 0 ? (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {"Minimum quantity 1"}
                            </span>
                        ) : ""}
                        <Gap width={0} height={20} />
                        <div className='d-grid'>
                            <Button 
                                label="Simpan"
                                variant="success" 
                                size="md"
                                disabled={!isNaN(quantityReceived) && quantityReceived.length > 0 ? false : true}
                                onClick={() => {
                                    handleUpdateQuantity();
                                }} 
                            />
                        </div>
                    </div>
                }
            />

            <Modal
                show={showModalFinishedProcurement}
                size="md"
                title="Upload Bukti Pengadaan"
                handleClose={handleModalFinishedProcurement}
                body={
                    <div>
                        {/* {detail_procurement.type == 2 ? (
                            <> */}
                                <Input 
                                    label="Photo"
                                    autofocus
                                    required
                                    type="file"
                                    onChange={(e) => setImageProcurement(e.target.files[0])}
                                />
                                <span className="text-danger" style={{ fontSize: "12px" }}>Maximal 2MB</span>
                                
                                <Gap width={0} height={20} />
                                <Input 
                                    label="Bon (Bukti Pembayaran)"
                                    autofocus
                                    required
                                    type="file"
                                    onChange={(e) => setDocumentProcurement(e.target.files[0])}
                                />
                                <span className="text-danger" style={{ fontSize: "12px" }}>Maximal 2MB</span>
                            {/* </>
                        ) : (
                            <>
                                <Input 
                                    label="Photo"
                                    autofocus
                                    required
                                    type="file"
                                    onChange={(e) => setImageProcurement(e.target.files[0])}
                                />
                                <span className="text-danger" style={{ fontSize: "12px" }}>Maximal 2MB</span>
                            </>
                        )} */}
                        
                        <Gap width={0} height={20} />
                        <div className='d-grid'>
                            {/* {detail_procurement.type == 1 ? ( */}
                                <Button 
                                    label="Simpan"
                                    disabled={imageProcurement != "" && documentProcurement != "" ? false : true}
                                    variant="success" 
                                    size="md"
                                    onClick={() => {
                                        finishDetail();
                                    }} 
                                />
                            {/* ) : (
                                <Button 
                                    label="Simpan"
                                    disabled={imageProcurement != "" ? false : true}
                                    variant="success" 
                                    size="md"
                                    onClick={() => {
                                        finishDetail();
                                    }} 
                                />
                            )} */}
                        </div>
                    </div>
                }
            />
            <Gap width={0} height={50} />
        </div>
    )
}

export default Index