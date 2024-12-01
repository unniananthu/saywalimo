import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ReviewBooking from "./ReviewBooking";
import Vehicles from "./Vehicles";
import BookRide from "./BookRide";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { activeStepx } from "../store/StepperSlice";

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 25,
  height: 25,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    color: "#fff",
    background: "#c59c6c",
  }),
  ...(ownerState.completed && {
    color: "#fff",
    backgroundColor: "#c59c6c",
  }),
  ...(ownerState.end && {
    color: "#9b999a",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, end, className } = props;

  const icons = {
    1: active ? 1 : completed ? "✓" : "",
    2: active ? 2 : completed ? "✓" : "",
    3: active ? 3 : completed ? "✓" : "",
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active, end }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
ƒ   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = ["Car Classes", "Preview", "Agreement"];

export default function Reservation() {
  const { activeStep } = useSelector((state) => state?.activeStep);
  const dispatch = useDispatch();

  React.useEffect(() => {
    sessionStorage.setItem("activeStep", activeStep);

    const active = sessionStorage.getItem("activeStep");
    if (active) {
      dispatch(activeStepx(parseInt(active)));
    }
  }, [activeStep]);

  return (
    <div className="container p-3">
      <ToastContainer />
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel
                  // className="d-flex flex-column gap-3"
                  {...labelProps}
                  StepIconComponent={ColorlibStepIcon}
                  // onClick={() => changeTab(label)}
                >
                  {/* {StepperTitle(activeStep)} */}
                  <strong> {label}</strong>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <React.Fragment>
          <div className="mt-4">
            {activeStep === 0 ? (
              <Vehicles />
            ) : activeStep === 1 ? (
              <ReviewBooking />
            ) : activeStep === 2 ? (
              <BookRide />
            ) : null}
          </div>
        </React.Fragment>
      </Box>
    </div>
  );
}
