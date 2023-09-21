
import React from 'react';
import { Image } from '@themesberg/react-bootstrap';
import { Logo, OpenerLoading } from '../../../assets';

// import ReactLogo from "../assets/img/technologies/react-logo-transparent.svg";

const Index = (props) => {

  const { show } = props;

  return (
    <div className={`preloader bg-soft flex-column justify-content-center align-items-center ${show ? "" : "show"}`}>
      <Image className="loader-element animate__animated animate__jackInTheBox" src={OpenerLoading} height={100} />
    </div>
  );
};

export default Index;
