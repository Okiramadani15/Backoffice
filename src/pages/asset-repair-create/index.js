import React, { useEffect, useRef, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { Button, Gap, Input, Modal, Preloader } from '../../components'
import { useFormik } from "formik";
import * as Yup from "yup";
import { formatCurrency, handleCurrency } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as action from "../../redux/actions";
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ReactSelect from 'react-select';
import { AssetDefault } from '../../assets';
import { useLocation } from 'react-router-dom';

const Index = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const imageRef = useRef(null);
    const location = useLocation();

    const [showModal, setShowModal] = useState(false),
    [priceAsset, setPriceAsset] = useState(0),
    [totalPrice, setTotalPrice] = useState(0),
    [selectedAsset, setSelectedAsset] = useState(null),
    [data, setData] = useState([]),
    [maxLoan, setmaxLoan] = useState(0),
    [idAsset, setIdAsset] = useState([]),
    [quantity, setQuantity] = useState([]),
    [price, setPrice] = useState([]),
    [dataLocation, setDataLocation] = useState([]),
    [filterLocation, setFilterLocation] = useState('all');

    const [imagePreview, setImagePreview] = useState(AssetDefault);

    const handleShowModal = () => {
        showModal ? setShowModal(false) : setShowModal(true);
    }

    const { load_auth, profile } = useSelector((state) => state.auth);
    const { load_asset, list_asset } = useSelector((state) => state.asset);
    const { load_location } = useSelector((state) => state.location);

    const loadData = async() => {
        await dispatch(action.getProfile());
        await dispatch(action.listAsset(location.state.typeRepair, filterLocation));
        const res = await dispatch(action.getAllLocation());
        let addCustomFilter = { value: 'all', label: 'Semua' };
        res.data.push(addCustomFilter);
        
        setDataLocation(res.data);
    }

    useEffect(() => {
        loadData();
    }, []);

    const loadListAsset = async() => {
        await dispatch(action.listAsset(location.state.typeRepair, filterLocation));
    }

    useEffect(() => {
        loadListAsset();
    }, [filterLocation]);

    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            action: "",
            asset: "",
            quantity: "",
            price: 0,
            reason: "-",
            photo: "",
        },
        onSubmit: async (values) => {
            if(values.action == "submit"){
                const formData = new FormData();
                formData.append("id_asset[]", idAsset);
                formData.append("quantity[]", quantity);
                formData.append("price[]", price);
                formData.append("type", location.state.typeRepair);
                formData.append("reason", values.reason);
                formData.append("photo", values.photo);
                
                let response = await dispatch(action.createRepair(formData));
                if(response.status == "success"){
                    history.goBack();
                }
            }else{
                handleAddProcurement(values.asset, values.quantity, values.price);
            }
        },
        validationSchema: Yup.object().shape({
            asset: Yup.object().required("Tidak boleh kosong!"),
            quantity: Yup.number().typeError('Harus angka').required("Tidak boleh kosong!"),
            price: Yup.number().typeError('Harus angka').required("Tidak boleh kosong!"),
        }),
    });

    const handleAddProcurement = (assetParam, quantityParam, priceParam) => {
        setFieldValue("action", "add");

        data.push({
            "name" : assetParam.name,
            "id_asset" : assetParam.id,
            "quantity" : quantityParam,
            "price" : priceParam,
        });

        setTotalPrice(totalPrice + (Number(quantityParam) * Number(priceParam)));

        idAsset.push(assetParam.id);
        quantity.push(quantityParam);
        price.push(priceParam);
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

        let tmpArrIdAsset = [];
        for(let i = 0; i < idAsset.length; i++){
            if(i != index){
                tmpArrIdAsset.push(idAsset[i]);
            }
        }
        setIdAsset(tmpArrIdAsset);
        
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

    return load_auth && load_asset && load_location ? (
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
                    <div>Perbaikan</div>
                </Col>
                <Col xs={8} sm={10} md={10}>
                    <div>
                        <span className='px-2'>:</span>
                        {location.state.typeRepair == 1 ? 'Sarana' : 'Prasarana'}
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
                        <th>Nama Barang</th>
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
                        <td colSpan={5} className="text-end">Total</td>
                        <td>{formatCurrency(totalPrice)}</td>
                    </tr>
                    {data.length > 0 ? (
                        <tr>
                            <td colSpan={6}>
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
                            <td colSpan={2}></td>
                            <td colSpan={2}>
                                {location.state.typeRepair != 1 ? (
                                    <div className='d-flex'>
                                        <img src={imagePreview} alt="Dokumen" className="mx-auto" onClick={handleImageRef} style={{cursor: 'pointer'}} width='50%' />
                                        <input type="file" className="d-none" ref={imageRef} onChange={(e) => {handleSelectImage(e)}} />
                                    </div>

                                ) : (
                                    <Input 
                                        label="Dokumen RAB"
                                        autofocus
                                        required
                                        type="file"
                                        ref={imageRef} onChange={(e) => {handleSelectImage(e)}}
                                    />
                                )}
                            </td>
                            <td colSpan={2}></td>
                        </tr>
                    ) : null}
                    {data.length > 0 ? (
                        <tr>
                            <td colSpan={6}>
                                <div className='d-grid'>
                                    <Button 
                                        label="Tambah Perbaikan"
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
                title="Perbaikan barang"
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
                            label="Jumlah Perbaikan"
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
                        {Number(values.quantity) < 1 || Number(values.quantity) > maxLoan ? (
                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                Jumlah perbaikan melebihi jumlah barang
                            </span>
                        ) : ""}
                        <Gap width={0} height={20} />
                        <div className='d-grid'>
                            <Button 
                                label="Tambah"
                                variant="success" 
                                size="md"
                                disabled={values.quantity > values.asset.total || Number(values.quantity) < 1 ? true : false}
                                onClick={() => {
                                    handleSubmit();
                                    setFieldValue("action", "add");
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