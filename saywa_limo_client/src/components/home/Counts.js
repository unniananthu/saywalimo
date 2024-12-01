import React from "react";
import "./counts.css";
import { BiTaxi, BiHappyAlt, BiSupport, BiGroup } from "react-icons/bi";

function Counts() {
  return (
    <section id="counts" className="counts">
      <div className="container aos-init aos-animate" data-aos="fade-up">
        <div className="row no-gutters">
          <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch">
            <div className="count-box">
              <div className="bx bx-taxi">
                <BiTaxi style={{ color: "#e5bb73", fontSize: "30px" }} />
              </div>
              <span className="counter_postfix">20,000+</span>
              <p>
                <strong>Trips</strong>
                <br />
                Completed
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch">
            <div className="count-box">
              <div className="bx bx-taxi">
                <BiHappyAlt style={{ color: "#e5bb73", fontSize: "30px" }} />
              </div>
              <span className="counter_postfix">20,000+</span>
              <p>
                <strong>Happy</strong>
                <br />
                Clients
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch">
            <div className="count-box">
              <div className="bx bx-taxi">
                <BiSupport style={{ color: "#e5bb73", fontSize: "30px" }} />
              </div>
              <span className="counter_postfix">24hr</span>
              <p>
                <strong> Online</strong>
                <br />
                Support
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 d-md-flex align-items-md-stretch">
            <div className="count-box">
              <div className="bx bx-taxi">
                <BiGroup style={{ color: "#e5bb73", fontSize: "30px" }} />
              </div>
              <span className="counter_postfix">10</span>
              <p>
                <strong>Skilled</strong>
                <br />
                Chauffeurs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Counts;
