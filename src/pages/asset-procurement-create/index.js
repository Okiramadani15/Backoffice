import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap'
import { Button, Gap, Input, Modal, Preloader } from '../../components'
import { useFormik } from "formik";
import * as Yup from "yup";
import { formatCurrency, handleCurrency } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as action from "../../redux/actions";
import { format } from 'date-fns';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const Index = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    
    const [showModal, setShowModal] = useState(false),
    [priceAsset, setPriceAsset] = useState(0),
    [totalPrice, setTotalPrice] = useState(0);

    let [data, setData] = useState([]),
    [name, setName] = useState([]),
    [quantity, setQuantity] = useState([]),
    [price, setPrice] = useState([]),
    [year, setYear] = useState([]),
    [type, setType] = useState([]),
    [locationAsset, setLocationAsset] = useState([]),
    [unit, setUnit] = useState([]),
    [documentRab, setDocumentRab] = useState([]);

    const handleShowModal = () => {
        showModal ? setShowModal(false) : setShowModal(true);
    }

    const {load_auth, profile} = useSelector((state) => state.auth);
    const { load_location, all_location } = useSelector((state) => state.location);
    const { load_work_unit, all_work_unit } = useSelector((state) => state.work_unit);
    const { load_term, all_term_detail } = useSelector((state) => state.term);

    const loadData = async() => {
        await dispatch(action.getAllLocation());
        await dispatch(action.getAllWorkUnit());
        await dispatch(action.getTermDetail(3));
    }

    useEffect(() => {
        loadData();
    }, []);

    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            action: "",
            name: "",
            quantity: "",
            price: 0,
            year: "",
            type: location.state.jenisAsset,
            typeName: location.state.jenisAsset == 1 ? 'Sarana' : 'Prasarana',
            location: "",
            locationName: "",
            unit: "",
            unitName: "",
            reason: "-",
            procurement_type: location.state.jenisAsset,
            document_rab: "",
        },
        onSubmit: async (values) => {
            if(values.action == "submit"){
                const formData = new FormData();
                for(let i = 0; i < name.length; i++){
                    formData.append("name[]", name[i]);
                    formData.append("quantity[]", quantity[i]);
                    formData.append("price[]", price[i]);
                    formData.append("year[]", year[i]);
                    formData.append("type[]", type[i]);
                    formData.append("location[]", locationAsset[i]);
                    formData.append("unit[]", unit[i]);
                    if(location.state.jenisAsset == 1){
                        formData.append("document_rab[]", documentRab[i]);
                    }
                    formData.append("reason", values.reason);
                    formData.append("procurement_type", location.state.jenisAsset);
                }
                
                let response = await dispatch(action.createProcurement(formData));
                if(response.status == "success"){
                    history.goBack();
                }
            }else{
                handleAddProcurement(values.name, values.quantity, values.price, values.year, values.type, values.typeName, values.location, values.locationName, values.unit, values.unitName, values.document_rab);
            }
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Tidak boleh kosong!"),
            quantity: Yup.number().typeError('Harus angka').required("Tidak boleh kosong!"),
            price: Yup.number().typeError('Harus angka').required("Tidak boleh kosong!"),
            year: Yup.string().required("Tidak boleh kosong!"),
            type: Yup.string().required("Tidak boleh kosong!"),
            typeName: Yup.string().required("Tidak boleh kosong!"),
            location: Yup.string().required("Tidak boleh kosong!"),
            locationName: Yup.string().required("Tidak boleh kosong!"),
            unit: Yup.string().required("Tidak boleh kosong!"),
            unitName: Yup.string().required("Tidak boleh kosong!"),
            reason: Yup.string().required("Tidak boleh kosong!"),
        }),
    });

    useEffect(() => {
        // if(all_term_detail.length > 0){
        //     setFieldValue('type', all_term_detail[0].key);
        //     setFieldValue('typeName', all_term_detail[0].name);
        // }

        if(all_location.length > 0){
            setFieldValue('location', all_location[0].id);
            setFieldValue('locationName', all_location[0].name);
        }

        if(all_work_unit.length > 0){
            setFieldValue('unit', all_work_unit[0].id);
            setFieldValue('unitName', all_work_unit[0].name);
        }
    }, [all_location, all_work_unit, all_term_detail]);

    const handleAddProcurement = (nameParam, quantityParam, priceParam, yearParam, typeId, typeName, locationId, locationName, unitId, unitName, document_rab) => {
        setFieldValue("action", "add");

        data.push({
            "name" : nameParam,
            "quantity" : quantityParam,
            "price" : priceParam,
            "year" : yearParam,
            "type" : typeName,
            "location" : locationName,
            "unit" : unitName,
            "document_rab" : document_rab,
        });

        setTotalPrice(totalPrice + (Number(quantityParam) * Number(priceParam)));

        name.push(nameParam);
        quantity.push(quantityParam);
        price.push(priceParam);
        year.push(yearParam);
        type.push(typeId);
        locationAsset.push(locationId);
        unit.push(unitId);
        documentRab.push(document_rab);
        
        handleShowModal();
    }

    const handlePrice = (currency) => {
        let tmpPrice = formatCurrency(currency);
        let priceArr = tmpPrice.split(",");
        let price = "";
        for(let i = 0; i < priceArr.length; i++){
            price += priceArr[i];
        }
        setFieldValue('price', price);
        setPriceAsset(formatCurrency(price));
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

        let tmpArrYear = [];
        for(let i = 0; i < year.length; i++){
            if(i != index){
                tmpArrYear.push(year[i]);
            }
        }
        setYear(tmpArrYear);

        let tmpArrType = [];
        for(let i = 0; i < type.length; i++){
            if(i != index){
                tmpArrType.push(type[i]);
            }
        }
        setType(tmpArrType);

        let tmpArrLocation = [];
        for(let i = 0; i < locationAsset.length; i++){
            if(i != index){
                tmpArrLocation.push(locationAsset[i]);
            }
        }
        setLocationAsset(tmpArrLocation);

        let tmpArrUnit = [];
        for(let i = 0; i < unit.length; i++){
            if(i != index){
                tmpArrUnit.push(unit[i]);
            }
        }
        setUnit(tmpArrUnit);

        let tmpDocumentRab = [];
        for(let i = 0; i < documentRab.length; i++){
            if(i != index){
                tmpDocumentRab.push(documentRab[i]);
            }
        }
        setDocumentRab(tmpDocumentRab);
    }

    return load_auth && load_term && load_location && load_work_unit ? (
        <Preloader/>
    ) : (
        <div className='p-4'>
            <Button 
                label="Tambah Barang"
                variant="success" 
                size="md"
                onClick={handleShowModal} 
            />
            <Gap width={0} height={30} />
            <Row>
                <Col xs={4} sm={2} md={2} className="mb-1">
                    <div>Pengadaan</div>
                </Col>
                <Col xs={8} sm={10} md={10}>
                    <div>
                        <span className='px-2'>:</span>
                        {location.state.jenisAsset == 1 ? 'Sarana' : 'Prasarana'}
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
                {profile.position && 
                    <Col xs={8} sm={10} md={10}>
                        <div>
                            <span className='px-2'>:</span>
                            {profile.position.name}
                        </div>
                    </Col>
                }
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
                    {data.map((detail, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{detail.name}</td>
                                <td>{detail.type}</td>
                                <td>{detail.location}</td>
                                <td>{detail.unit}</td>
                                <td>{detail.quantity}</td>
                                <td>{formatCurrency(detail.price)}</td>
                                <td>{formatCurrency(Number(detail.quantity) * Number(detail.price))}</td>
                                <td>
                                    <Button 
                                        label={<FontAwesomeIcon icon={faTrashAlt} />}
                                        onClick={() => handleRemove(index, detail)}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                    <tr className='fw-bold'>
                        <td colSpan={8} className="text-end">Total</td>
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
                                        label="Buat Pengajuan"
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
                size="lg"
                title={`Pengadaan Asset (${values.typeName})`}
                handleClose={handleShowModal}
                body={
                    <div>
                        <Input 
                            label="Nama Aset"
                            autofocus
                            required
                            type="text"
                            value={values.name}
                            onChange={(e) => {
                                setFieldValue('name', e.target.value)
                            }}
                        />
                        {touched.name && errors.name && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.name}
                            </span>
                        )}
                        <Gap width={0} height={20} />

                        <Input 
                            label="Jumlah"
                            autofocus
                            required
                            type="number"
                            value={values.quantity}
                            onChange={(e) => setFieldValue('quantity', e.target.value)}
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
                            value={priceAsset}
                            onChange={(e) => handlePrice(e.target.value)}
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

                        <div className='d-grid'>
                            {location.state.jenisAsset == 2 ? (
                                <Button 
                                    label="Tambah Prasarana"
                                    variant="success" 
                                    size="md"
                                    onClick={() => {
                                        handleSubmit();
                                        setFieldValue("action", "add");
                                    }} 
                                />
                            ) : (
                                <Button 
                                    label="Tambah Sarana"
                                    variant="success" 
                                    size="md"
                                    disabled={values.document_rab == "" ? true : false}
                                    onClick={() => {
                                        handleSubmit();
                                        setFieldValue("action", "add");
                                    }} 
                                />
                            )}
                        </div>
                    </div>
                }
            />
            <Gap width={0} height={50} />
        </div>
    )
}

export default Index