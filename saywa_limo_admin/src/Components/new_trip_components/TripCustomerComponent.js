import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTabIndexState } from "../../store/Trips/TripSlice";
import {
  ALLCUSTOMERS,
  LIVECUSTOMERS,
  selectCustomer,
} from "../../store/Customers/CustomerSlice";
import { auth } from "../../Const/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  ADMIN_SIGNUP_WITH_EMAIL,
  SIGNUP_WITH_EMAIL,
} from "../../Const/ApiConst";
import { instance } from "../../Const/ApiHeader";
import { LoadingButton } from "@mui/lab";

function TripCustomerComponent() {
  const dispatch = useDispatch();
  const { customers, isLoading } = useSelector((state) => state?.customer);

  const currentTabIndex = 1;

  const [customerTypeSelector, setCustomerTypeSelector] = useState("Existing");
  const [authError, setAuthError] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  useEffect(() => {
    dispatch(ALLCUSTOMERS());
  }, []);

  const liveSearchAction = async (e) => {
    dispatch(LIVECUSTOMERS({ searchKey: e }));
  };

  const existingCustomerContainer = () => {
    return (
      <div>
        <TextField
          size="small"
          placeholder="Search..."
          onChange={(e) => liveSearchAction(e.target.value)}
        />
        <div style={{ overflow: "auto" }}>
          <table className="table table-responsive">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Customer Name</th>
                <th>Contact No</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    <CircularProgress />
                  </td>
                </tr>
              ) : (
                customers?.data?.map((res, i) => (
                  <tr key={i}>
                    <td>
                      <small>{i + 1}</small>
                    </td>
                    <td>
                      <small>{res.fullName}</small>
                    </td>
                    <td>
                      <small>{res.contact_no}</small>
                    </td>
                    <td>
                      <small>{res.email}</small>
                    </td>
                    <td>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => {
                          dispatch(selectCustomer(res));
                          dispatch(changeTabIndexState(currentTabIndex));
                        }}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const signupAction = async () => {
    setSignUpLoading(true);
    if (fullName === "") {
      setAuthError("Full name required");
      setSignUpLoading(false);
    } else if (contactNumber === "") {
      setAuthError("Contact Number required");
      setSignUpLoading(false);
    } else {
      try {
        await createUserWithEmailAndPassword(
          auth,
          authEmail,
          authPassword
        ).then((result) => {
          setSignUpLoading(false);
          sessionStorage.setItem("photoURL", "No Image");
          sessionStorage.setItem("attknres", result.user.accessToken);

          const data = {
            uid: result.user.uid,
            fullName: fullName,
            email: result.user.email,
            contactNumber: contactNumber,
            password: authPassword,
          };

          instance.post(ADMIN_SIGNUP_WITH_EMAIL, data).then((response) => {
            setAuthError("");
            dispatch(selectCustomer(response.data.data));
          });
        });
      } catch (error) {
        switch (error.message) {
          case "Firebase: Error (auth/missing-password).":
            setAuthError("Password cannot be empty");
            break;
          case "Firebase: Error (auth/invalid-email).":
            setAuthError("Invalid Email");
            break;
          case "Firebase: Password should be at least 6 characters (auth/weak-password).":
            setAuthError("Password should be at least 6 characters.");
            break;
          case "Firebase: Error (auth/email-already-in-use).":
            setAuthError("Email already in use.");
            break;
          default:
            break;
        }
        setSignUpLoading(false);
      }
    }
    dispatch(changeTabIndexState(currentTabIndex));
  };

  const newCustomerContainer = () => {
    return (
      <div>
        <div className="d-flex flex-wrap gap-3">
          <div>
            <small>Full Name</small>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <small>Contact No</small>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
          <div>
            <small>Email Id</small>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setAuthEmail(e.target.value)}
            />
          </div>
          <div>
            <small>Password</small>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setAuthPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="text-end mt-4">
          <LoadingButton
            loading={signUpLoading}
            size="small"
            variant="contained"
            onClick={() => signupAction()}
          >
            Save & Select
          </LoadingButton>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex gap-3">
        <div className="d-flex gap-1">
          <input
            type="radio"
            id="existing-customer"
            checked={customerTypeSelector === "Existing" ? true : false}
            name="customer-type"
            onClick={() => setCustomerTypeSelector("Existing")}
          />
          <label
            htmlFor="existing-customer"
            onClick={() => setCustomerTypeSelector("Existing")}
          >
            Select Existing
          </label>
        </div>
        <div className="d-flex gap-1">
          <input
            type="radio"
            id="new-customer"
            name="customer-type"
            checked={customerTypeSelector === "New" ? true : false}
            onClick={() => setCustomerTypeSelector("New")}
          />
          <label
            htmlFor="new-customer"
            onClick={() => setCustomerTypeSelector("New")}
          >
            Create New
          </label>
        </div>
      </div>
      <div className="mt-2 pt-3 pb-3">
        {customerTypeSelector === "Existing"
          ? existingCustomerContainer()
          : newCustomerContainer()}
      </div>
    </div>
  );
}

export default TripCustomerComponent;
