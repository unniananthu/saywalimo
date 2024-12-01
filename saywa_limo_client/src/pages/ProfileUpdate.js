import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { instance } from "../const/ApiHeader";
import { GET_CUSTOMER, UPDATE_CUSTOMER } from "../const/ApiConst";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import Placeholder from "react-bootstrap/Placeholder";

function ProfileUpdate() {
  const [userData, setUserData] = useState([]);
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [responseAlert, setResponseAlert] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const data = {
      customer_id: JSON.parse(Cookies.get("udtl")).uid,
    };
    await instance
      .post(GET_CUSTOMER, data)
      .then((response) => {
        setLoading(true);
        setUserData(response.data);
        setName(response.data[0].fullName);
        setContactNo(response.data[0].contact_no);
        setEmail(response.data[0].email);
        setAddressLine1(response.data[0].addressLine1);
        setAddressLine2(response.data[0].addressLine2);
        setAddressLine3(response.data[0].addressLine3);
        setZipCode(response.data[0].zipCode);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    loadData();
  }, []);

  const updateAction = async () => {
    const data = {
      cid: JSON.parse(Cookies.get("udtl")).uid,
      name,
      contactNo,
      addressLine1,
      addressLine2,
      addressLine3,
      zipCode,
    };
    await instance
      .post(UPDATE_CUSTOMER, data)
      .then((response) => {
        setResponseAlert("success");
      })
      .catch((err) => setResponseAlert("error"));
  };

  useEffect(() => {
    if (responseAlert === "success") {
      toast.success("Updated successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (responseAlert === "error") {
      toast.error("Sorry! Something went wrong", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [responseAlert]);

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <h3>My Profile</h3>
      {loading ? (
        <div className="row">
          <div className="col-12 col-md-6 mt-3">
            <TextField
              label={"Full Name"}
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField
              className="col-12 m"
              label={"Contact No"}
              size="small"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              fullWidth
            />{" "}
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField
              label={"Email id"}
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              disabled
            />{" "}
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField
              label={"AddressLine 1"}
              size="small"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              fullWidth
            />{" "}
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField
              label={"AddressLine 2"}
              size="small"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              fullWidth
            />{" "}
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField
              label={"AddressLine 3"}
              size="small"
              value={addressLine3}
              onChange={(e) => setAddressLine3(e.target.value)}
              fullWidth
            />{" "}
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField
              label={"ZipCode"}
              size="small"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              fullWidth
            />
          </div>
          <div className="text-center mt-4">
            <Button
              variant="contained"
              style={{ background: "black" }}
              onClick={() => updateAction()}
            >
              Update
            </Button>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12 col-md-6">
            <Placeholder as="p" animation="glow" className="my-3">
              <Placeholder xs={12} style={{ height: "2rem" }} />
            </Placeholder>
          </div>
          <div className="col-12 col-md-6">
            <Placeholder as="p" animation="glow" className="my-3">
              <Placeholder xs={12} style={{ height: "2rem" }} />
            </Placeholder>
          </div>
          <div className="col-12 col-md-6">
            <Placeholder as="p" animation="glow" className="my-3">
              <Placeholder xs={12} style={{ height: "2rem" }} />
            </Placeholder>
          </div>
          <div className="col-12 col-md-6">
            <Placeholder as="p" animation="glow" className="my-3">
              <Placeholder xs={12} style={{ height: "2rem" }} />
            </Placeholder>
          </div>
          <div className="col-12 col-md-6">
            <Placeholder as="p" animation="glow" className="my-3">
              <Placeholder xs={12} style={{ height: "2rem" }} />
            </Placeholder>
          </div>
          <div className="col-12 col-md-6">
            <Placeholder as="p" animation="glow" className="my-3">
              <Placeholder xs={12} style={{ height: "2rem" }} />
            </Placeholder>
          </div>
          <div className="col-12 col-md-6">
            <Placeholder as="p" animation="glow" className="my-3">
              <Placeholder xs={12} style={{ height: "2rem" }} />
            </Placeholder>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileUpdate;
