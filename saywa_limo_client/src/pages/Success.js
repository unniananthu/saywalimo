import { Button } from "@mui/material";
import React from "react";
import successImage from "../images/success-icon.png";
function Success() {
  return (
    <div className="container p-5 mt-5" style={{ minHeight: "43vh" }}>
      <div
        className="text-center"
        style={
          {
            // position: "absolute",
            // top: "30%",
            // left: "50%",
            // transform: "translate(-50%,-50%)",
          }
        }
      >
        <img src={successImage} alt="" style={{ width: "100px" }} />
        <div className="mt-4">
          Thank you for providing your booking details. We will be in contact
          with you shortly.
        </div>
        <div>
          For real-time updates, please refer to the "Account" section to track
          your ride information.
        </div>
        <div className="text-center d-flex gap-2 mt-4 w-100 justify-content-center">
          <a href="/">
            <Button
              variant="outlined"
              style={{ border: "1px solid black", color: "black" }}
              type="primary"
            >
              Go Home
            </Button>
          </a>
          <a href="/rides">
            <Button
              variant="contained"
              style={{ background: "black", color: "white" }}
              type="primary"
              onClick={() => sessionStorage.setItem("ordertabindex", 1)}
            >
              My Trips
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Success;
