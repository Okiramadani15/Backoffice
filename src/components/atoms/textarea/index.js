import React from 'react'
import { Form } from 'react-bootstrap'

const Index = ({label, placeholder, required, onChange, value}) => {
    return (
        <Form>
            <Form.Label className='m-0'>{label}{required ? <span className='text-danger px-1'>*</span> : ""}</Form.Label>
            <Form.Control
                as="textarea"
                placeholder={placeholder}
                style={{ height: '100px' }}
                onChange={onChange}
                value={value}
            />
        </Form>
    )
}

export default Index