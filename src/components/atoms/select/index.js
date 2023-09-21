import React from 'react'
import { Form } from 'react-bootstrap';

const Index = ({label, listOption, handleOption, required}) => {
    return (
        <Form>
            <Form.Label>
                {label} 
                {required ? <span className='text-danger px-1'>*</span> : ""}
            </Form.Label>
            <Form.Select
                aria-label="Default select example"
                onChange={handleOption}
            >
            {listOption}
        </Form.Select>
        </Form>
    )
}

export default Index