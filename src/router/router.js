import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "./routes";
import { Footer, Navbar, Preloader, Sidebar } from "../components";

import { 
  Dashboard, 
  Login, 
  NotFound, 
  Location, 
  Condition, 
  ConditionAdd, 
  ConditionUpdate, 
  User, 
  UserRegister, 
  UserUpdate, 
  Position,
  Asset,
  AssetDetail,
  CreateAsset,
  WorkUnit,
  UpdateAsset,
  EducationalCalendar,
  Activity,
  CreateActivity,
  UpdateActivity,
  Message,
  AssetProcurement,
  CreateAssetProcurement,
  DetailAssetProcurement,
  UpdateAssetProcurement,
  AssetRepair,
  AssetLoan,
  CreateAssetLoan,
  DetailAssetLoan,
  UpdateAssetLoan,
  CreateAssetRepair,
  DetailAssetRepair,
  UpdateAssetRepair,
  AssetBleaching,
  GroupCode,
  PurchaseLocation,
  Galery,
  Banner,
  PrintBarcode
} from "../pages";

const RouteWithoutSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  const isLoggin = localStorage.getItem("token");

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return !isLoggin ? (
    <Route
      {...rest}
      render={(props) => (
        <>
          {" "}
          <Preloader show={loaded ? false : true} /> <Component {...props} />{" "}
        </>
      )}
    />
  ) : (
    <Redirect to={"/"} />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const isLoggin = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggin ? (
          <>
            <Sidebar />

            <main className="content">
              <Navbar path={rest.path} />
              <Component {...props} />
              <Footer />
            </main>
          </>
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

const RouteWithoutSidebarV2 = ({ component: Component, ...rest }) => {
  const isLoggin = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggin ? (
          <>
            {/* <Sidebar /> */}

            {/* <main className="content"> */}
              {/* <Navbar path={rest.path} /> */}
              <Component {...props} />
              {/* <Footer /> */}
            {/* </main> */}
          </>
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

const Router = () => (
  <Switch>
    <RouteWithoutSidebar exact path={Routes.Login.path} component={Login} />

    {/* pages */}
    <RouteWithSidebar exact path={Routes.Beranda.path} component={Dashboard} />
    <RouteWithSidebar exact path={Routes.Dashboard.path} component={Dashboard} />

    {/* User */}
    <RouteWithSidebar exact path={Routes.User.path} component={User} />
    <RouteWithSidebar exact path={Routes.UserRegister.path} component={UserRegister} />
    <RouteWithSidebar exact path={Routes.UserUpdate.path} component={UserUpdate} />

    {/* Asset */}
    <RouteWithSidebar exact path={Routes.Asset.path} component={Asset} />
    <RouteWithSidebar exact path={Routes.AssetDetail.path} component={AssetDetail} />
    <RouteWithSidebar exact path={Routes.CreateAsset.path} component={CreateAsset} />
    <RouteWithSidebar exact path={Routes.UpdateAsset.path} component={UpdateAsset} />
    <RouteWithoutSidebarV2 exact path={Routes.PrintBarcode.path} component={PrintBarcode} />

    {/* Asset Procurement */}
    <RouteWithSidebar exact path={Routes.AssetProcurement.path} component={AssetProcurement} />
    <RouteWithSidebar exact path={Routes.CreateAssetProcurement.path} component={CreateAssetProcurement} />
    <RouteWithSidebar exact path={Routes.DetailAssetProcurement.path} component={DetailAssetProcurement} />
    <RouteWithSidebar exact path={Routes.UpdateAssetProcurement.path} component={UpdateAssetProcurement} />

    {/* AssetLoan */}
    <RouteWithSidebar exact path={Routes.AssetLoan.path} component={AssetLoan} />
    <RouteWithSidebar exact path={Routes.CreateAssetLoan.path} component={CreateAssetLoan} />
    <RouteWithSidebar exact path={Routes.DetailAssetLoan.path} component={DetailAssetLoan} />
    <RouteWithSidebar exact path={Routes.UpdateAssetLoan.path} component={UpdateAssetLoan} />

    {/* Asset Repair */}
    <RouteWithSidebar exact path={Routes.AssetRepair.path} component={AssetRepair} />
    <RouteWithSidebar exact path={Routes.CreateAssetRepair.path} component={CreateAssetRepair} />
    <RouteWithSidebar exact path={Routes.DetailAssetRepair.path} component={DetailAssetRepair} />
    <RouteWithSidebar exact path={Routes.UpdateAssetRepair.path} component={UpdateAssetRepair} />

    {/* Asset Bleaching */}
    <RouteWithSidebar exact path={Routes.AssetBleaching.path} component={AssetBleaching} />

    {/* Position */}
    <RouteWithSidebar exact path={Routes.Position.path} component={Position} />

    {/* Condition */}
    <RouteWithSidebar exact path={Routes.Location.path} component={Location} />

    {/* Work Unit */}
    <RouteWithSidebar exact path={Routes.WorkUnit.path} component={WorkUnit} />

    {/* Group Code */}
    <RouteWithSidebar exact path={Routes.GroupCode.path} component={GroupCode} />

    {/* Purchase Location */}
    <RouteWithSidebar exact path={Routes.PurchaseLocation.path} component={PurchaseLocation} />
    
    {/* User */}
    <RouteWithSidebar exact path={Routes.User.path} component={User} />
    <RouteWithSidebar exact path={Routes.UserUpdate.path} component={UserUpdate} />

    {/* Educational Calendar */}
    <RouteWithSidebar exact path={Routes.EducationalCalendar.path} component={EducationalCalendar} />

    {/* Activity */}
    <RouteWithSidebar exact path={Routes.Activity.path} component={Activity} />
    <RouteWithSidebar exact path={Routes.CreateActivity.path} component={CreateActivity} />
    <RouteWithSidebar exact path={Routes.UpdateActivity.path} component={UpdateActivity} />

    {/* Messages */}
    <RouteWithSidebar exact path={Routes.Message.path} component={Message} />

    {/* Galery */}
    <RouteWithSidebar exact path={Routes.Galery.path} component={Galery} />

    {/* Banner */}
    <RouteWithSidebar exact path={Routes.Banner.path} component={Banner} />

    {/* Not Found */}
    <RouteWithoutSidebar exact path={Routes.NotFound.path} component={NotFound} />

    <Redirect to={Routes.NotFound.path} />
  </Switch>
);

export default Router;
