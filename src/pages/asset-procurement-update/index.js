import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { Button, Gap, Input, Modal, Preloader } from '../../components';
import * as action from "../../redux/actions";
import { formatCurrency } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from "formik";
import * as Yup from "yup";

const Index = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    const [totalPrice, setTotalPrice] = useState(0),
    [showModal, setShowModal] = useState(false),
    [indexDetail, setIndexDetail] = useState(0),
    [isDetailChanged, setIsDetailChanged] = useState(false);

    let [data, setData] = useState(location.state.data),
    [name, setName] = useState([]),
    [quantity, setQuantity] = useState([]),
    [price, setPrice] = useState([]),
    [year, setYear] = useState([]),
    [type, setType] = useState([]),
    [locationAsset, setLocationAsset] = useState([]),
    [unit, setUnit] = useState([]),
    [documentRab, setDocumentRab] = useState([]);
    
    const {load_procurement, detail_procurement} = useSelector((state) => state.procurement);
    const { load_asset, list_asset } = useSelector((state) => state.asset);
    const { load_location, all_location } = useSelector((state) => state.location);
    const { load_work_unit, all_work_unit } = useSelector((state) => state.work_unit);
    const { load_term, all_term_detail } = useSelector((state) => state.term);

    const loadData = async() => {
        await dispatch(action.detailProcurement(location.state.id));
        await dispatch(action.listAsset());
        await dispatch(action.getAllLocation());
        await dispatch(action.getAllWorkUnit());
        await dispatch(action.getTermDetail(3));
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleShowModal = async() => {
        showModal ? setShowModal(false) : setShowModal(true);
    }

    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            action: "-",
            name: "-",
            quantity: 0,
            price: 0,
            year: "-",
            type: location.state.jenisAsset,
            typeName: location.state.jenisAsset == 1 ? 'Sarana' : 'Prasarana',
            location: "",
            locationName: "",
            unit: "",
            document_rab: "",
            unitName: "",
            reason: "-",
        },
        onSubmit: async (values) => {
            if(values.action == "edit"){
                handleUpdateDetail();
            }

            if(values.action == "add"){
                handleAddProcurement(
                    values.name, 
                    values.quantity, 
                    values.price, 
                    values.year, 
                    values.type, 
                    values.typeName, 
                    values.location, 
                    values.locationName, 
                    values.unit, 
                    values.unitName, 
                    values.document_rab
                );
            }
            
            if(values.action == "submit"){
                const formData = new FormData();
                let j = 0;
                for(let i = 0; i < data.length; i++){
                    formData.append("id[]", data[i]['id']);
                    formData.append("name[]", data[i]['name']);
                    formData.append("quantity[]", data[i]['quantity']);
                    formData.append("price[]", data[i]['price']);
                    formData.append("year[]", data[i]['year']);
                    formData.append("reason", values.reason);
                    formData.append("id_procurement", location.state.id);

                    if(location.state.jenisAsset == 1){
                        formData.append("document_rab[]", documentRab[j]);
                        j += 1;
                    }

                    if(data[i]['id'] == 0){
                        formData.append("type[]", data[i]['type']);
                        formData.append("location[]", data[i]['location']);
                        formData.append("unit[]", data[i]['unit']);
                    }else{
                        formData.append("type[]", data[i]['type']['key']);
                        formData.append("location[]", data[i]['location']['id']);
                        formData.append("unit[]", data[i]['unit']['id']);
                    }
                }

                let response = await dispatch(action.updateProcurement(formData));
                if(response.status == "success"){
                    history.goBack();
                }
            }
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Tidak boleh kosong!"),
            quantity: Yup.number().typeError('Harus angka').required("Tidak boleh kosong!"),
            price: Yup.number().typeError('Harus angka').required("Tidak boleh kosong!"),
            reason: Yup.string().required("Tidak boleh kosong!"),
            year: Yup.string().required("Tidak boleh kosong!"),
            type: Yup.string().required("Tidak boleh kosong!"),
            typeName: Yup.string().required("Tidak boleh kosong!"),
            location: Yup.string().required("Tidak boleh kosong!"),
            locationName: Yup.string().required("Tidak boleh kosong!"),
            unit: Yup.string().required("Tidak boleh kosong!"),
            unitName: Yup.string().required("Tidak boleh kosong!"),
        }),
    });

    useEffect(() => {
        if(!detail_procurement.isArray){
            if(Object.keys(detail_procurement).length > 5){
                values.reason = detail_procurement.reason;
            }
        }
    }, [detail_procurement]);

    const handleUpdateDetail = () => {
        data[indexDetail]['name'] = values.name;
        data[indexDetail]['quantity'] = values.quantity;
        data[indexDetail]['price'] = values.price;

        name[indexDetail] = values.name;
        quantity[indexDetail] = values.quantity;
        price[indexDetail] = values.price;
        setIsDetailChanged(true);
        handleReset();
        handleShowModal();
    }

    const handleRemove = (index, item) => {
        if(data.includes(item)){
            var filteredData = data.filter(function(e) { return e !== item });
            let total = 0;
            filteredData.map((tmpData, index) => {
                total += tmpData.price * tmpData.quantity;
            });
            setTotalPrice(total);
            setData(filteredData);
        }

        let tmpArrName = [];
        for(let i = 0; i < name.length; i++){
            if(i != index){
                tmpArrName.push(name[i]);
            }
        }
        setName(tmpArrName);
        
        let tmpArrQuantity = [];
        for(let i = 0; i < quantity.length; i++){
            if(i != index){
                tmpArrQuantity.push(quantity[i]);
            }
        }
        setQuantity(tmpArrQuantity);

        let tmpArrPrice = [];
        for(let i = 0; i < price.length; i++){
            if(i != index){
                tmpArrPrice.push(price[i]);
            }
        }
        setPrice(tmpArrPrice);
        setIsDetailChanged(false);
    }

    const handleAddProcurement = (nameParam, quantityParam, priceParam, yearParam, typeId, typeName, locationId, locationName, unitId, unitName, ducument_rab) => {
        setFieldValue("action", "add");

        data.push({
            "id" : 0,
            "name" : nameParam,
            "quantity" : quantityParam,
            "price" : priceParam,
            "year" : yearParam,
            "type" : typeId,
            "typeName" : typeName,
            "location" : locationId,
            "locationName" : locationName,
            "unit" : unitId,
            "unitName" : unitName,
        });

        setTotalPrice(totalPrice + (Number(quantityParam) * Number(priceParam)));

        name.push(nameParam);
        quantity.push(quantityParam);
        price.push(priceParam);
        documentRab.push(ducument_rab);
        handleShowModal();
        // handleReset();
        setIsDetailChanged(false);
    }

    useEffect(() => {
        if(data.length > 0){
            let total = 0;
            data.map((tmpData) => {
                total += tmpData.price * tmpData.quantity;
            });
            setTotalPrice(total);
        }
        setIsDetailChanged(false);
    }, [data, isDetailChanged]);

    useEffect(() => {
        if(all_location.length > 0){
            setFieldValue('location', all_location[0].id);
            setFieldValue('locationName', all_location[0].name);
        }

        if(all_work_unit.length > 0){
            setFieldValue('unit', all_work_unit[0].id);
            setFieldValue('unitName', all_work_unit[0].name);
        }
    }, [all_location, all_work_unit, all_term_detail]);

    return load_procurement && load_asset && load_location && load_work_unit && load_term ? (
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
            <Gap width={0} height={30} />
            {detail_procurement.responsible && detail_procurement.status_procurement && 
                <Row>
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Pengadaan </div>
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
                    <Col xs={4} sm={2} md={2} className="mb-1">
                        <div>Status</div>
                    </Col>
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className={`px-2`}>:</span>
                            <span className={` p-2 rounded text-white ${detail_procurement.id_status == 1 ? 'bg-warning' : detail_procurement.id_status == 2 ? 'bg-success' : "bg-dark"}`}>{detail_procurement.status_procurement.name}</span>
                        </div>
                    </Col>
                </Row>
            }

            <Gap width={0} height={30} />
            <Table bordered responsive >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Jenis</th>
                        <th>Lokasi</th>
                        <th>Unit Kerja</th>
                        <th>Jumlah</th>
                        <th>Harga Satuan</th>
                        <th>Total</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {detail_procurement && detail_procurement.detail && data.map((detail, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{detail.name}</td>
                                {detail.id == 0 ?(
                                    <>
                                        <td>{detail.typeName}</td>
                                        <td>{detail.locationName}</td>
                                        <td>{detail.unitName}</td>
                                    </>
                                ) : (
                                    <>
                                        <td>{detail.type.name}</td>
                                        <td>{detail.location.name}</td>
                                        <td>{detail.unit.name}</td>
                                    </>
                                )}
                                <td>{detail.quantity}</td>
                                <td>{formatCurrency(detail.price)}</td>
                                <td>{formatCurrency(Number(detail.quantity) * Number(detail.price))}</td>
                                <td className='d-flex gap-2'>
                                    {/* <Button 
                                        label={<FontAwesomeIcon icon={faEdit} />}
                                        variant="success"
                                        onClick={() => {
                                            setFieldValue('action', "edit");
                                            setFieldValue('name', detail.name);
                                            setFieldValue('quantity', detail.quantity);
                                            setFieldValue('price', detail.price);
                                            setFieldValue('year', detail.year);
                                            setFieldValue('type', detail.type.key);
                                            setFieldValue('location', detail.location.id);
                                            setFieldValue('unit', detail.unit.id);
                                            
                                            setIndexDetail(index);
                                            handleShowModal();
                                        }}
                                    /> */}
                                    <Button 
                                        label={<FontAwesomeIcon icon={faTrashAlt} />}
                                        onClick={() => handleRemove(index, detail)}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                    <tr className='fw-bold'>
                        <td colSpan={7} className="text-end">Total</td>
                        <td>{formatCurrency(totalPrice)}</td>
                    </tr>
                    {data.length > 0 ? (
                        <tr>
                            <td colSpan={9}>
                                <Gap width={0} height={20} />
                                <Input 
                                    label="Alasan Pengajuan"
                                    autofocus
                                    required
                                    type="text"
                                    value={values.reason}
                                    onChange={(e) => setFieldValue('reason', e.target.value)}
                                />
                                {touched.reason && errors.reason && (
                                    <span className="text-danger" style={{ fontSize: "12px" }}>
                                        {errors.reason}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ) : ""}
                    {data.length > 0 ? (
                        <tr>
                            <td colSpan={9}>
                                <div className='d-grid'>
                                    <Button 
                                        label="Simpan Perubahan"
                                        size="md"
                                        onClick={() => {
                                            handleSubmit();
                                            setFieldValue("action", "submit");
                                        }} 
                                    />
                                </div>
                            </td>
                        </tr>
                    ) : "" }
                </tbody>
            </Table>

            <Modal 
                show={showModal} 
                handleClose={handleShowModal}
                title={`Pengadaan Asset (${location.state.jenisAsset == 1 ? 'Sarana' : 'Prasarana'})`}
                size="lg"
                body={
                    <div>
                        <Input
                            label="Nama Aset"
                            autofocus
                            required
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
                        <Gap width={0} height={20} />
                        <Input
                            label="Jumlah Barang"
                            autofocus
                            required
                            type="text"
                            onChange={(e) => {
                                setFieldValue("quantity", e.target.value);
                            }}
                            value={values.quantity}
                        />
                        {touched.quantity && errors.quantity && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.quantity}
                            </span>
                        )}
                        <Gap width={0} height={20} />
                        <Input
                            label="Harga Satuan"
                            autofocus
                            required
                            type="text"
                            onChange={(e) => {
                                setFieldValue("price", e.target.value);
                            }}
                            value={values.price}
                        />
                        {touched.price && errors.price && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.price}
                            </span>
                        )}
                        <Gap width={0} height={20} />

                        <Input 
                            label="Tahun Pembuatan"
                            autofocus
                            required
                            type="text"
                            value={values.year}
                            onChange={(e) => setFieldValue('year', e.target.value)}
                        />
                        {touched.year && errors.year && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.year}
                            </span>
                        )}
                        <Gap width={0} height={20} />

                        <Form>
                            <Form.Label>Lokasi Barang<span className='text-danger px-1'>*</span></Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue=""
                                onChange={(e) => {
                                    setFieldValue("location", e.target.value);
                                    var index = e.nativeEvent.target.selectedIndex;
                                    let text = e.nativeEvent.target[index].text
                                    setFieldValue('locationName', text);
                                }}
                            >
                                {all_location.map((location, index) => {
                                    return (
                                        <option key={index} value={location.id}>{location.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        {touched.location && errors.location && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.location}
                            </span>
                        )}
                        <Gap width={0} height={20} />

                        <Form>
                            <Form.Label>Satuan Kerja<span className='text-danger px-1'>*</span></Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue=""
                                onChange={(e) => {
                                    setFieldValue("unit", e.target.value);
                                    var index = e.nativeEvent.target.selectedIndex;
                                    let text = e.nativeEvent.target[index].text
                                    setFieldValue('unitName', text);
                                }}
                            >
                                {all_work_unit.map((unit, index) => {
                                    return (
                                        <option key={index} value={unit.id}>{unit.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        {touched.unit && errors.unit && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.unit}
                            </span>
                        )}
                        <Gap width={0} height={20} />

                        {location.state.jenisAsset == 1 &&
                        <>
                            <Input 
                                label="Dokumen RAB"
                                autofocus
                                required
                                type="file"
                                onChange={(e) => setFieldValue('document_rab', e.target.files[0])}
                            />
                            <span className="text-danger" style={{ fontSize: "12px" }}>Maximal 2MB</span>
                            <Gap width={0} height={20} />
                        </>}

                        <Gap width={0} height={20} />
                        
                        {location.state.jenisAsset == 1 ? (
                            <Button
                                label="Simpan"
                                variant="success"
                                fullwidth
                                disabled={values.document_rab == "" ? true : false}
                                size="md"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            />
                        ) : (
                            <Button
                                label="Simpan"
                                variant="success"
                                fullwidth
                                size="md"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            />
                        )}
                    </div>
                }
            />
            <Gap width={0} height={50} />
        </div>
    )
}

export default Index