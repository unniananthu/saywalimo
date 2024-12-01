import React from "react";
import "./services.css";

function Services() {
  return (
    <section id="services" className="why-us section-bg">
      <div className="container-fluid aos-init aos-animate" data-aos="fade-up">
        <div className="row">
          <div
            className="col-lg-5 align-items-stretch video-box service-imgblock aos-init aos-animate"
            data-aos="zoom-in"
            data-aos-delay="100"
          ></div>

          <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch">
            <div className="content">
              <div className="section-title">
                <h3 className="sub-title">WHAT WE DO</h3>
                <h2>Our Services</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
