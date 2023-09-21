import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { Col, Row } from 'react-bootstrap'
import { AssetDefault } from '../../assets';
import { Button, Editor, Gap, Input, Preloader } from '../../components'
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import * as action from "../../redux/actions";

const Index = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const imageRef = useRef(null);
    const history = useHistory();

    const [imagePreview, setImagePreview] = useState(AssetDefault);

    const { load_activity, detail_activity } = useSelector((state) => state.activity);

    const loadData = async() => {
        await dispatch(action.detailActivity(location.state.id));
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleImageRef = () => {
        imageRef.current.click();
    }
    
    const handleSelectImage = (image) => {
        if (image.target.files.length !== 0) {
            setFieldValue('image', image.target.files[0]);
            setImagePreview(URL.createObjectURL(image.target.files[0]));
        }
    }

    const { values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid } = useFormik({
        initialValues: {
            title: "",
            description: "",
            image: "",
        },
    
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("id", location.state.id);
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("image", values.image);
    
            let response = await dispatch(action.updateActivity(formData));
            if (response.status == "success") {
                history.goBack();
            }
        },
        validationSchema: Yup.object().shape({
          title: Yup.string().required("Tidak boleh kosong"),
          description: Yup.string().required("Tidak boleh kosong"),
        //   image: Yup.string().required("Tidak boleh kosong"),
        }),
    });

    useEffect(() => {
        if(!detail_activity.isArray){
            if(Object.keys(detail_activity).length > 0){
                setFieldValue('title', detail_activity.title);
                setFieldValue('description', detail_activity.description);
                setImagePreview(process.env.REACT_APP_BASE_URL + detail_activity.image);
            }
        }
    }, [detail_activity]);


    return load_activity ? (
        <Preloader />
    ) : (
        <div className='p-4'>
            <Row>
                <Col sm={12} md={4} lg={4}>
                    <img src={imagePreview} alt="Photo Profile" className="" />
                    <input type="file" className="d-none" ref={imageRef} onChange={(e) => {handleSelectImage(e)}} />
                    <Gap width={0} height={10} />
                    <div className="d-grid">
                        <Button label="Pilih Foto" size="sm" onClick={handleImageRef} />
                    </div>
                    {touched.image && errors.image && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.image}
                        </span>
                    )}
                    <Gap width={0} height={30} />
                </Col>
                <Col sm={12} md={8} lg={8}>
                    <Input 
                        label="Judul" 
                        required
                        onfocus
                        onChange={(e) => {
                            setFieldValue('title', e.target.value);
                        }}
                        value={values.title}
                    />
                    {touched.title && errors.title && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.title}
                        </span>
                    )}
                    <Gap width={0} height={20} />
                    <Editor 
                        label="Keterangan"
                        value={values.description}  
                        required
                        handleChange={(e) => setFieldValue('description', e)}
                    />
                    {touched.description && errors.description && (
                        <span className="text-danger" style={{ fontSize: "12px" }}>
                            {errors.description}
                        </span>
                    )}
                    <Gap width={0} height={20} />
                    <Button
                        label="Simpan" 
                        size="md"
                        fullwidth
                        onClick={handleSubmit}
                    />

                </Col>
            </Row>
            <Gap width={0} height={50} />
        </div>
    )
}

export default Index