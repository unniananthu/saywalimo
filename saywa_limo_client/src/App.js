import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Success from "./pages/Success";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Reservation from "./pages/Reservation";
import ProfilePage from "./pages/ProfilePage";
import Payment from "./pages/Payment";
import NewPayment from "./pages/NewPayment";
import Test from "./pages/Test";
import ReferAndEarn from "./pages/ReferAndEarn";
import PackagesPage from "./pages/Packages";
import Package_ViewPage from "./pages/Package_ViewPage";
import MainRidesList from "./pages/MainRidesList";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        {/* <Route path="/select-vehicle" element={<Test />} /> */}
        {/* <Route path="/select-vehicle" element={<Vehicles />} /> */}
        {/* <Route path="/review-booking" element={<ReviewBooking />} /> */}
        {/* <Route path="/booking-ride" element={<BookRide />} /> */}
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/rides" element={<MainRidesList />} />
        <Route path="/test" element={<Test />} />
        <Route path="/success" element={<Success />} />x
        <Route path="/make-payment/:id" element={<NewPayment />} />
        <Route path="/payment/:id/:tripid" element={<Payment />} />
        <Route path="/refer_and_earn" element={<ReferAndEarn />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/package/:id" element={<Package_ViewPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
