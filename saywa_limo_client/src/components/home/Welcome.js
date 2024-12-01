import React from "react";
import "./welcome.css";

function Welcome() {
  return (
    <section>
      <div className="section-title">
        <h3>Welcome to</h3>
        <h1>SAYWALIMO</h1>
      </div>
      <div className="row content">
        <div className="col-lg-6">
          <p style={{ textAlign: "justify" }}>
            <strong>SAYWALIMO</strong>, established in 2023, specializes in
            providing first-class limousine and luxury transportation services
            to clients in Seattle. Our commitment to excellence and attention to
            detail has earned us a solid reputation as one of the premier
            providers of limousine and luxury transportation in the Seattle
            area.
          </p>
          <p style={{ textAlign: "justify" }}>
            Whether you're looking for corporate travel, wedding transportation,
            or special occasion transportation, we have the experience and
            expertise to exceed your expectations and make your event
            unforgettable. So if you're looking for a reliable and luxury
            transportation provider, look no further than Saywa Limo.
          </p>
        </div>
        <div className="col-lg-6 pt-4 pt-lg-0">
          <p style={{ textAlign: "justify" }}>
            At Saywa Limo, we offer a comprehensive selection of
            transportation services to suit a variety of needs. Our services
            include corporate travel, weddings, special occasions, and much
            more. Whether you're looking for a sleek and stylish limousine for a
            corporate event or a spacious party vehicle for a fun-filled night
            out, we have the perfect vehicle to make your event extra special.
          </p>
          <p style={{ textAlign: "justify" }}>
            Our team of experienced professionals is dedicated to providing
            exceptional service and attention to detail to ensure that your
            experience with us is nothing short of extraordinary. We understand
            the importance of making a lasting impression and we're here to help
            you do just that. So if you're looking for a luxurious and memorable
            transportation experience, look no further than Saywa Limo.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
