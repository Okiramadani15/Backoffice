
import React from "react";
import { Row, Col } from '@themesberg/react-bootstrap';

const Index = () => {
  const d = new Date();
  let year = d.getFullYear();

  return (
    <div>
      <footer className="footer section py-3 px-2 bg-white w-100" style={{position: 'fixed', bottom: 0}}>
        <Row>
          <Col className="mb-lg-0">
            <p className="mb-0 text-start">
              Copyright © Al-Hasyimiyah {year}
            </p>
          </Col>
        </Row>
      </footer>
    </div>
  );
};

export default Index;
