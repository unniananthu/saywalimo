import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import user from "../../Imges/users-svgrepo-com.svg";
import limo from "../../Imges/car-limousine-svgrepo-com.svg";
import travel from "../../Imges/travel-svgrepo-com.svg";
import { instance } from "../../Const/ApiHeader";
import {
  ALL_CLIENTS_COUNTS,
  ALL_VEHICLE_COUNT,
  LAST_FIVE_TRIPS,
  TOTAL_TRIPS,
} from "../../Const/ApiConst";
import moment from "moment";
import { Link } from "react-router-dom";
import { Circle } from "@mui/icons-material";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [custCount, setCustCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [totalTripCount, settotalTripCount] = useState(0);
  const [isLoadingCustCount, setIsLoadingCustCount] = useState(true);
  const [isLoadingVehCount, setIsLoadingVehCount] = useState(true);
  const [isLoadingTripCount, setIsLoadingTripCount] = useState(true);

  useEffect(() => {
    loadCustomersCount();
    loadVehicleCount()
      .then((res) => {
        setIsLoadingCustCount(false);
      })
      .catch((e) => console.log(e));
    loadTripCount()
      .then((res) => {
        setIsLoadingTripCount(false);
      })
      .catch((e) => console.log(e));
    loadLastTrips()
      .then((res) => {
        setIsLoadingVehCount(false);
      })
      .catch((e) => console.log(e));
  }, []);

  const loadTripCount = async () => {
    const value = await instance.get(TOTAL_TRIPS);
    settotalTripCount(value?.data?.count);
  };
  const loadCustomersCount = async () => {
    const value = await instance.get(ALL_CLIENTS_COUNTS);
    setCustCount(value?.data?.count);
  };
  const loadVehicleCount = async () => {
    const value = await instance.get(ALL_VEHICLE_COUNT);
    setVehicleCount(value?.data?.count);
  };
  const loadLastTrips = async () => {
    await instance
      .get(LAST_FIVE_TRIPS)
      .then((response) => {
        setTrips(response.data);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <div className="dashboard-title-container">
        <div className="dashboard-tile">
          <div>Customer </div>
          <h2>
            <strong>
              {isLoadingCustCount ? (
                <div class="lds-dual-ring"></div>
              ) : (
                custCount
              )}
            </strong>
          </h2>
          <div className="dashboard-tile-image">
            <img src={user} alt="" height={60} />
          </div>
        </div>
        <div className="dashboard-tile">
          <div>Vehicles</div>
          <h2>
            <strong>
              {isLoadingVehCount ? (
                <div class="lds-dual-ring"></div>
              ) : (
                vehicleCount
              )}
            </strong>
          </h2>
          <div className="dashboard-tile-image">
            <img src={limo} alt="" height={60} />
          </div>
        </div>
        <div className="dashboard-tile">
          <div>Trips</div>
          <h2>
            <strong>
              {isLoadingTripCount ? (
                <div class="lds-dual-ring"></div>
              ) : (
                totalTripCount
              )}
            </strong>
          </h2>
          <div className="dashboard-tile-image">
            <img src={travel} alt="" height={60} />
          </div>
        </div>
      </div>

      <div>
        <div className="mt-3 d-flex justify-content-between w-100">
          <h4>Last 5 Trips</h4>
          <div>
            <Link to="/trips">SEE ALL</Link>
          </div>
        </div>
        <table className="table">
          <tbody>
            {trips.map((res) => (
              <tr>
                <td
                  style={{
                    fontSize: "13px",
                    width: "80px",
                    verticalAlign: "middle",
                  }}
                >
                  {res.tripNo}
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  <small style={{ fontSize: "11px" }}>
                    {res.source}
                    <br />
                    {res.destination}
                  </small>
                </td>
                <td style={{ fontSize: "10px", verticalAlign: "middle" }}>
                  <div style={{color:"blue"}}>
                    {`${
                      res.rideType === "oneway-trip"
                        ? "Oneway Trip"
                        : "Hourly Trip"
                    }`}
                  </div>
                  <div>
                    {moment(Date(res.scheduledDate)).format("MMM DD, YYYY")}
                    <br />
                    <strong>{res.scheduledTime}</strong>
                  </div>
                </td>
                <td style={{ fontSize: "13px", verticalAlign: "middle" }}></td>
                <td style={{ fontSize: "10px", verticalAlign: "middle" }}>
                  $ {parseFloat(res.totalAmount).toFixed(0)}
                </td>
                <td
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    width: "60px",
                    verticalAlign: "middle",
                    color:
                      res.tripStatus === "Pending"
                        ? "blue"
                        : res.tripStatus === "Completed"
                        ? "green"
                        : res.tripStatus === "Cancelled"
                        ? "red"
                        : null,
                  }}
                >
                  {res.tripStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
