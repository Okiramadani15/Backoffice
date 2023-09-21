import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Gap, Input, Modal, Preloader } from '../../components';
import * as action from "../../redux/actions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AssetDefault } from '../../assets';
import { formatCurrency } from '../../utils';

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
    [imagePreview, setImagePreview] = useState(AssetDefault),
    [totalPrice, setTotalPrice] = useState(0),
    [billRepair, setBillRepair] = useState("");

    const { load_repair, detail_repair } = useSelector((state) => state.repair);
    const {load_term, all_term_detail} = useSelector((state) => state.term);
    const {load_auth, profile} = useSelector((state) => state.auth);

    const loadData = async () => {
        await dispatch(action.detailRepair(location.state.id));
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
            const formData = new FormData();
            formData.append('id', values.id);
            formData.append('type', detail_repair.type);
            formData.append('id_status', values.id_status);
            formData.append('reason_reject', values.reason_reject);
            formData.append('photo', values.photo);
            formData.append('bill', billRepair);

            let response = await dispatch(action.changeStatusRepair(formData));
            if(response.status == "success"){
                loadData();
                handleShowModal();
            }

        },
        validationSchema: Yup.object().shape({
            id: Yup.string().required("Tidak boleh kosong!"),
            id_status: Yup.string().required("Tidak boleh kosong!"),
            reason_reject: Yup.string().required("Tidak boleh kosong!"),
        }),
    });

    useEffect(() => {
        let total = 0;
        
        if(!detail_repair.isArray){
            if(Object.keys(detail_repair).length > 5 && Object.keys(detail_repair.responsible).length > 0){
                detail_repair.detail.map((tmpDetail, index) => {
                    total += tmpDetail.price * tmpDetail.quantity;
                });
                setTotalPrice(total);
            }
        }
    }, [detail_repair]);

    const redirectToUpdate = (id, detail) => {
        let tmpData = [];
        let total = 0;
        detail.map((tmpDetail) => {
            let datas = {
                id_asset: tmpDetail.asset.id,
                id_detail_repair: tmpDetail.id,
                name: tmpDetail.asset.name,
                quantity: tmpDetail.quantity,
                price: tmpDetail.price,
            }

            total += tmpDetail.price * tmpDetail.quantity;
            tmpData.push(datas);
        })

        history.push({
            pathname :'/asset/repair/update',
            state: {
                id: id,
                total: total,
                data: tmpData,
            }
        })
    }

    const handleUpdateQuantity = async() => {
        let data = {
            id: idDetail,
            // quantity_received: quantityReceived
        }
        
        // let response = await dispatch(action.updateDetailLoan(data));
        // if(response.status == "success"){
        //     loadData();
        //     handleShowModalDetail();
        // }
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

    return load_repair && load_term && load_auth ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <Gap width={0} height={30} />
            {detail_repair.responsible && detail_repair.status_repair && 
                <Row>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Pengadaan</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_repair.type == 1 ? 'Sarana' : 'Prasarana'}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Penanggung Jawab</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_repair.responsible.name}
                        </div>
                    </Col>
                    <Col xs={4} sm={10} md={2} className="mb-1">
                        <div>Jabatan</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_repair.responsible.position.name}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>No Handphone</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {detail_repair.responsible.phone}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Tanggal Pengajuan</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {format(new Date(detail_repair.created_at), 'dd-MM-yyyy')}
                        </div>
                    </Col>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Status</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className={`px-2`}>:</span>
                            <span className={` px-2 py-1 rounded text-white text-black-on-print 
                                ${detail_repair.id_status == 1 ? 'bg-warning' 
                                    : detail_repair.id_status == 4 ? 'bg-danger' 
                                    : "bg-success"}`}>{detail_repair.status_repair.name
                                }</span>
                        </div>
                    </Col>
                    {detail_repair.id_status == 4 ? (
                        <>
                            <Col xs={4} sm={2} md={2} className="mb-1">
                                <Gap width={0} height={20} />
                                <div>Deskripsi Penolakan</div>
                            </Col>
                            <Col xs={8} sm={10} md={10}>
                                <Gap width={0} height={20} />
                                <div>
                                    <span className={`px-2`}>:</span>
                                    {detail_repair.reason_reject ? detail_repair.reason_reject : "-"}
                                </div>
                            </Col>
                        </>
                    ) : detail_repair.id_status == 3 ? (
                        <>
                        <Col xs={4} sm={2} md={2} className="mb-1">
                            <Gap width={0} height={20} />
                            <div>Disetujui Oleh</div>
                        </Col>
                        <Col xs={8} sm={10} md={10}>
                            <Gap width={0} height={20} />
                            <div>
                                <span className={`px-2`}>:</span>
                                {detail_repair.approval ? detail_repair.approval.name : "-"}
                            </div>
                        </Col>
                    </>
                    ) : ""}

                    <Col className='d-flex my-3 align-self-end'>
                        <Row className='w-100'>
                            {detail_repair.id_status <= 2 ? (
                                <Col sm={12} md={12} lg={4}>
                                    <Gap width={0} height={30} />
                                    <Button 
                                        label="Update Perbaikan"
                                        variant="success"
                                        size="md"
                                        customClass="hide_on_print"
                                        fullwidth
                                        onClick={() => redirectToUpdate(detail_repair.id, detail_repair.detail)}
                                    />
                                </Col>
                            ) : null}
                            {profile.id_position <= 2 && detail_repair.id_status == 1 ? (
                                <Col sm={12} md={12} lg={4}>
                                    <Gap width={10} height={30} />
                                    <Button 
                                        label="Diproses"
                                        variant="dark"
                                        size="md"
                                        fullwidth
                                        customClass="hide_on_print"
                                        onClick={() => {
                                            setFieldValue('id_status', 2);
                                            handleShowModal();
                                        }}
                                    />
                                </Col>
                            ) : null}
                            {profile.id_position <= 2 && detail_repair.id_status == 2 ? (
                                <>
                                    <Col sm={12} md={12} lg={4}>
                                        <Gap width={10} height={30} />
                                        <Button 
                                            label="Disetujui"
                                            variant="dark"
                                            size="md"
                                            fullwidth
                                            customClass="hide_on_print"
                                            onClick={() => {
                                                setFieldValue('id_status', 3);
                                                handleShowModal();
                                            }}
                                        />
                                    </Col>
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
                                </>
                            ) : null}
                            {profile.id_position <= 2 && detail_repair.id_status == 3 ? (
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
                        <th>Kuantitas</th>
                        <th>Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {detail_repair.detail ?
                        detail_repair.detail.map((detail, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{detail.asset.name}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{formatCurrency(detail.price)}</td>
                                </tr>
                            )
                        })
                    : null}
                    <tr className='fw-bold'>
                        <td colSpan={3} className="text-end">Total</td>
                        <td>{formatCurrency(totalPrice)}</td>
                    </tr>
                </tbody>
            </Table>
            <Gap width={0} height={30} />
            {detail_repair.image_report && detail_repair.image_report.bill ? (
                <div className='d-flex gap-3'>
                    <p>Bon (Bukti Pembayaran) : </p>
                    <a href={process.env.REACT_APP_BASE_URL + detail_repair.image_report.bill} className='text-success' target='_blank' download>Lihat Bukti Pembayaran</a>
                </div>
            ) : null}
            
            <Row>
                {detail_repair.image_report ?
                    <Col sm={6}>
                        {detail_repair.type == 1 ? (
                            <a href={process.env.REACT_APP_BASE_URL + detail_repair.image_report.image_before} target='_blank' download>Lihat Dokumen RAB</a>
                        ) : (
                            <>
                                <h5>Sebelum</h5>
                                <img src={process.env.REACT_APP_BASE_URL + detail_repair.image_report.image_before} width='100%' />
                            </>
                        )}
                    </Col>
                : null}
                {detail_repair.image_report ?
                    detail_repair.image_report.image_after ? 
                        <Col sm={6}>
                            <h5>Sesudah</h5>
                            <img src={process.env.REACT_APP_BASE_URL + detail_repair.image_report.image_after} width='100%' />
                        </Col>
                    : null
                : null}
            </Row>
            <Gap width={0} height={30} />
            <Modal
                show={showModal}
                size="md"
                title={`Perbaikan ${values.id_status == 2 ? 'Diproses' : values.id_status == 3 ? 'Disetujui' : values.id_status == 4 ? 'Ditolak' : 'Selesai'} `}
                handleClose={handleShowModal}
                body={
                    <div>
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
                        {values.id_status == 5 ?
                            <>
                                <div width='100%' className='d-flex justify-content-center mb-4'>
                                    <img src={imagePreview} alt="Photo Profile" className="" onClick={handleImageRef} width='50%' height='50%' style={{cursor: 'pointer'}} />
                                    <input type="file" className="d-none" ref={imageRef} onChange={(e) => {handleSelectImage(e)}} />
                                    <Gap width={0} height={10} />
                                </div>
                                <Input 
                                    label="Bon (Bukti Pembayaran)"
                                    autofocus
                                    required
                                    type="file"
                                    onChange={(e) => setBillRepair(e.target.files[0])}
                                />
                            </>
                        : null}

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