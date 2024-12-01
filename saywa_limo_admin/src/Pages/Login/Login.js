import { Alert, TextField } from "@mui/material";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { instance } from "../../Const/ApiHeader";
import { LOGIN } from "../../Const/ApiConst";
import { LoadingButton } from "@mui/lab";
import "./login.css";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, useFormik } from "formik";

function Login() {
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
        "Password must contain one number, and one special character"
      ),
    userId: Yup.string().required("User id required"),
  });

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  // const Navigate = useNavigate()
  const [loginLoading, setLoginLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      userId,
      password,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoginLoading(true);

      instance
        .post(LOGIN, values)
        .then((res) => {
          sessionStorage.setItem("wsstfaarvav", res.data.token);
          sessionStorage.setItem(
            "umn",
            res.data.data.firstName + " " + res.data.data.lastName
          );
          sessionStorage.setItem("des", res.data.data.designation);
          setLoginLoading(true);
          // Navigate('/')
          setLoginLoading(false);
          window.location.reload();
        })
        .catch((err) => {
          setLoginLoading(false);
        });
    },
  });
  // const onSubmit = (values) => {
  //   setLoginLoading(true);
  //   e.preventDefault();
  //   if (userId === "" || password === "") {
  //     return <Alert>Please enter details</Alert>;
  //   } else {
  //     const data = {
  //       userId: userId,
  //       password: password,
  //     };
  //     instance
  //       .post(LOGIN, data)
  //       .then((res) => {
  //         sessionStorage.setItem("wsstfaarvav", res.data.token);
  //         sessionStorage.setItem(
  //           "umn",
  //           res.data.data.firstName + " " + res.data.data.lastName
  //         );
  //         sessionStorage.setItem("des", res.data.data.designation);
  //         setLoginLoading(true);
  //         // Navigate('/')
  //         setLoginLoading(false);
  //         window.location.reload();
  //       })
  //       .catch((err) => {
  //         setLoginLoading(false);
  //       });
  //   }
  // };

  const loginContainer = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  };
  return (
    <div className="login-form  llxggsdf">
      <Form
        onSubmit={formik.handleSubmit}
        className="d-flex flex-column gap-4 llxxdcc"
        style={loginContainer}
      >
        <div
          style={{ fontSize: "18px", fontWeight: "bolder" }}
          className="text-center"
        >
          Login
        </div>
        <TextField
          size="small"
          label="User ID"
          id="userId"
          name="userId"
          autoComplete="userId"
          value={formik.values.userId}
          onChange={formik.handleChange}
          onBlur={() => formik.setFieldTouched("userId", true)}
        />
        <div className="error text-danger">
          {formik.touched.userId && formik.errors.userId}
        </div>
        <TextField
          size="small"
          type="password"
          label="Password"
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={() => formik.setFieldTouched("password", true)}
        />
        <div className="error text-danger">
          {formik.touched.password && formik.errors.password}
        </div>
        <LoadingButton
          className="reserveButtonHome"
          loading={loginLoading}
          onClick={formik.handleSubmit}
          variant="contained"
        >
          Login
        </LoadingButton>
      </Form>
    </div>
  );
}

export default Login;
