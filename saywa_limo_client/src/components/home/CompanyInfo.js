import { Button } from "@mui/material";
import React from "react";

function CompanyInfo() {
  return (
    <div>
      <h3>
        <strong>Car Rental Service Across the world</strong>
      </h3>
      <p>Transform the way your company moves and feeds its people.</p>
      <Button
        variant="container"
        style={{ background: "black", color: "white" }}
      >
        Read More
      </Button>
    </div>
  );
}

export default CompanyInfo;
