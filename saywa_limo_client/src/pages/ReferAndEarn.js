import React, { useState } from "react";
import referImage from "../images/refer.png";
import referImageSuccess from "../images/success-send-email-message-your-request-will-be-processed-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg";
import { instance } from "../const/ApiHeader";
import { NEW_REFERAL_URL } from "../const/ApiConst";
import Cookies from "js-cookie";

function ReferAndEarn() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendReferAction = async () => {
    if (email === "") {
      return;
    }

    const cid = JSON.parse(Cookies.get("udtl")).uid;

    const data = {
      email,
      cid,
    };

    setIsLoading(true);

    await instance
      .post(NEW_REFERAL_URL, data)
      .then((result) => {
        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-12 col-md-6">
          <img src={referImage} alt="" style={{ width: "100%" }} />
        </div>
        <div className="col-12 col-md-6 p-3">
          {isSuccess ? (
            <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
              <h3 className="text-center">Success!</h3>
              <p>Referral link send successfully!</p>
              <img src={referImageSuccess} alt="" style={{ width: "200px" }} />
              <a
                href="/"
                className="mt-4 btn"
                style={{ background: "black", color: "white" }}
              >
                Home
              </a>
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
              <h4 className="text-center">Refer A Friend</h4>
              <p style={{ textAlign: "justify" }}>
                Enjoying our service? Share the Love! Get $25 off your next ride
                when your friend books.
              </p>

              <p style={{ textAlign: "start"  }} className="w-100">
                Note: Your $25 discount awaits once their trip is complete.
              </p>
              <input
                type="text"
                placeholder="Email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div
                style={{
                  background: "black",
                  color: "white",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  marginTop: "15px",
                  cursor: "pointer",
                }}
                onClick={() => !isLoading && sendReferAction()}
              >
                {isLoading ? "Please wait..." : "Refer Now"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReferAndEarn;
