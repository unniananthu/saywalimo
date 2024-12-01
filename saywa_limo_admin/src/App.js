import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Sidebar from "./UI/Sidebar";
import Vehicles from "./Pages/Vehicles/Vehicles";
import AddVehicle from "./Pages/Vehicles/AddVehicle";
import Categories from "./Pages/Categories/Categories";
import Trips from "./Pages/Trips/Trips";
import ViewTrip from "./Pages/Trips/ViewTrip";
import Users from "./Pages/Users/Users";
import AddTrip from "./Pages/AddTrip/AddTrip";
import AddUser from "./Pages/Users/AddUser";
import UpdateUser from "./Pages/Users/UpdateUser";
import Login from "./Pages/Login/Login";
import TripAction from "./Pages/AddTrip/TripAction";
import NewPayment from "./Pages/AddTrip/NewPayment";
import TripSuccess from "./Pages/AddTrip/TripSuccess";
import UpdateTrip from "./Pages/Trips/UpdateTrip";
import AllTrips from "./Pages/Trips/AllTrips";
import UpdateVehicle from "./Pages/Vehicles/UpdateVehicle";
import Clients from "./Pages/Clients/Clients";
import ViewClients from "./Pages/Clients/ViewClients";
import ViewTripT from "./Pages/Trips/ViewTrip copy";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import PackagesPage from "./Pages/Packages/Packages";
import AddPackagePage from "./Pages/Packages/AddPackagePage";
import SettingsPage from "./Pages/Settings/SettingsPage";

const loginstatus = sessionStorage.getItem("wsstfaarvav");
// const tokenstatus = sessionStorage.getItem('ok')

function App() {
  const { message } = useSelector((state) => state?.toast);
  const notify = () => toast(message);

  if (message.toastStatus) {
    if (message.type === "success") {
      toast.success(message.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (message.type === "info") {
      toast.info(message.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (message.type === "error") {
      toast.error(message.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
  if (loginstatus === null) {
    return <Login />;
  } else {
    return (
      <>
        <Sidebar respon />
        <main>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Usres Routes */}
            <Route path="/drivers" element={<Users />} />
            <Route path="/Clients" element={<Clients />} />
            <Route path="/view-client/:id" element={<ViewClients />} />
            <Route path="/Add_User" element={<AddUser />} />
            <Route path="/Update_User/:id" element={<UpdateUser />} />
            {/* Categories Route */}
            <Route path="/Categories" element={<Categories />} />
            {/* Vehicle Route */}
            <Route path="/Vehicles" element={<Vehicles />} />
            <Route path="/Add_Vehicle" element={<AddVehicle />} />
            <Route path="/Update_Vehicle/:id" element={<UpdateVehicle />} />
            {/* Trip Routes */}
            <Route path="/trips" element={<Trips />} />
            <Route path="/new_trips" element={<AllTrips />} />
            <Route path="/View_Trip/:id" element={<ViewTrip />} />
            <Route path="/Add_Trip" element={<AddTrip />} />
            <Route path="/Review_Trip" element={<TripAction />} />
            <Route path="/Trip_Payment" element={<NewPayment />} />
            <Route path="/Trip_Success" element={<TripSuccess />} />
            <Route path="/Trip_Action/:id" element={<UpdateTrip />} />
            <Route path="/view-trip/:id" element={<ViewTripT />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/add_package" element={<AddPackagePage />} />
            <Route path="/packages/:id" element={<AddPackagePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </>
    );
  }
}

export default App;
