import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import "./index.css";

const editorConfiguration = {
    toolbar: {
        items: [
            'heading', '|',
            'fontfamily', 'fontsize', '|',
            'alignment', '|',
            'fontColor', 'fontBackgroundColor', '|',
            'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
            'link', '|',
            'outdent', 'indent', '|',
            'bulletedList', 'numberedList', 'todoList', '|',
            'code', 'codeBlock', '|',
            'insertTable', '|',
            'blockQuote', '|',
            'undo', 'redo'
        ],
        shouldNotGroupWhenFull: true    
    }
};


const Index = ({label, value, handleChange, required }) => {
    
    return (
        <div>
            <p>{label}{required ? <span className='text-danger px-1'>*</span> : ""}</p>
            <CKEditor
                editor={ ClassicEditor }
                config={ editorConfiguration }
                data={value}
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    // console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    handleChange(data);
                } }
                onBlur={ ( event, editor ) => {
                    // console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    // console.log( 'Focus.', editor );
                } }
            />
        </div>
    )
}

export default Index