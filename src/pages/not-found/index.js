
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Card, Image, Button, Container } from '@themesberg/react-bootstrap';

import { useHistory } from 'react-router-dom';

import { NotFound404 } from "../../assets";


const Index = () => {

    const history = useHistory();
    return (
        <main>
            <section className="vh-100 d-flex align-items-center justify-content-center bg-white">
                <Container>
                    <Row className="p-5">
                        <Col xs={12} className="text-center d-flex align-items-center justify-content-center">
                            <div>
                                <Card.Link>
                                    <Image src={NotFound404} className="img-fluid w-50" />
                                </Card.Link>
                                <p className="lead my-4">
                                    Oops! Halaman yang kamu cari tidak ditemukan.
                                </p>
                                <Button variant="primary" className="animate-hover" onClick={() => history.goBack()}>
                                    <FontAwesomeIcon icon={faChevronLeft} className="animate-left-3 me-4 ms-2" />
                                    Kembali
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
};

export default Index;