import React, { useEffect } from 'react'
import { Col, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { AlertConfirm, Button, Preloader } from '../../components';
import * as action from "../../redux/actions";
import { ALERT_CONFIRM } from '../../redux/type';
import { formatCurrency } from '../../utils';
import QRCode from "react-qr-code"

const Index = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    const search = window.location.search;
    const params = new URLSearchParams(search);

    const { load_asset, detail_asset } = useSelector((state) => state.asset);
    const { open_confirm } = useSelector((state) => state.alert);

    const loadData = async() => {
        await dispatch(action.detailAsset(params.get('id')));
    }

    useEffect(() => {
        loadData();
    }, []);

    const redirectToUpdate = () => {
        history.push({
            pathname: '/asset/update',
            state: {
                id: detail_asset.id
            }
        });
    }

    const setAlert = async () => {
    
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
        const response = await dispatch(action.deleteAsset(detail_asset.id));
        if(response.status == 'success'){
            history.goBack();
        }
    };

    return load_asset ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <AlertConfirm 
                open={open_confirm} 
                type="question" 
                message="Yakin ingin nenghapus data ini ?" 
                onConfirm={removeData} 
            />
            <Row className='pb-5'>
                <Col sm={3} className='mb-3'>
                    <img src={detail_asset.photo ? process.env.REACT_APP_BASE_URL + detail_asset.photo : process.env.REACT_APP_BASE_URL + '/assets/illustrations/no-image.png'} />
                    <div className="text-center mt-5">
                        <QRCode
                            size={256}
                            style={{ height: "auto", width: "50%" }}
                            value={`${process.env.REACT_APP_BASE_URL}/asset/${params.get('id')}`}
                            viewBox={`0 0 256 256`}
                        />
                        <h6 className='mt-2'>{detail_asset.asset_code}</h6>
                    </div>
                </Col>
                <Col sm={9}>
                    <h4 className='bg-primary text-white m-0 p-2'>Detail Barang</h4>
                    {detail_asset && <Table striped bordered>
                        <tbody>
                            <tr>
                                <td>Nama Barang</td>
                                <td>{detail_asset.name}</td>
                            </tr>
                            <tr>
                                <td>Merk / Model</td>
                                <td>{detail_asset.merk}</td>
                            </tr>
                            <tr>
                                <td>No Seri Pabrik </td>
                                <td>{detail_asset.merk}</td>
                            </tr>
                            <tr>
                                <td>Ukuran</td>
                                <td>{detail_asset.size}</td>
                            </tr>
                            <tr>
                                <td>Bahan</td>
                                <td>{detail_asset.material}</td>
                            </tr>
                            <tr>
                                <td>Tahun Pembuatan / Pembelian</td>
                                <td>{detail_asset.date_of_purchase}</td>
                            </tr>
                            <tr>
                                <td>Kode Barang</td>
                                <td>{detail_asset.asset_code}</td>
                            </tr>
                            <tr>
                                <td>No Registrasi</td>
                                <td>{detail_asset.code}</td>
                            </tr>
                            <tr>
                                <td>Golongan</td>
                                <td>{detail_asset.group_of_code ? detail_asset.group_of_code.name : ""}</td>
                            </tr>
                            <tr>
                                <td>Lokasi Pembelian</td>
                                <td>{detail_asset.purchase_location ? detail_asset.purchase_location.name : ""}</td>
                            </tr>
                            <tr>
                                <td>Lokasi Aset</td>
                                <td>{ detail_asset.location ? detail_asset.location.name : ""}</td>
                            </tr>
                            <tr>
                                <td>Satuan Kerja</td>
                                <td>{detail_asset.work_unit ? detail_asset.work_unit.name : ""}</td>
                            </tr>
                            <tr>
                                <td>Jumlah Barang</td>
                                <td>{detail_asset.total}</td>
                            </tr>
                            <tr>
                                <td>Harga Barang</td>
                                <td>{detail_asset.price ? formatCurrency(detail_asset.price) : 0}</td>
                            </tr>
                            <tr>
                                <td>Total Harga</td>
                                <td>{detail_asset.price ? formatCurrency(detail_asset.price * detail_asset.total) : 0}</td>
                            </tr>
                            <tr>
                                <td>Kondisi Barang Baik (B)</td>
                                <td>{detail_asset.condition_good}</td>
                            </tr>
                            <tr>
                                <td>Kondisi Barang Kurang Baik (KB)</td>
                                <td>{detail_asset.condition_not_good}</td>
                            </tr>
                            <tr>
                                <td>Kondisi Barang Rusak Berat (RB)</td>
                                <td>{detail_asset.condition_very_bad}</td>
                            </tr>
                            <tr>
                                <td>Dipinjam</td>
                                <td>{detail_asset.quantity_loan}</td>
                            </tr>
                            <tr>
                                <td>Keterangan</td>
                                <td>{detail_asset.description}</td>
                            </tr>
                        </tbody>
                    </Table>}

                    <div className='d-flex justify-content-end gap-3'>
                        <Button label='Ubah' variant='success' size='md' onClick={redirectToUpdate} />
                        <Button label='Hapus' variant='danger' size='md' onClick={setAlert} />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Index