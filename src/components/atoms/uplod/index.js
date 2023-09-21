import React from "react";

const Index = ({ img, ...rest }) => {
  return (
    <div className="upload">
      <div className="p-1" style={{ width: "100%", height: "100%" }}>
        {img && <img className="preview" src={img} alt="preview" />}
      </div>
      <input className="p-2" type="file" {...rest} />
    </div>
  );
};

export default Index;
