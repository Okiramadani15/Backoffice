import { faEye, faEyeLowVision, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Form, InputGroup } from '@themesberg/react-bootstrap'
import React, { useState } from 'react'

const Index = ({label, icon, onChange, autofocus, required, type, placeholder, value, min}) => {
    const [showPass , setShowPass] = useState(false);

    const showPasswprd = () => {
        showPass ? setShowPass(false) : setShowPass(true);
    }
    
    return (
        <Form.Group className="">
            <Form.Label className='m-0'>{label}{required ? <span className='text-danger px-1'>*</span> : ""}</Form.Label>
            <InputGroup>
                {icon && 
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={icon} />
                    </InputGroup.Text>
                }
                
                <Form.Control 
                    onChange={onChange} 
                    autoFocus={autofocus ? true : false} 
                    required={required ? true : false} 
                    type={showPass ? "text" : type} 
                    placeholder={placeholder} 
                    value={value} autoComplete="password"
                    min={min}
                />

                {type === "password" && 
                    <InputGroup.Text onClick={showPasswprd} className="border">
                        <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} />
                    </InputGroup.Text> 
                }
            </InputGroup>
        </Form.Group>
    )
}

export default Index