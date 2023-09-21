import React from 'react'
import { Modal } from 'react-bootstrap'

const Index = ({show, size, body, title, handleClose}) => {
    return (
        <Modal show={show} size={size ? size : "sm"} centered onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}
            </Modal.Body>
        </Modal>
    )
}

export default Index