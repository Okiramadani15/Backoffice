
import React from 'react'
import { Button } from 'react-bootstrap'

const Index = ({label, variant, size, onClick, disabled, fullwidth, customClass}) => {
    return (
        <Button 
            variant={variant} 
            onClick={onClick} 
            disabled={disabled} 
            size={size ? size : "sm"} 
            type="button" 
            className={`${fullwidth ? "w-100" : ""} ${customClass ? customClass : ""}`}
            >
                {label}
        </Button>
    )
}

export default Index