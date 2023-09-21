import React, { useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";

// core styles
import "./assets/scss/volt.scss";

// vendor styles
import "react-datetime/css/react-datetime.css";

import Router from './router/router';
import { Alert, AlertConfirm } from './components';
import { useSelector } from 'react-redux';

// Custom Css
import "./assets/css/global.css"

const App = () => {
  const {open, open_confirm, type, message} = useSelector((state) => state.alert);
  
  return (
    <BrowserRouter>
      <Alert open={open} type={type} message={message} />
      {/* <AlertConfirm open={open_confirm} type={type} message={message} onConfirm={() => onConfirm()} /> */}
      <Router/>
    </BrowserRouter>
  );
}

export default App;
