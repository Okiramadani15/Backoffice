import React from "react";

const Index = ({ jumlah, label }) => {
  return (
    <div className="px-3 py-2 bg-white shadow rounded">
      <h1>{jumlah}</h1>
      <div className="icon"></div>
      <p>{label}</p>
    </div>
  );
};

export default Index;
