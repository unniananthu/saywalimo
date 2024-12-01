import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth, provider } from "../../const/Firebase";
import Cookies from "js-cookie";
import { instance } from "../../const/ApiHeader";
import {
  SIGNUP_WITH_EMAIL,
  SIGN_IN_WITH_GOOGLE,
  CHECK_EXIST_USER,
} from "../../const/ApiConst";
import { Form } from "react-bootstrap";
import { Alert, Button, TextField } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import loginImage from "../../images/login_image.png";
import { useDispatch } from "react-redux";
import { authRefresh } from "../../store/AuthStateSlice";
import * as yup from "yup";
import { useFormik } from "formik";

function Login() {
  const [authFormTitle, setAuthFormTitle] = useState("Sign in");
  const [authError, setAuthError] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [signUpContainer, setSignUpContainer] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [restPasswordLoading, setRestPasswordLoading] = useState(false);
  const [restEmailError, setRestEmailError] = useState();
  const [passwordResetSuccessmessage, setPasswordResetSuccessmessage] =
    useState(false);
  const [googleSigninButtonLoading, setGoogleSigninButtonLoading] =
    useState(false);

  const [newUserUpdateName, setNewUserUpdateName] = useState();
  const [newUserNameBox, setNewUserNameBox] = useState();

  const validationSchema = yup.object({
    fullName: yup.string().required("User Name is Required"),
    phoneNumber: yup
      .string()
      .matches(/^([0-9] ?){9,13}[0-9]$/, "Enter a valid phone number"),
  });
  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        instance
          .post(SIGN_IN_WITH_GOOGLE, { ...newUserUpdateName, ...values })
          .then((result) => {
            // if(result.status>=200&& result.status<300){
            //   setLgShow(true)
            // }
            setGoogleSigninButtonLoading(true);
            dispatch(authRefresh(true));
            setTimeout(() => {
              dispatch(authRefresh(false));
            }, 100);
            // window.location.reload()

         
            const data = {
              uid: result.data[0].user_id,
              fullName: result.data[0].fullName,
              email: result.data[0].email,
              phoneNumber: result.data[0].contact_no,
              userImage: result.data[0].userImage,
            };
        
            // sessionStorage.setItem('udtl', JSON.stringify(data))
            Cookies.set("photoURL", result.data[0].userImage, { expires: 7 });
            Cookies.set("udtl", JSON.stringify(data), { expires: 7 });
            dispatch(authRefresh(true));
            setTimeout(() => {
              dispatch(authRefresh(false));
            }, 100);
            // window.location.reload()
            // Navigate('/Review_Booking', { state: TripData })
          });

        
      } catch (error) {
        console.error("submission failed", error);
      }
    },
  });
  useEffect(() => {
    if (newUserUpdateName) {
      formik.setValues({
        fullName: newUserUpdateName?.fullName,
        phoneNumber: newUserUpdateName?.phoneNumber,
      });
    }
  }, [newUserUpdateName]);

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
          };

          Cookies.set("udtl", JSON.stringify(data), { expires: 7 });
          instance.post(SIGNUP_WITH_EMAIL, data).then((response) => {
            setAuthError("");
            setSignUpContainer(false);
            Cookies.set("udtl", JSON.stringify(data), { expires: 7 });
            Cookies.set("photoURL", "No Image");
            // sessionStorage.setItem('udtl', )
            // window.location.reload()
            // Navigate('/Review_Booking', { state: TripData })
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
  };

  const signUpForm = () => {
    if (signUpContainer === false) {
      return (
        <>
          {newUserNameBox ? (
            <div>
              <img src={loginImage} alt="" style={{ width: "20rem" }} />
              <form onSubmit={formik.handleSubmit}>
                <Form.Control
                  className="my-1"
                  placeholder="User Name"
                  id={"fullName"}
                  name={"fullName"}
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("fullName", true)}
                />
                <div className="text-danger error">
                  {formik.touched.fullName && formik.errors.fullName}
                </div>
                <Form.Control
                  className="my-1"
                  placeholder="Phone Number"
                  id={"phoneNumber"}
                  name={"phoneNumber"}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("phoneNumber", true)}
                />
                <div className="text-danger error">
                  {formik.touched.phoneNumber && formik.errors.phoneNumber}
                </div>
                <Button
                  className="my-2"
                  variant="contained"
                  style={{ background: "black" }}
                  // onClick={() => newUserUpdateNameSignup()}
                  onClick={formik.handleSubmit}
                >
                  Update Profile
                </Button>
              </form>
            </div>
          ) : (
            <div>
              <img src={loginImage} alt="" style={{ width: "20rem" }} />
              <Form.Control
                placeholder="Email"
                onChange={(e) => setAuthEmail(e.target.value)}
              />
              <div style={{ padding: "5px" }}></div>
              <Form.Control
                placeholder="Password"
                type="password"
                onChange={(e) => setAuthPassword(e.target.value)}
              />
              <div style={{ padding: "5px" }}></div>
              <Button
                variant="contained"
                style={{ background: "black" }}
                onClick={() => loginAction()}
              >
                Login
              </Button>
              <div
                className="text-end text-primary"
                style={{ cursor: "pointer", fontSize: "13px" }}
                onClick={() =>
                  setAuthFormTitle("Reset Password") +
                  setSignUpContainer("restPassword")
                }
              >
                {" "}
                Forgot password?{" "}
              </div>
              <div style={{ fontSize: "13px" }}>
                Don't have an account?{" "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer", fontSize: "13px" }}
                  onClick={() =>
                    setAuthFormTitle("Sign Up") + setSignUpContainer(true)
                  }
                >
                  Click Here
                </span>{" "}
                to signup
              </div>
            </div>
          )}
        </>
      );
    } else if (signUpContainer === "restPassword") {
      return (
        <>
          <TextField
            error={restEmailError}
            helperText={restEmailError}
            size="small"
            label="Reset Password"
            onChange={(e) =>
              setRestEmailError("") + setResetPasswordEmail(e.target.value)
            }
          />
          {passwordResetSuccessmessage ? (
            <Alert>Password reset mail send to your email</Alert>
          ) : (
            ""
          )}
          <Button
            loading={restPasswordLoading}
            variant="contained"
            onClick={() => restPasswordAction()}
          >
            Reset Password
          </Button>
          <div style={{ fontSize: "13px" }} className="mt-2">
            Already have an account?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer", fontSize: "13px" }}
              onClick={() =>
                setAuthFormTitle("Sign In") + setSignUpContainer(false)
              }
            >
              Click Here
            </span>
            to Login
          </div>
        </>
      );
    } else {
      return (
        <>
          <Form.Control
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
          />
          <Form.Control
            placeholder="Contact Number"
            // type="number"
            maxLength={12}
            pattern="[0-9]+"
            onChange={(e) => setContactNumber(e.target.value)}
          />
          <Form.Control
            placeholder="Email"
            onChange={(e) => setAuthEmail(e.target.value)}
          />
          <Form.Control
            placeholder="Password"
            type="password"
            onChange={(e) => setAuthPassword(e.target.value)}
          />
          <Button
            loading={signUpLoading}
            variant="outlined"
            onClick={() => signupAction()}
          >
            Sign Up
          </Button>
          <div style={{ fontSize: "13px" }}>
            Already have an account? &nbsp;
            <span
              className="text-primary"
              style={{ cursor: "pointer", fontSize: "13px" }}
              onClick={() =>
                setAuthFormTitle("Sign In") + setSignUpContainer(false)
              }
            >
              Click Here
            </span>
            &nbsp; to Login
          </div>
        </>
      );
    }
  };

  const restPasswordAction = async () => {
    setRestPasswordLoading(true);
    if (resetPasswordEmail === "") {
      setRestEmailError("Please enter email");
    } else {
      try {
        await sendPasswordResetEmail(auth, resetPasswordEmail)
          .then((res) => {
            setPasswordResetSuccessmessage(true);
            setRestPasswordLoading(false);
          })
          .catch((err) => {});
      } catch (error) {}
    }
  };

  const dispatch = useDispatch();

  const loginAction = async () => {
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword)
        .then((response) => {
          sessionStorage.setItem("photoURL", "No Image");
          sessionStorage.setItem("udtl", JSON.stringify(response));
          const data = {
            uid: response.user.uid,
            fullName: response.user.displayName,
            email: response.user.email,
            phoneNumber: response.user.phoneNumber,
            userImage: response.user.photoURL,
          };
          Cookies.set("photoURL", "No Image", { expires: 7 });
          Cookies.set("udtl", JSON.stringify(data), { expires: 7 });
          dispatch(authRefresh(true));
          setTimeout(() => {
            dispatch(authRefresh(false));
          }, 100);
          // window.location.reload()
        })
        .catch((err) => {
          if (err.message === "Firebase: Error (auth/user-not-found)") {
            setAuthError("User Not found");
          } else {
            setAuthError("Username or password are not matching");
          }
        });
    } catch (error) {}
  };

  const signInGoogle = () => {
    setGoogleSigninButtonLoading(true);
    // signInWithGoogle
    signInWithPopup(auth, provider)
      .then((result) => {
        sessionStorage.setItem("photoURL", result.user.photoURL);
        const data = {
          uid: result.user.uid,
          fullName: result.user.displayName,
          email: result.user.email,
          phoneNumber: result.user.phoneNumber,
          userImage: result.user.photoURL,
        };

        setNewUserUpdateName(data);

        const googleEmailData = {
          email: result?.user.email,
        };

        instance.post(CHECK_EXIST_USER, googleEmailData).then((result) => {
          
          if (result.data == "Exist") {
          
            setNewUserNameBox(false);
           
            instance.post(SIGN_IN_WITH_GOOGLE, data).then((result) => {
              // if(result.status>=200&& result.status<300){
              //   setLgShow(true)
              // }
              setGoogleSigninButtonLoading(true);
              dispatch(authRefresh(true));
              setTimeout(() => {
                dispatch(authRefresh(false));
              }, 100);
              // window.location.reload()

              
              const data = {
                uid: result.data[0].user_id,
                fullName: result.data[0].fullName,
                email: result.data[0].email,
                phoneNumber: result.data[0].contact_no,
                userImage: result.data[0].userImage,
              };
           
              // sessionStorage.setItem('udtl', JSON.stringify(data))
              Cookies.set("photoURL", result.data[0].userImage, { expires: 7 });
              Cookies.set("udtl", JSON.stringify(data), { expires: 7 });
              dispatch(authRefresh(true));
              setTimeout(() => {
                dispatch(authRefresh(false));
              }, 100);
              // window.location.reload()
              // Navigate('/Review_Booking', { state: TripData })
            });
            // // sessionStorage.setItem('udtl', JSON.stringify(data))
            //   Cookies.set("photoURL", result.user.photoURL, { expires: 7 });
            //   Cookies.set("udtl", JSON.stringify(data), { expires: 7 });
            //   dispatch(authRefresh(true));
            //   setTimeout(() => {
            //     dispatch(authRefresh(false));
            //   }, 100);
            //   // window.location.reload()
            //   // Navigate('/Review_Booking', { state: TripData })
          } else {
           
            setNewUserNameBox(true);
          }
        });
        // instance.post(SIGN_IN_WITH_GOOGLE, data).then((result) => {
        //   // if(result.status>=200&& result.status<300){
        //   //   setLgShow(true)
        //   // }
        //   setGoogleSigninButtonLoading(true);
        //   dispatch(authRefresh(true));
        //   setTimeout(() => {
        //     dispatch(authRefresh(false));
        //   }, 100);
        //   // window.location.reload()
        // });

        // // sessionStorage.setItem('udtl', JSON.stringify(data))
        // Cookies.set("photoURL", result.user.photoURL, { expires: 7 });
        // Cookies.set("udtl", JSON.stringify(data), { expires: 7 });
        // dispatch(authRefresh(true));
        // setTimeout(() => {
        //   dispatch(authRefresh(false));
        // }, 100);
        // // window.location.reload()
        // // Navigate('/Review_Booking', { state: TripData })
      })
      .catch((error) => {});
  }; 
  const newUserUpdateNameSignup = () => { 
    // instance.post(SIGN_IN_WITH_GOOGLE, data).then((result) => {
    //   // if(result.status>=200&& result.status<300){
    //   //   setLgShow(true)
    //   // }
    //   setGoogleSigninButtonLoading(true);
    //   dispatch(authRefresh(true));
    //   setTimeout(() => {
    //     dispatch(authRefresh(false));
    //   }, 100);
    //   // window.location.reload()
    // });
    // // sessionStorage.setItem('udtl', JSON.stringify(data))
    //   Cookies.set("photoURL", result.user.photoURL, { expires: 7 });
    //   Cookies.set("udtl", JSON.stringify(data), { expires: 7 });
    //   dispatch(authRefresh(true));
    //   setTimeout(() => {
    //     dispatch(authRefresh(false));
    //   }, 100);
    //   // window.location.reload()
    //   // Navigate('/Review_Booking', { state: TripData })
  };

  return (
    <div>
      <div className="text-center d-flex flex-column gap-2">
        {authError ? <Alert severity="error">{authError}</Alert> : ""}
        <h4 className="text-center mb-4">
          <strong>{authFormTitle}</strong>
        </h4>
        {signUpForm()}
        {newUserNameBox ? (
          ""
        ) : (
          <div>
            <div className="d-flex">
              <hr className="w-100" />
              <div style={{ fontSize: "14px", fontWeight: "600" }}>Or</div>
              <hr className="w-100" />
            </div>
            <div>
              <Button
                loading={googleSigninButtonLoading}
                variant="outlined"
                startIcon={<FcGoogle style={{ background: "#fff" }} />}
                onClick={() => signInGoogle()}
              >
                Google
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
