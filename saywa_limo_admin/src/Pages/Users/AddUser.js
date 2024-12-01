import {
  Breadcrumbs,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { COUNTRYCODES } from "../../Utils/CountryCodes";
import { instance } from "../../Const/ApiHeader";
import { ADDUSER, CHECKUSERNAME } from "../../Const/ApiConst";
import Loading from "../../Components/Loading";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab"; 
import "./add_user.css";

function AddUser() {
  const Navigate = useNavigate();
  // States
  const [userName, setUserName] = useState("");
  const [unameError, setUnameError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setlastName] = useState("");
  const [lastNameError, setlastNameError] = useState("");
  const [contactNumber, setcontactNumber] = useState("");
  const [contactNoError, setContactNoError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [countryCode, setcountryCode] = useState("+1");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("male");
  const [designation, setDesignation] = useState("Admin");
  const [designationError, setDesignationError] = useState("");
  const [userPassword, setuserPassword] = useState("Abc@123");
  // Loaders
  const [searchLoader, setSearchLoader] = useState(false);
  const [unameAvailable, setUnameAvailable] = useState("");
  const [unameTimer, setUnameTimer] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  // Check UserName
  const userNameAction = (e) => {
    setSearchLoader(true);
    setUnameAvailable("");
    setUnameError("");
    clearTimeout(unameTimer);
    const newTimer = setTimeout(() => {
      const data = {
        searchKey: e.target.value,
      };
      instance
        .post(CHECKUSERNAME, data)
        .then((response) => {
          setSearchLoader(false);
          switch (response.data.data) {
            case "Available":
              setUnameAvailable("Available");
              break;
            case "NotAvailable":
              setUnameAvailable("NotAvailable");
              setUnameError(response.data.message);
              break;
            default:
              break;
          }
        })
        .catch((err) => {});

      setUserName(e.target.value);
    }, 1000);

    setUnameTimer(newTimer);
  };

  // Input items store actions
  const fnameAction = (e) => {
    setFirstNameError("");
    setFirstName(
      e.target.value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  const lastNameAction = (e) => {
    setlastNameError("");
    setlastName(
      e.target.value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };
  const contactNoAction = (e) => {
    const regex = /^[0-9\b]+$/;
    setContactNoError("");
    if (regex.test(e.target.value)) {
      setcontactNumber(e.target.value);
    }
  };
  const emailAction = (e) => {
    setEmailError("");
    setEmail(e.target.value);
  };
  const designationAction = (e) => {
    setDesignationError("");
    setDesignation(e.target.value);
  };

  // Form Submission Action
  const saveAction = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    const data = {
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      countryCode: countryCode,
      contactNumber: contactNumber,
      email: email,
      address: address,
      gender: gender,
      designation: designation,
      userPassword: userPassword,
    };
    instance
      .post(ADDUSER, data)
      .then((response) => {
        setSaveLoading(false);
        Navigate("/drivers");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          err.response.data.errors.forEach((element) => {
            switch (element.path) {
              case "userName":
                setUnameError(element.msg);
                setSaveLoading(false);
                break;
              case "firstName":
                setFirstNameError(element.msg);
                setSaveLoading(false);
                break;
              case "lastName":
                setlastNameError(element.msg);
                setSaveLoading(false);
                break;
              case "email":
                setEmailError(element.msg);
                setSaveLoading(false);
                break;
              case "contactNumber":
                setContactNoError(element.msg);
                setSaveLoading(false);
                break;

              default:
                break;
            }
          });
        }
      });
  };

  // gathering Country Codes
  const getCountryCodes = () => {
    return COUNTRYCODES.map((res, i) => {
      return (
        <MenuItem key={i} value={res}>
          {res}
        </MenuItem>
      );
    });
  };

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          to="/"
          className="breadcrumpItem"
        >
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          to="/drivers"
          className="breadcrumpItem"
        >
          Users
        </Link>
        <Link color="text.primary" className="breadcrumpItem">
          Add User
        </Link>
      </Breadcrumbs>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <strong>Add User</strong>
      </div>
      <Form
        className="input-form"
        onSubmit={(e) => saveAction(e)}
        autoComplete="off"
      >
        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            error={unameError}
            helperText={unameError}
            inputProps={{ autoCapitalize: "words" }}
            size="small"
            label="User Name*"
            // value={userName}
            onBlur={(e) => setSearchLoader(false)}
            onChange={(e) => userNameAction(e)}
          />
          <div
            style={{
              position: "absolute",
              top: "8px",
              // transform: 'translate(0, -50%)',
              right: "10px",
            }}
          >
            {searchLoader ? <Loading /> : ""}
            {unameAvailable === "Available" ? (
              <CheckCircleIcon className="text-success" />
            ) : unameAvailable === "NotAvailable" ? (
              <DoNotDisturbAltIcon className="text-danger" />
            ) : unameAvailable === "" ? (
              ""
            ) : (
              ""
            )}
          </div>
        </div>
        <TextField
          error={firstNameError}
          helperText={firstNameError}
          inputProps={{ autoCapitalize: "words" }}
          size="small"
          label="First Name *"
          value={firstName}
          onChange={(e) => fnameAction(e)}
        />
        <TextField
          error={lastNameError}
          helperText={lastNameError}
          size="small"
          label="Last Name *"
          value={lastName}
          onChange={(e) => lastNameAction(e)}
        />
        <Form.Group className="d-flex">
          <FormControl className="d-flex" style={{ width: "100px" }}>
            <Select
              size="small"
              defaultValue={countryCode}
              onChange={(e) => setcountryCode(e.target.value)}
            >
              {getCountryCodes()}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            error={contactNoError}
            helperText={contactNoError}
            size="small"
            label="Contact Number"
            pattern="[0-9]*"
            value={contactNumber}
            onChange={(e) => contactNoAction(e)}
          />
        </Form.Group>
        <TextField
          error={emailError}
          helperText={emailError}
          size="small"
          type="email"
          label="Email Id"
          onChange={(e) => emailAction(e)}
        />
        <TextField
          size="small"
          multiline
          rows={3}
          label="Address"
          onChange={(e) => setAddress(e.target.value)}
        />

        <div>
          <FormLabel id="demo-form-control-label-placement">Gender</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="male"
            name="radio-buttons-group"
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </div>

        <FormControl fullWidth>
          <InputLabel size="small" id="demo-simple-select-label">
            Select Designation
          </InputLabel>
          <Select
            error={designationError}
            helperText={designationError}
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Select Designation"
            defaultValue={designation || ""}
            onChange={(e) => designationAction(e)}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Driver">Driver</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </FormControl>
        <div>
          <TextField
            size="small"
            defaultValue={userPassword}
            label="User Password"
            onChange={(e) => setuserPassword(e.target.value)}
          />
        </div>
        <div className="text-center">
          <LoadingButton
            loading={saveLoading}
            variant="contained"
            type="submit"
            startIcon={<SaveIcon />}
          >
            Save
          </LoadingButton>
        </div>
      </Form>
    </div>
  );
}

export default AddUser;
