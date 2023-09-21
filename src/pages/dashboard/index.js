import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Chart from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from "react-redux";
import { Gap, Preloader } from "../../components";
import DashboardCard from "../../components/molecules/dashboard-card";

import * as action from "../../redux/actions";

const Index = () => {
  const dispatch = useDispatch();

  const { load_asset, all_condition_asset } = useSelector((state) => state.asset);
  const { load_dashboard, chart } = useSelector((state) => state.dashboard);

  const loadData = async () => {
    await dispatch(action.getAllConditionAsset());
    await dispatch(action.getChart());
  };

  useEffect(() => {
    loadData();
  }, []);

  return load_asset && load_dashboard ? (
    <Preloader/>
  ) : (
    <div className="p-4">
      <Row className="mt-3">
        <Col className="col mt-3" xl={3} lg={6} md={6} sm={6} xs={12}>
          <DashboardCard jumlah={all_condition_asset.good} label="Kondisi Aset Baik" />
        </Col>

        <Col className="col mt-3" xl={3} lg={6} md={6} sm={6} xs={12}>
          <DashboardCard jumlah={all_condition_asset.not_good} label="Kondisi Aset Kurang Baik" />
        </Col>

        <Col className="col mt-3" xl={3} lg={6} md={6} sm={6} xs={12}>
          <DashboardCard jumlah={all_condition_asset.very_bad} label="Kondisi Aset Rusak berat" />
        </Col>

        <Col className="col mt-3" xl={3} lg={6} md={6} sm={6} xs={12}>
          <DashboardCard jumlah={all_condition_asset.total_asset} label="Total Aset" />
        </Col>
      </Row>
      <Gap width={0} height={50} />
      <div className="w-100">
        <p className="fs-4 fw-bolder text-uppercase">
          Grafik Asset Ponpes Al-Hasyimiyah {' '}
          {chart.years && chart.years.map((year, index) => {
            return (
              index == 0 ? chart.years[index] : ' / ' + chart.years[index]
            )
          })}
        </p>
        <Line
          datasetIdKey='id'
          data={{
            labels: chart.labels,
            datasets: [
              {
                id: 1,
                label: 'Perbaikan',
                data: chart.data_repair,
                fill: false,
                borderColor: 'rgb(255, 99, 132, 0.5)',
                tension: 0.1
              },
              {
                id: 1,
                label: 'Peminjaman',
                data: chart.data_loan,
                fill: false,
                borderColor: 'rgb(53, 162, 235, 0.5)',
                tension: 0.1
              },
              {
                id: 1,
                label: 'Pengadaan',
                data: chart.data_procurement,
                fill: false,
                borderColor: 'rgb(76 192 192)',
                tension: 0.1
              },
            ],
          }}
        />
      </div>
      <Gap width={0} height={100} />
    </div>
  );
};

export default Index;
