import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Col, Container, Form, Row } from 'react-bootstrap'
import { AssetDefault } from '../../assets';
import { Button, Gap, Input, Preloader, TextArea } from '../../components';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import * as action from "../../redux/actions";
import { formatCurrency } from '../../utils';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Index = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    const imageRef = useRef();

    const search = window.location.search;
    const params = new URLSearchParams(search);

    const [imagePreview, setImagePreview] = useState(AssetDefault);
    const [priceAsset, setPriceAsset] = useState("");

    const { load_location, all_location } = useSelector((state) => state.location);
    const { load_work_unit, all_work_unit } = useSelector((state) => state.work_unit);
    const { load_asset, detail_asset } = useSelector((state) => state.asset);
    const { load_term, all_term_detail } = useSelector((state) => state.term);
    const { load_code, all_code } = useSelector((state) => state.groupCode);
    const { load_purchase_location, all_purchase_location } = useSelector((state) => state.purchaseLocation);

    const loadData = async() => {
        await dispatch(action.detailAsset(params.get('id')));
        await dispatch(action.getAllLocation());
        await dispatch(action.getAllWorkUnit());
        await dispatch(action.getTermDetail(3));
        await dispatch(action.getAllCode());
        await dispatch(action.getAllPurchaseLocation());
    }

    useEffect(() => {
        loadData();
    }, []);

    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            type: "",
            name: "",
            merk: "",
            serial_number: "",
            size: "",
            material: "",
            date_of_purchase: "",
            code: "",
            group_code: "",
            id_purchase_location: "",
            total: "",
            price: "",
            description: "",
            id_location: "",
            id_work_unit: "",
            photo: "",
            condition_good: "",
            condition_not_good: "",
            condition_very_bad: "",
        },
    
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("type", values.type);
            formData.append("id", params.get('id'));
            formData.append("name", values.name);
            formData.append("merk", values.merk);
            formData.append("serial_number", values.serial_number);
            formData.append("size", values.size);
            formData.append("material", values.material);
            formData.append("date_of_purchase", values.date_of_purchase);
            formData.append("code", values.code);
            formData.append("group_code", values.group_code);
            formData.append("id_purchase_location", values.id_purchase_location);
            formData.append("total", values.total);
            formData.append("price", values.price);
            formData.append("description", values.description);
            formData.append("id_location", values.id_location);
            formData.append("id_work_unit", values.id_work_unit);
            formData.append("condition_good", values.condition_good);
            formData.append("condition_not_good", values.condition_not_good);
            formData.append("condition_very_bad", values.condition_very_bad);
            formData.append("photo", values.photo);
        
            let response = await dispatch(action.updateAsset(formData));
            
            if (response.status == "success") {
                history.goBack();
            }
        },
        validationSchema: Yup.object().shape({
            type: Yup.string().required("Tidak boleh kosong!"),
            name: Yup.string().required("Tidak boleh kosong!"),
            date_of_purchase: Yup.string().required("Tidak boleh kosong!"),
            total: Yup.string().required("Tidak boleh kosong!"),
            price: Yup.string().required("Tidak boleh kosong!"),
            code: Yup.string().required("Tidak boleh kosong!"),
            group_code: Yup.string().required("Tidak boleh kosong!"),
            id_purchase_location: Yup.string().required("Tidak boleh kosong!"),
            id_location: Yup.string().required("Tidak boleh kosong!"),
            id_work_unit: Yup.string().required("Tidak boleh kosong!"),
            condition_good: Yup.number('harung angka').required("Tidak boleh kosong!"),
            condition_not_good: Yup.number('harung angka').required("Tidak boleh kosong!"),
            condition_very_bad: Yup.number('harung angka').required("Tidak boleh kosong!"),
        }),
    });

    useEffect(() => {
        if(!detail_asset.isArray){
            if(Object.keys(detail_asset).length > 0){
                setFieldValue('type', detail_asset.type);
                setFieldValue('name', detail_asset.name);
                setFieldValue('merk', detail_asset.merk);
                setFieldValue('serial_number', detail_asset.serial_number);
                setFieldValue('size', detail_asset.size);
                setFieldValue('material', detail_asset.material);
                setFieldValue('date_of_purchase', detail_asset.date_of_purchase);
                setFieldValue('code', detail_asset.code);
                setFieldValue('group_code', detail_asset.group_code);
                setFieldValue('id_purchase_location', detail_asset.id_purchase_location);
                setFieldValue('total', detail_asset.total);
                setFieldValue('price', formatCurrency(detail_asset.price));
                setFieldValue('description', detail_asset.description);
                setFieldValue('id_location', detail_asset.id_location);
                setFieldValue('id_work_unit', detail_asset.id_work_unit);
                setFieldValue('condition_good', detail_asset.condition_good);
                setFieldValue('condition_not_good', detail_asset.condition_not_good);
                setFieldValue('condition_very_bad', detail_asset.condition_very_bad);
                setImagePreview(process.env.REACT_APP_BASE_URL + detail_asset.photo);
                handlePrice(detail_asset.price);
            }
        }
    }, [detail_asset]);

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

    const handleImageRef = () => {
        imageRef.current.click();
    }
    
    const handleSelectImage = (image) => {
        if (image.target.files.length !== 0) {
            setFieldValue('photo', image.target.files[0]);
            setImagePreview(URL.createObjectURL(image.target.files[0]));
        }
    }

    return load_asset && load_location && load_work_unit && load_code && load_term ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <Row className="d-flex align-items-start">
                <Col className="p-4" lg={4}>
                    <img src={imagePreview} alt="Photo Profile" className="" />
                    <input type="file" className="d-none" ref={imageRef} onChange={(e) => {handleSelectImage(e)}} />
                    <Gap width={0} height={10} />
                    <div className="d-grid">
                        <Button label="Pilih Foto" size="sm" onClick={handleImageRef} />
                    </div>
                </Col>

                <Col className="p-4" lg={8}>
                    <div className='mb-3'>
                        <Form>
                            <Form.Label>Jenis Asset</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue=""
                                onChange={(e) => {
                                    setFieldValue('type', e.target.value);
                                }}
                            >
                                {all_term_detail.map((term_detail, index) => {
                                    return (
                                        <option key={index} value={term_detail.key} selected={values.type == term_detail.key ? true : false}>{term_detail.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        {touched.type && errors.type && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.type}
                            </span>
                        )}
                    </div>
                    <div>
                        <Input
                            label="Nama"
                            autofocus
                            required
                            placeholder=""
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
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                        label="Merk"
                        autofocus
                        placeholder=""
                        type="text"
                        onChange={(e) => {
                            setFieldValue("merk", e.target.value);
                        }}
                        value={values.merk}
                        />
                        {touched.merk && errors.merk && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.merk}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                        label="No Seri Pabrik"
                        autofocus
                        placeholder=""
                        type="text"
                        onChange={(e) => {
                            setFieldValue("serial_number", e.target.value);
                        }}
                        value={values.serial_number}
                        />
                        {touched.serial_number && errors.serial_number && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.serial_number}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                        label="Ukuran"
                        autofocus
                        placeholder=""
                        type="text"
                        onChange={(e) => {
                            setFieldValue("size", e.target.value);
                        }}
                        value={values.size}
                        />
                        {touched.size && errors.size && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.size}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                        label="Bahan"
                        autofocus
                        placeholder=""
                        type="text"
                        onChange={(e) => {
                            setFieldValue("material", e.target.value);
                        }}
                        value={values.material}
                        />
                        {touched.material && errors.material && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.material}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                        label="Tahun Pembuatan / Pembelian"
                        autofocus
                        required
                        placeholder=""
                        type="text"
                        onChange={(e) => {
                            setFieldValue("date_of_purchase", e.target.value);
                        }}
                        value={values.date_of_purchase}
                        />
                        {touched.date_of_purchase && errors.date_of_purchase && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.date_of_purchase}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                        label="No Registrasi"
                        autofocus
                        required
                        placeholder=""
                        type="text"
                        onChange={(e) => {
                            setFieldValue("code", e.target.value);
                        }}
                        value={values.code}
                        />
                        {touched.code && errors.code && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.code}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                            label="Jumlah Barang"
                            autofocus
                            required
                            placeholder=""
                            type="number"
                            min="1"
                            onChange={(e) => {
                                setFieldValue("total", e.target.value);
                            }}
                            value={values.total}
                            />
                            {touched.total && errors.total && (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                {errors.total}
                            </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                            label="Harga Satuan"
                            autofocus
                            required
                            placeholder=""
                            type="text"
                            onChange={(e) => {
                                handlePrice(e.target.value);
                            }}
                            value={priceAsset}
                        />
                        {touched.price && errors.price && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.price}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Form>
                            <Form.Label>Kode Golongan<span className='text-danger px-1'>*</span></Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue={values.group_code}
                                onChange={(e) => {
                                    setFieldValue("group_code", e.target.value);
                                }}
                            >
                                <option value="" disabled>Pilih Kode Golongan</option>
                                {all_code.map((code, index) => {
                                    return (
                                        <option key={index} value={code.id} selected={values.group_code == code.id ? true : false}>{code.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        {touched.group_code && errors.group_code && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.group_code}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Form>
                            <Form.Label>Lokasi Pembelian<span className='text-danger px-1'>*</span></Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue={values.id_purchase_location}
                                onChange={(e) => {
                                    setFieldValue("id_purchase_location", e.target.value);
                                }}
                            >
                                <option value="" disabled>Pilih Lokasi Pembelian</option>
                                {all_code.map((code, index) => {
                                    return (
                                        <option key={index} value={code.id} selected={values.id_purchase_location == code.id ? true : false}>{code.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        {touched.id_purchase_location && errors.id_purchase_location && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.id_purchase_location}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Form>
                            <Form.Label>Lokasi Barang<span className='text-danger px-1'>*</span></Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue=""
                                onChange={(e) => {
                                    setFieldValue("id_location", e.target.value);
                                }}
                            >
                                <option value="" disabled>Pilih Lokasi Barang</option>;
                                {all_location.map((location, index) => {
                                    return (
                                        <option key={index} value={location.id} selected={values.id_location == location.id ? true : false}>{location.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        {touched.id_location && errors.id_location && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.id_location}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Form>
                            <Form.Label>Satuan Kerja<span className='text-danger px-1'>*</span></Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                defaultValue=""
                                onChange={(e) => {
                                    setFieldValue("id_work_unit", e.target.value);
                                }}
                            >
                                <option value="" disabled >Pilih Satuan Kerja</option>;
                                {all_work_unit.map((unit, index) => {
                                    return (
                                        <option key={index} value={unit.id} selected={values.id_work_unit == unit.id ? true : false}>{unit.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form>
                        {touched.id_work_unit && errors.id_work_unit && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.id_work_unit}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                        label="Kondisi Barang Baik (B)"
                        autofocus
                        required
                        placeholder=""
                        type="number"
                        min="0"
                        onChange={(e) => {
                            setFieldValue("condition_good", e.target.value);
                        }}
                        value={values.condition_good}
                        />
                        {touched.condition_good && errors.condition_good && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.condition_good}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                        label="Kondisi Barang Kurang Baik (KB)"
                        autofocus
                        required
                        placeholder=""
                        type="number"
                        min="0"
                        onChange={(e) => {
                            setFieldValue("condition_not_good", e.target.value);
                        }}
                        value={values.condition_not_good}
                        />
                        {touched.condition_not_good && errors.condition_not_good && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.condition_not_good}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <div>
                        <Input
                        label="Kondisi Barang Rusak Berat (RB)"
                        autofocus
                        required
                        placeholder=""
                        type="number"
                        min="0"
                        onChange={(e) => {
                            setFieldValue("condition_very_bad", e.target.value);
                        }}
                        value={values.condition_very_bad}
                        />
                        {touched.condition_very_bad && errors.condition_very_bad && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.condition_very_bad}
                        </span>
                        )}
                    </div>
                    <Gap width={0} height={10} />
                    <TextArea 
                        label="Keterangan Mutasi dll" 
                        placeholder="" 
                        onChange={(e) => setFieldValue('description', e.target.value)} 
                        value={values.description}
                    />

                    <Gap width={0} height={30} />
                    <div className="d-grid">
                        <Button label="Simpan" size="md" onClick={handleSubmit} />
                    </div>
                </Col>
            </Row>
            <Gap width={0} height={50} />
        </div>
    )
}

export default Index