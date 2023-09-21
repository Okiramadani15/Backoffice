import React from 'react'
import { Button } from '../../components';
import Barcode from 'react-barcode';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import "./index.css";

import { useBarcode } from '@createnextapp/react-barcode';
import QRCode from "react-qr-code";

const BarcodeComp = ({value, text}) => {
    const { inputRef } = useBarcode({
        value: value,
        options: {
            format: "CODE128",
            text: text,
            width: 2,
            height: 150,
            fontSize: 35,
            textAlign: 'center',
            // margin: 10,
            // font: "monospace",
            // fontSize: 45
            // displayValue:false
        }
    });

    return <img ref={inputRef} width='100%' />;
}


const Index = () => {
    const location = useLocation();
    const search = window.location.search;
    const params = new URLSearchParams(search);

    return (
        <div style={{width: '6cm', height: '4cm'}} className=''>
            <div className='d-flex flex-column'>
                <h6 className='text-center p-0 m-0' style={{fontWeight: 'bold', fontSize: '13px'}}>Aset Sarpas Pondok Pesantren Modern Al-Hasyimiyah</h6>
                <h6 className='text-center' style={{fontWeight: 'bolder', fontSize: '11px'}}>{params.get('name')}</h6>
                <div className='w-100 text-center p-0 m-0'>
                    {/* <BarcodeComp value={
                        // location.state.value
                        "imiyah.ponpes.id/5555" //15 - 20 karakter
                        } text={location.state.text} /> */}
                        <QRCode
                            size={256}
                            style={{ height: "75px", maxWidth: "100%", width: "100%" }}
                            value={params.get('value')}
                            viewBox={`0 0 256 256`}
                        />
                </div>
                <h6 className='text-center mt-1' style={{fontWeight: 'bold', fontSize: '11px'}}>{params.get('text')}</h6>
            </div>
            <Button
                label="Print"
                size="md"
                fullwidth
                customClass='hide_on_print mt-3'
                onClick={() => {
                    window.print();
                }}
            />
        </div>
    )
}

export default Index