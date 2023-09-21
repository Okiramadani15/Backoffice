import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { Button, Gap, Input, Modal, Preloader } from '../../components';
import * as action from "../../redux/actions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory, useLocation } from 'react-router-dom';

const Index = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const [showModal, setShowModal] = useState(false),
    [selectedAsset, setSelectedAsset] = useState(null),
    [selectedLocation, setSelectedLocation] = useState(null),
    [data, setData] = useState([]),
    [maxLoan, setmaxLoan] = useState(0),
    [dataLocation, setDataLocation] = useState([]),
    [filterLocation, setFilterLocation] = useState('all');


    const {load_auth, profile} = useSelector((state) => state.auth);
    const { load_asset, list_asset } = useSelector((state) => state.asset);
    const { load_location, all_location } = useSelector((state) => state.location);

    const loadData = async() => {
        await dispatch(action.getProfile());
        await dispatch(action.listAsset(location.state.typeLoan, filterLocation));
        const res = await dispatch(action.getAllLocation());
        let addCustomFilter = { value: 'all', label: 'Semua' };
        res.data.push(addCustomFilter);
        
        setDataLocation(res.data);
    }

    useEffect(() => {
        loadData();
    }, []);

    const loadListAsset = async() => {
        await dispatch(action.listAsset(location.state.typeLoan, filterLocation));
    }

    useEffect(() => {
        loadListAsset();
    }, [filterLocation]);

    const handleShowModal = () => {
        showModal ? setShowModal(false) : setShowModal(true);
    }

    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            action: "",
            asset: "",
            location: "",
            quantity: 0,
            reason: '-',
            from: format(Date.now(), 'yyyy-MM-dd'),
            to: format(Date.now(), 'yyyy-MM-dd'),
        },
        onSubmit: async (values) => {
            if(values.action == "add"){
                let datas = {
                    id_asset: values.asset.id,
                    asset_name: values.asset.name,
                    first_location: values.location.name,
                    id_location_now: values.location.id,
                    location_now: values.asset.location,
                    total_asset: values.asset.total,
                    quantity_loan: values.quantity
                }

                data.push(datas);
                handleShowModal();
            }
            
            if(values.action == "submit"){
                let datas = {
                    reason: values.reason,
                    data: data,
                    type: location.state.typeLoan,
                    from: values.from,
                    to: values.to,
                }
                
                let response = await dispatch(action.createLoan(datas));
                if(response.status == "success"){
                    history.goBack();
                }
            }
        },
        validationSchema: Yup.object().shape({
            asset: Yup.object().required("Tidak boleh kosong!"),
            location: Yup.object().required("Tidak boleh kosong!"),
            quantity: Yup.number().typeError('Harus angka').required("Tidak boleh kosong!"),
        }),
    });

    const handleRemove = (index) => {
        if(data.includes(data[index])){
            var filteredData = data.filter(function(e) { return e !== data[index] });
            setData(filteredData);
        }
    }

    return load_asset && load_auth && load_location ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <Button 
                label="Tambah Barang"
                variant="success" 
                size="md"
                onClick={() => {
                    setFieldValue("action", "add");
                    handleShowModal();
                }} 
            />
            <Gap width={0} height={20} /> 
            <Row>
                <Col xs={4} sm={2} md={2} className="mb-1">
                    <div>Peminjaman</div>
                </Col>
                <Col xs={8} sm={10} md={10}>
                    <div>
                        <span className='px-2'>:</span>
                        {location.state.typeLoan == 1 ? 'Sarana' : 'Prasarana'}
                    </div>
                </Col>
                <Col xs={4} sm={2} md={2} className="mb-1">
                    <div>Penanggung Jawab</div>
                </Col>
                <Col xs={8} sm={10} md={10}>
                    <div>
                        <span className='px-2'>:</span>
                        {profile.name}
                    </div>
                </Col>
                <Col xs={4} sm={10} md={2} className="mb-1">
                    <div>Jabatan</div>
                </Col>
                <Col xs={8} sm={10} md={10}>
                    <div>
                        <span className='px-2'>:</span>
                        {profile && profile.position ? profile.position.name : "" }
                    </div>
                </Col>
                <Col xs={4} sm={2} md={2} className="mb-1">
                    <div>No Handphone</div>
                </Col>
                <Col xs={8} sm={10} md={10}>
                    <div>
                        <span className='px-2'>:</span>
                        {profile.phone}
                    </div>
                </Col>
                <Col xs={4} sm={2} md={2} className="mb-1">
                    <div>Tanggal Pengajuan</div>
                </Col>
                <Col xs={8} sm={10} md={10}>
                    <div>
                        <span className='px-2'>:</span>
                        {format(new Date(), 'dd-MM-yyyy')}
                    </div>
                </Col>
            </Row>
            <Gap width={0} height={20} /> 
            <Table striped bordered responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Nama Aset</th>
                    <th>Lokasi Awal Aset</th>
                    <th>Lokasi Peminjaman Aset</th>
                    <th>Jumlah Aset</th>
                    <th>Dipinjam</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((detail, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{detail.asset_name}</td>
                                    <td>{detail.first_location}</td>
                                    <td>{detail.location_now}</td>
                                    <td>{detail.total_asset}</td>
                                    <td>{detail.quantity_loan}</td>
                                    <td>
                                        <Button 
                                            label={<FontAwesomeIcon icon={faTrashAlt} />}
                                            variant="danger"
                                            onClick={() => {
                                                handleRemove(index);
                                            }}
                                        />
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td className='text-center' colSpan={7}>Belum ada data</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {data.length > 0 ? (
                <>
                    <div className='d-flex'>
                        <div className='w-50'>
                            <Input
                                label="Dari"
                                autofocus
                                required
                                type="date"
                                value={values.from}
                                className='w-100'
                                onChange={(e) => {
                                    setFieldValue("from", e.target.value);
                                }}
                            />
                        </div>
                        <div className='w-50'>
                            <Input
                                label="Sampai"
                                autofocus
                                required
                                type="date"
                                value={values.to}
                                className='w-100'
                                onChange={(e) => {
                                    setFieldValue("to", e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className='w-100'>
                        <Input 
                            label="Alasan Peminjaman"
                            autofocus
                            required
                            type="text"
                            value={values.reason}
                            onChange={(e) => setFieldValue('reason', e.target.value)}
                        />
                        <Gap width={0} height={20} />
                        <div className='d-grid'>
                            <Button
                                label="Buat Peminjaman"
                                size="md"
                                onClick={() => {
                                    setFieldValue('action', "submit");
                                    handleSubmit();
                                }}
                            />
                        </div>
                    </div>
                </>
            ) : null}

            <Modal
                show={showModal}
                size="lg"
                title="Data Asset"
                handleClose={handleShowModal}
                body={
                    <div>
                        <div>Pilih Lokasi Asset <span className='text-danger'>*</span></div>
                        <ReactSelect
                            defaultValue={filterLocation}
                            onChange={(e) => {
                                setFilterLocation(e.value);
                            }}
                            options={dataLocation}
                        />
                        <Gap width={0} height={20} />
                        <div>Nama Aset <span className='text-danger'>*</span></div>
                        <ReactSelect
                            defaultValue={selectedAsset}
                            onChange={(e) => {
                                setSelectedAsset(e);
                                setFieldValue('asset', e);
                                setmaxLoan(e.total - e.quantity_loan);
                            }}
                            options={list_asset}
                        />
                        {touched.asset && errors.asset && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.asset}
                            </span>
                        )}
                        <Gap width={0} height={20} />
                        <div>Lokasi Peminjaman <span className='text-danger'>*</span></div>
                        <ReactSelect
                            defaultValue={selectedLocation}
                            onChange={(e) => {
                                setSelectedLocation(e);
                                setFieldValue('location', e);
                            }}
                            options={all_location}
                        />
                        {touched.location && errors.location && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.location}
                            </span>
                        )}
                        <Gap width={0} height={20} />
                        <Input 
                            label="Jumlah Peminjaman"
                            autofocus
                            required
                            type="text"
                            value={values.quantity}
                            onChange={(e) => setFieldValue('quantity', Number(e.target.value))}
                        />
                        {touched.quantity && errors.quantity && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.quantity}
                            </span>
                        )}
                        {Number(values.quantity) > maxLoan ? (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                Jumlah peminjaman melebihi jumlah barang
                            </span>
                        ) : ""}
                        <Gap width={0} height={20} />
                        <div className='d-grid'>
                            <Button 
                                label="Tambah"
                                variant="dark" 
                                size="md"
                                disabled={Number(values.quantity) > maxLoan ? true : false}
                                onClick={() => {
                                    handleSubmit();
                                }} 
                            />
                        </div>
                    </div>
                }
            />
        </div>
    )
}

export default Index