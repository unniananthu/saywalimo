import React from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DateTimePicker({
  setCurrentDate,
  setPickupDateError,
  setPickupTime,
  pickupTimeError,
  pickupDateError,
}) {
  const [value, setValue] = React.useState(dayjs(new Date()));
  const [flagDateSeting, setFlagDateSeting] = useState(true);
  const [toDayDate, setToDayDate] = useState();
  const [formtPickDate, setFormtPickDate] = useState();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [disableDate, setDisableDate] = useState();

  const dateSeleted = (e) => {
    setValue(e);
    const pickDate = format(e.$d, "MM/dd/yyyy");
    setFormtPickDate(pickDate);
    flagChecking();
    if (toDayDate <= pickDate) { 
      setFromData({ ...formData, ["inputDate"]: pickDate });
    } else { 
    }
  };

  const currentDate = new Date();
  const startHour = flagDateSeting
    ? (currentDate.getMinutes() + 90) % 60 <= 30
      ? currentDate.getHours() + Math.floor(90 / 60) + 1
      : currentDate.getHours() + Math.floor(90 / 60)
    : 0;
  const startMinute = flagDateSeting ? (currentDate.getMinutes() + 90) % 60 : 0;

  const resetHour =
    (startHour >= 23 && startMinute >= 45) || startHour >= 24 ? 0 : startHour;
  const restMinute =
    (startHour >= 23 && startMinute >= 45) || startHour >= 24 ? 0 : startMinute;

  useEffect(() => {
    const checkCondition = () => {
      return (startHour >= 23 && startMinute >= 45) || startHour >= 24;
    };
    if (checkCondition()) {
      // If condition is met, update the date to tomorrow
      const newDateTime = new Date(currentDateTime);
      newDateTime.setDate(currentDateTime.getDate() + 1);
      setValue(dayjs(newDateTime));
      setDisableDate(dayjs(newDateTime));
    }
  }, []); 

  const sHour =
    restMinute >= 0 && restMinute <= 15
      ? resetHour
      : restMinute > 15 && restMinute <= 30
      ? resetHour
      : restMinute > 30 && restMinute <= 45
      ? resetHour
      : restMinute < 59 && restMinute >= 46
      ? resetHour + 1
      : "";

  const sMinute =
    restMinute == 0
      ? 0
      : restMinute >= 0 && restMinute <= 15
      ? 15
      : restMinute > 15 && restMinute <= 30
      ? 30
      : restMinute > 30 && restMinute <= 45
      ? 45
      : restMinute <= 59 && restMinute > 45
      ? 0
      : "";

  // const sHour=startMinute>=0&&startMinute<=15?startHour
  //             :startMinute>15&&startMinute<=30?startHour
  //             :startMinute>30&&startMinute<=45?startHour
  //             :startMinute<59&&startMinute>=46?startHour+1:""

  // const sMinute=startMinute==0?0
  //             :startMinute>=0&&startMinute<=15?15
  //             :startMinute>15&&startMinute<=30?30
  //             :startMinute>30&&startMinute<=45?45
  //             :startMinute<=59&&startMinute>45?0:""

  const timeSlots = Array.from(
    new Array((24 - sHour) * 4 - Math.floor(sMinute / 15))
  ).map((_, index) => {
    // const currentHour = sHour + Math.floor(index / 2);
    // const currentMinute = (sMinute + (index % 2 )  * 15) % 60;
    const totalMinutes = sMinute + index * 15;
    const currentHour = (sHour + Math.floor(totalMinutes / 60)) % 24;
    const currentMinute = totalMinutes % 60;
    let period = "AM";

    if (currentHour >= 12) {
      period = "PM";
    }

    const formattedHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
    const formattedMinute = currentMinute === 0 ? "00" : currentMinute;

    return `${formattedHour}:${formattedMinute} ${period}`;
  }); 
  const [formData, setFromData] = useState({
    inputDate: "",
    inputTime: timeSlots.length > 0 ? timeSlots[0] : "",
  });
  const [valueTime, setValueTime] = useState(timeSlots[0]);
  if (formData.inputDate !== "") {
    setCurrentDate(formData.inputDate);
    setPickupDateError("");
  }
  if (formData.inputTime !== "") {
    setPickupTime(formData.inputTime);
  }

  const flagChecking = () => {
    if (formtPickDate == toDayDate) {
      setFlagDateSeting(true);
    } else {
      setFlagDateSeting(false);
    }
  };

  useEffect(() => {
    setToDayDate(format(new Date(), "MM/dd/yyyy"));
  }, []);
  useEffect(() => {
    flagChecking();
    setFromData({ ...formData, ["inputDate"]: value.format("MM-DD-YYYY") });
  }, [formtPickDate]);
  const timePicker = (e) => {
    setValueTime(e.target.innerText);
    setFromData({ ...formData, ["inputTime"]: e.target.textContent });
  };

  const submitFrom = () => {
    const { inputTime } = formData;
    if (inputTime === "") {
      toast.error("candent book today date please change date", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        // transition: Bounce,
      });
    } else { 
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div className="d-flex flex-column pkp-container w-100">
          <small>Pickup Date</small>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker", "DatePicker"]}
              style={{
                width: "100%",
              }}
            >
              <DatePicker
                // label="Pickup Date"
                sx={{
                  width: 332,
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
                value={value}
                disablePast
                minDate={disableDate}
                onChange={(newValue) => dateSeleted(newValue)}
                // fullWidth
              />
            </DemoContainer>
          </LocalizationProvider>
          <div className="text-danger">{pickupDateError}</div>
        </div>
        <div className="d-flex flex-column pkp-container w-100">
          <small>Pickup Time</small>
          <Autocomplete
            id="disabled-options-demo"
            options={timeSlots.length > 0 ? timeSlots : []}
            sx={{
              width: 332,
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputBase-input": {
                color: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            clearIcon={false}
            value={valueTime}
            renderInput={(params) => <TextField {...params} />}
            onChange={(e) => {
              timePicker(e);
            }}
          />
          <div className="text-danger">
            {pickupTimeError && pickupTimeError}
          </div>
        </div>
        {/* <Button
          variant="outlined"
          onClick={() => {
            submitFrom();
          }}
        >
          Submit
        </Button> */}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        // transition: Bounce,
      />
    </div>
  );
}

export default DateTimePicker;
