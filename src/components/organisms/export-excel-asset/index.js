import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import * as action from "../../../redux/actions";
import { Button } from '../../atoms';

const Index = ({search, typeAsset, locationAsset, workUnit}) => {
    const dispatch = useDispatch();

    const loadData = async() => {
        let asset = await dispatch(action.exportAsset(search, typeAsset, locationAsset, workUnit));
        await downloadExcel(asset);
    };

    const downloadExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    };    

    return (
        <Button 
        label="Download As Excel" 
        variant="dark" 
        size="md"
        onClick={() => {
            loadData();
        }} 
    />
    );
}

export default Index