import React from 'react'
import { Modal } from 'react-bootstrap'

const Index = ({show, title, handleClose, body, size}) => {
    return (
        <Modal show={show} size={size ? size : 'sm'} centered onHide={handleClose} className="bg-none">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            {body}
        </Modal>
    )
}

export default Index