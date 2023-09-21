import { faChevronLeft, faChevronRight, faEdit, faInfo, faQrcode, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { Col, Container, Form, ListGroup, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { AlertConfirm, Button, DialogWrapper, ExportExcel, Gap, Input, Modal, Preloader } from '../../components';

import * as action from "../../redux/actions";
import { ALERT_CONFIRM } from '../../redux/type';

// import QRCode from "react-weblineindia-qrcode-generator";
import Barcode from 'react-barcode';
import { PrintBarcode } from '..';
import "./index.css";
import { useBarcode } from '@createnextapp/react-barcode';
import QRCode from "react-qr-code"
import { Link } from 'react-router-dom';

const BarcodeComp = ({value, text}) => {
    const { inputRef } = useBarcode({
        value: value,
        options: {
            text: text,
            width: 1,
            height: 60,
            fontSize: 15
        }
    });

    return <img ref={inputRef} width='100%' />;
}

const linkStyle = {
    margin: "1rem",
    textDecoration: "none",
    color: 'blue',
  };
  

const Index = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [idDetailAsset, setIdDetailAsset] = useState();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [search, setSearch] = useState("");
    const [listPage, setListPage] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalImport, setShowModalImport] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState("");
    const [barcodeName, setBarcodeName] = useState("");
    const [barcodeText, setBarcodeText] = useState("");
    const [typeAsset, setTypeAsset] = useState("");
    const [locationAsset, setLocationAsset] = useState("All");
    const [workUnit, setWorkUnit] = useState("All");
    const [fileImport, setFileImport] = useState("");
    const [loadImport, setLoadImport] = useState(false);

    const { load_asset, all_asset, export_asset } = useSelector((state) => state.asset);
    const { load_pagination, pagination } = useSelector((state) => state.pagination);
    const { open_confirm } = useSelector((state) => state.alert);
    const {load_auth, profile} = useSelector((state) => state.auth);
    const { load_location, all_location } = useSelector((state) => state.location);
    const { load_work_unit, all_work_unit } = useSelector((state) => state.work_unit);
    const {load_term, all_term_detail} = useSelector((state) => state.term);

    const loadData = async() => {
        await dispatch(action.getAllLocation());
        await dispatch(action.getAllWorkUnit());
        await dispatch(action.getTermDetail(3));
        await dispatch(action.getAllAsset(page, limit, search, typeAsset, locationAsset, workUnit));
    }

    useEffect(() => {
        loadData();
    }, []);

    const loadPagination = async(page) => {
        setPage(page);
        await dispatch(action.getAllAsset(page, limit, search, typeAsset, locationAsset, workUnit));
    }

    useEffect(() => {
        if(!pagination.isArray){
            if(Object.keys(pagination).length > 0){
                setListPage(pagination.list_page);
            }
        }
    }, [pagination]);

    const redirectToUpdate = (idAsset) => {
        window.open(`/asset/update?id=${idAsset}`, "_blank");
    }

    const setAlert = async (id) => {
        setIdDetailAsset(id);
    
        await dispatch({
          type: ALERT_CONFIRM,
          payload: {
            open_confirm: true,
            type: "question",
            message: "Yakin ingin nenghapus data ini ?",
          },
        });
    };

    const addBleaching = async () => {
        // await dispatch(action.deleteAsset(idDetailAsset));
        let data = {
            id: idDetailAsset
        }

        await dispatch(action.createBleaching(data));
        loadData();
    };

    const searchAsset = async(asset) => {
        setSearch(asset);
        await dispatch(action.getAllAsset(1, limit, asset, typeAsset, locationAsset, workUnit));
    }

    const handleSelect = async(select) => {
        setLimit(select);
        await dispatch(action.getAllAsset(1, select, search, typeAsset, locationAsset, workUnit));
    }

    const handleFilter = async() => {
        await dispatch(action.getAllAsset(1, limit, search, typeAsset, locationAsset, workUnit));
    }

    const handleShow = () => {
        showModal ? setShowModal(false) : setShowModal(true);
    }

    const handleShowModalImport = () => {
        showModalImport ? setShowModalImport(false) : setShowModalImport(true);
    }

    const redirectToDetail = (idAsset) => {
        window.open(`/asset/detail?id=${idAsset}`, "_blank");
    }

    const handleSelectImage = (file) => {
        if (file.target.files.length !== 0) {
            setFileImport(file.target.files[0]);
        }
    }

    const handleImportAsset = async() => {
        setLoadImport(true);
        const formData = new FormData();
        formData.append("file", fileImport);
        
        let response = await dispatch(action.importAsset(formData));
        
        if (response.status == "success") {
            setFileImport(null);
            loadData();
            setLoadImport(false);
            setShowModalImport(false);
        }
        setShowModalImport(false);
    }

    return load_asset && load_pagination && load_auth && load_location && load_work_unit && load_term ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <AlertConfirm 
                open={open_confirm} 
                type="question" 
                message="Ajukan Pemutihan Asset, Yakin ?" 
                onConfirm={addBleaching} 
            />
            <Row className='d-flex justify-content-between hide_on_print'>
                <Col sm={12} md={3} lg={2} className="hide_on_print">
                    {profile.id_position == 1 ? (
                        <div className='d-grid hide_on_print'>
                            <Button
                                label="Tambah Aset" 
                                variant="success" 
                                className="hide_on_print"
                                size="md"
                                onClick={() => {
                                    history.push('/asset/create');
                                }} 
                            />
                        </div>
                    ) : null}
                    <Gap width={0} height={20} />
                    <Form className='hide_on_print'>
                        <Form.Control
                            as="select"
                            size='sm'
                            value={limit}
                            onChange={e => {
                                handleSelect(e.target.value);
                            }}
                        >
                            <option value="10" className='text-center'>10</option>
                            <option value="25" className='text-center'>25</option>
                            <option value="50" className='text-center'>50</option>
                            <option value="100" className='text-center'>100</option>
                        </Form.Control>
                    </Form>
                </Col>
                <Col sm={12} md={4} lg={3} className="align-self-end hide_on_print">
                    <Input
                        autofocus
                        placeholder="cari..."
                        type="text"
                        onChange={(e) => {
                            searchAsset(e.target.value);
                        }}
                        value={search}
                    />
                </Col>
                <Col sm={12} className="align-self-end hide_on_print">
                    <Row className='my-3'>
                        <Col>
                            <Form>
                                <Form.Label>Jenis Asset</Form.Label>
                                <Form.Select
                                    aria-label="Default select example"
                                    defaultValue=""
                                    onChange={(e) => {
                                        setTypeAsset(e.target.value);
                                    }}
                                >
                                    <option value="All">Semua</option>
                                    {all_term_detail.map((term_detail, index) => {
                                        return (
                                            <option key={index} value={term_detail.key}>{term_detail.name}</option>
                                        );
                                    })}
                                </Form.Select>
                            </Form>
                        </Col>
                        <Col>
                            <Form>
                                <Form.Label>Lokasi Barang</Form.Label>
                                <Form.Select
                                    aria-label="Default select example"
                                    defaultValue=""
                                    onChange={(e) => {
                                        setLocationAsset(e.target.value);
                                    }}
                                >
                                    <option value="All">Semua</option>
                                    {all_location.map((location, index) => {
                                        return (
                                            <option key={index} value={location.id}>{location.name}</option>
                                        );
                                    })}
                                </Form.Select>
                            </Form>
                        </Col>
                        <Col>
                            <Form>
                                <Form.Label>Satuan Kerja</Form.Label>
                                <Form.Select
                                    aria-label="Default select example"
                                    defaultValue=""
                                    onChange={(e) => {
                                        setWorkUnit(e.target.value);
                                    }}
                                >
                                    <option value="All">Semua</option>
                                    {all_work_unit.map((unit, index) => {
                                        return (
                                            <option key={index} value={unit.id}>{unit.name}</option>
                                        );
                                    })}
                                </Form.Select>
                            </Form>
                        </Col>
                        <Col className='mt-auto'>
                            <div className='d-grid'>
                                <Button 
                                    label="Filter" 
                                    variant="dark" 
                                    size="md"
                                    onClick={() => {
                                        handleFilter();
                                    }} 
                                />
                            </div>
                            <div className='d-grid my-1'>
                                <Button 
                                    label={loadImport ? "Loading..." : "Import Asset" }
                                    variant="dark" 
                                    size="md"
                                    disabled={loadImport ? true : false}
                                    onClick={() => {
                                        handleShowModalImport();
                                    }} 
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Gap width={0} height={20} />
            <Table striped bordered responsive className='hide_on_print'>
                <thead>
                    <tr>
                        <th rowSpan={2}>#</th>
                        <th rowSpan={2}>Nama</th>
                        <th rowSpan={2}>Merk / Model</th>
                        <th rowSpan={2}>No Seri Pabrik</th>
                        <th rowSpan={2}>Tahun Pembuatan / Pembelian</th>
                        <th rowSpan={2}>Jumlah</th>
                        <th rowSpan={2}>Lokasi</th>
                        <th rowSpan={2}>Dipinjam</th>
                        <th colSpan={3} className="text-center">Keadaan Barang</th>
                        {profile.id_position == 1 ? ( <th rowSpan={2}>Aksi</th> ) : null}
                    </tr>
                    <tr>
                        <td className='p-2 border fw-bold'>Baik (B)</td>
                        <td className='p-2 border fw-bold'>Kurang Baik (KB)</td>
                        <td className='p-2 border fw-bold'>Rusak Berat (RB)</td>
                    </tr>
                </thead>
                <tbody>
                    {all_asset.length > 0 ? (
                        all_asset.map((asset, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{asset.name}</td>
                                    <td>{asset.merk}</td>
                                    <td>{asset.serial_number}</td>
                                    <td>{asset.date_of_purchase}</td>
                                    <td>{asset.total}</td>
                                    <td>{asset.location.name}</td>
                                    <td>{asset.quantity_loan}</td>
                                    <td className='border-right border-light'>{asset.condition_good}</td>
                                    <td>{asset.condition_not_good}</td>
                                    <td>{asset.condition_very_bad}</td>
                                    {profile.id_position <= 2 ? (
                                        <td className='d-flex gap-2'>
                                            <>
                                                <Button 
                                                    label={<FontAwesomeIcon 
                                                    icon={faInfo} className='p-1' />} 
                                                    variant="dark" 
                                                    onClick={() => redirectToDetail(asset.id)} 
                                                />
                                                <Button 
                                                    label={<FontAwesomeIcon 
                                                    icon={faEdit} />} 
                                                    variant="success" 
                                                    onClick={() => redirectToUpdate(asset.id)} 
                                                />
                                                <Button 
                                                    label={<FontAwesomeIcon 
                                                    icon={faTrashAlt} />} 
                                                    variant="danger" 
                                                    onClick={() => setAlert(asset.id)} 
                                                />
                                                <Button 
                                                    label={<FontAwesomeIcon icon={faQrcode} />} 
                                                    onClick={() => {
                                                        handleShow();
                                                        setBarcodeValue(process.env.REACT_APP_BASE_URL + '/asset/' + asset.id);
                                                        setBarcodeText(asset.asset_code);
                                                        setBarcodeName(asset.name);
                                                    }}
                                                />
                                            </>
                                        </td>
                                    ): null}
                                </tr>
                            )
                        })
                    )   : (
                        <tr>
                            <td colSpan={13} className="text-center">Data tidak ditemukan</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Gap width={0} height={10} />
            {pagination && 
            <ListGroup className='d-flex flex-row flex-wrap justify-content-center hide_on_print'>
                {all_asset.length > 0 && listPage.map((list, index) => {
                    return (
                        <ListGroup.Item 
                            key={index}
                            onClick={() => loadPagination(list.page)}
                            className={`cursor-pointer hide_on_print ${list.active == true ? "active" : ""}`}
                            disabled={list.page == "" ? true : false}
                        >
                            {index == 0 ? (
                                <FontAwesomeIcon icon={faChevronLeft} />
                            ) : index == listPage.length - 1 ? (
                                <FontAwesomeIcon icon={faChevronRight} />
                            ) : (
                                list.label
                            )}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>}
            <Gap width={0} height={30} />
            <DialogWrapper
                show={showModal} 
                handleClose={() => handleShow()}
                title="Barcode"
                size='md'
                body={
                    <div className='p-2'>
                        <div className='d-flex flex-column'>
                            <h6 className='text-center h5 fw-bold'>Aset Sarpas Pondok Pesantren Modern Al-Hasyimiyah</h6>
                            <h6 className='text-center'>{barcodeName}</h6>
                            <div className='text-center mb-3'>
                                {/* <BarcodeComp value={barcodeValue} text={barcodeText} /> */}
                                <QRCode
                                    size={256}
                                    style={{ height: "auto", width: "50%" }}
                                    value={barcodeValue}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                            <h6 className='text-center'>{barcodeText}</h6>
                        </div>
                        <div className='hide_on_print'>
                            {/* <Button
                                label="Print"
                                fullwidth
                                size="md"
                                onClick={() => {
                                    // window.print(<Barcode value={barcodeValue} text={barcodeText} />);
                                    // <PrintBarcode name={barcodeName} value={barcodeValue} text={barcodeText} />
                                    history.push({
                                        pathname: 'print-barcode',
                                        state: {
                                            name: barcodeName,
                                            value: barcodeValue,
                                            text: barcodeText
                                        },

                                    });
                                }}
                            /> */}
                            <Link className='bg-dark text-white text-center p-2 rounded' style={{display: 'block'}} to={{pathname: `print-barcode?name=${barcodeName}&value=${barcodeValue}&text=${barcodeText}` }} target='_blank'>
                                Print
                            </Link>
                        </div>
                    </div>
                }
            />

            <DialogWrapper
                show={showModalImport} 
                handleClose={() => handleShowModalImport()}
                title="Import Asset"
                size="md"
                body={
                    <div className='w-100 p-2'>
                        <div className='d-flex justify-content-center p-4'>
                            <Input
                                label="File Import"
                                autofocus
                                placeholder=""
                                type="file"
                                onChange={(e) => {
                                    handleSelectImage(e);
                                }}
                            />
                        </div>
                        <div className='hide_on_print'>
                            <Button
                                label="Import"
                                fullwidth
                                size="md"
                                disabled={fileImport ? false : true}
                                onClick={() => {
                                    handleImportAsset();
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