import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faArrowAltCircleDown, faArrowCircleLeft, faBalanceScale, faBasketShopping, faCalendar, faCalendarAlt, faChartPie, faCog, faFileCircleCheck, faFileExport, faGlassWaterDroplet, faHandHoldingUsd, faLayerGroup, faMailBulk, faRssSquare, faSignOutAlt, faTable, faTimes, faTv, faUser, faVoicemail } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Accordion, Navbar } from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";

import { Routes } from "../../../router/routes";
import { Logo, Profile } from "../../../assets";
import "./index.css";
import { faCalendarCheck, faHourglass } from "@fortawesome/free-regular-svg-icons";
import * as action from "../../../redux/actions";

import { useDispatch, useSelector } from "react-redux";

const Index = (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const dispatch = useDispatch();
  const [totalMessage, setTotalMessage] = useState(0);
  
  const {load_auth, profile} = useSelector((state) => state.auth);
  const { load_message, count_message } = useSelector((state) => state.message);

  const loadData = async () => {
    await dispatch(action.getProfile());
    // await dispatch(action.countMessageUnRead());
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if(count_message.total != undefined){
      setTotalMessage(count_message.total);
    }
  }, [count_message]);

  const signOut = async() => {
    await dispatch(action.logout());
  }
    
  const onCollapse = () => setShow(!show);
  

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">{children}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    let pathnames = pathname === "/" ? "/dashboard" : pathname;
    const navItemClassName = link === pathnames ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
            ) : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon mb-2" /> : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return load_message && load_auth ? (
    <p>Loading...</p>
  ) : (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none hide_on_print">
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.Dashboard.path}>
          <Image src={Logo} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition hide_on_print">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4 hide_on_print">
                  <Image src={process.env.REACT_APP_BASE_URL + profile.photo  } className="card-img-top rounded-circle border-white" />
                </div>
                <div className="d-block">
                  <h6>{profile.name}</h6>
                  <Button variant="secondary" size="xs" onClick={signOut} className="text-dark">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0 hide_on_print">
              <NavItem title="Al-Hasyimiyah" link={Routes.Beranda.path} image={Logo} />
              <NavItem title="Dashboard" link={Routes.Dashboard.path} icon={faTv} />
              
              {profile.id_position == 1 || profile.id_position == 2 ? (
                <>
                  <NavItem title="User" icon={faUser} link={Routes.User.path} />
                </>
              ) : null}
              
              <NavItem title="Asset" icon={faLayerGroup} link={Routes.Asset.path} />
              <NavItem title="Pengadaan Asset" icon={faBasketShopping} link={Routes.AssetProcurement.path} />
              {profile.id_position != 3 ? (
                <NavItem title="Peminjaman Asset" icon={faBalanceScale} link={Routes.AssetLoan.path} />
              ) : null}

              <NavItem title="Perbaikan Asset" icon={faFileExport} link={Routes.AssetRepair.path} />

              {profile.id_position <= 2 ? (
                <NavItem title="Pemutihan Asset" icon={faHourglass} link={Routes.AssetBleaching.path} />
              ) : null}
              
              {profile.id_position <= 2 ? (
                <>
                  <NavItem title="Kalender Pendidikan" icon={faCalendarAlt} link={Routes.EducationalCalendar.path} />
                  {/* <NavItem title="Aktifitas" icon={faRssSquare} link={Routes.Activity.path} /> */}
                  <NavItem title="Messages" icon={faMailBulk} link={Routes.Message.path} badgeText={totalMessage > 0 ? totalMessage : ""} badgeBg={totalMessage > 0 ? "danger" : ""} badgeColor={totalMessage > 0 ? "text-white" : ""} />
                </>

              ) : null}
            </Nav>
            {profile.id_position == 1 ? (
              <CollapsableNavItem eventKey="/setting" title="Setting" icon={faCog}>
                <NavItem title="Lokasi" link={Routes.Location.path} />
                <NavItem title="Jabatan" link={Routes.Position.path} />
                <NavItem title="Satuan Kerja" link={Routes.WorkUnit.path} />
                <NavItem title="Kode Golongan" link={Routes.GroupCode.path} />
                <NavItem title="Sumber Pembelian" link={Routes.PurchaseLocation.path} />
              </CollapsableNavItem>
            ) : null}

            {profile.id_position <= 2 ? (
              <NavItem title="Galery" icon={faGlassWaterDroplet} link={Routes.Galery.path} />
            ) : null}

            {profile.id_position <= 2 ? (
              <NavItem title="Banner" icon={faFileCircleCheck} link={Routes.Banner.path} />
            ) : null}
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default Index;
