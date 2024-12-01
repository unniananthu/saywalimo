import React, { useEffect } from "react";
import BookingForm from "../components/home/BookingForm";
import Services from "../components/home/Services";
import CompanyInfo from "../components/home/CompanyInfo";
import cityImage from "../images/city.jpg";
import { useJsApiLoader } from "@react-google-maps/api";
import Welcome from "../components/home/Welcome";
import Counts from "../components/home/Counts";
import Fleet from "../components/home/Fleet";
import { useDispatch } from "react-redux";
import { activeStepx } from "../store/StepperSlice";
import bgImage from "../../src/images/allblackhome.png";
const libraries = ["places"];

function Home() {
  // ----------------------------------[Custom Styles]----------------------------------

  const cityImageStyle = {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    filter: "greyscale(5)",
  };

  // ----------------------------------[Initialise Google Map]----------------------------------
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // ----------------------------------[Initialise State]----------------------------------
  const dispatch = useDispatch();

  // ----------------------------------[Set First Stepper as active]----------------------------------
  useEffect(() => {
    dispatch(activeStepx(0));
    // eslint-disable-next-line
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <div>
      <div className="banner-image-containerx">
        <div className="banner-image-container">
          <img src={bgImage} alt="" className="banner-image" />
        </div>
        <div className="home-booking-form">
          <div>
            <div
              style={{
                color: "white",
                fontSize: "25px",
                fontWeight: "bold",
                color: "#c19b65",
              }}
            >
              Saywa Seattle
            </div>
            <div
              style={{
                color: "white",
                fontSize: "50px",
                fontWeight: "bold",
              }}
            >
              Exquisite Reservations
            </div>
            <div style={{ color: "white", fontSize: "23px" }}>
              Elevate Your Journey with Unparalleled Elegance
            </div>
          </div>
          <BookingForm />
        </div>
      </div>
      <div className="continer"></div>
      <div className="container">
        <Welcome />
        <Counts />
      </div>
      {/* <Services /> */}
      <div className="container">{/* <Fleet /> */}</div>
      <div className="container p-4 mb-4 mt-4">{/* <CompanyInfo /> */}</div>
      <div>{/* <img src={cityImage} alt="" style={cityImageStyle} /> */}</div>
    </div>
  );
}

export default Home;
