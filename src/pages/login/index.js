import React from 'react'
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Container, } from '@themesberg/react-bootstrap';
import { Button, Footer, Gap, Input } from '../../components';
import { Logo } from '../../assets';
import "./index.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import * as action from '../../redux/actions';
import { useHistory } from 'react-router-dom';

const Index = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const {values, setFieldValue, handleSubmit, handleReset, errors, touched, isValid} = useFormik({
        initialValues: {
            email: '',
            password: '',
            device_name: 'chrome',
        },
        onSubmit: async(values) => {
            let response = await dispatch(action.signIn(values));
            if(response.status == 'success'){
                localStorage.setItem('token', response.data);
                history.push('/');
            }
        },
        validationSchema: Yup.object().shape({
            email: Yup
                .string()
                .required("Tidak boleh kosong!"),
            password: Yup
                .string()
                .min(6, "Minimal 6 karakter")
                .required("Tidak boleh kosong!"),
        }),
    });

    return (
        <main>
            <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5" style={{height: '75vh'}}>
                <Container>
                    <Row className="justify-content-center form-bg-image">
                        <Col xs={12} md={5} className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                            <img src={Logo} className="w-sm-25-md-50 mb-3 text-center mx-auto justify-content-center" />
                        </Col>
                        <Col xs={12} md={7} className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                            <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                                <div className="text-center text-md-center mb-4 mt-md-0">
                                    <h3 className="mb-0">Login Sarpas</h3>
                                </div>
                                <Form className="mt-4">
                                    <Input label="Email" onChange={(e) => setFieldValue('email', e.target.value)} icon={faEnvelope} autofocus required type="email" placeholder="example@alhasyimiyah.com" />
                                    {touched.email && errors.email &&
                                        <p className='text-danger' style={{fontSize: '12px'}}>{errors.email}</p>
                                    }
                                    <Gap width={0} height={20} />
                                    <Input label="Password" onChange={(e) => setFieldValue('password', e.target.value)} icon={faLock} autofocus required type="password" placeholder="******" />
                                    {touched.password && errors.password &&
                                        <p className='text-danger' style={{fontSize: '12px'}}>{errors.password}</p>
                                    }
                                    <Gap width={0} height={30} />
                                    <div className='d-grid'>
                                        <Button label="Login" variant="primary" size="md" onClick={handleSubmit} errorMsg={errors.password} />
                                    </div>
                                </Form>
                            </div>
                        </Col>
                        
                    </Row>
                </Container>
            </section>

            <Footer/>
        </main>
    )
}

export default Index