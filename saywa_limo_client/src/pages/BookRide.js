import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { newOrder } from "../store/orders/OrderSlice";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { image_instance, instance } from "../const/ApiHeader";
import { NEW_SIGNATURE, UPLOAD } from "../const/ApiConst";
import { getCustomer } from "../store/customers/CustomerSlice";
import "./bookdrive.css";
import { activeStepx } from "../store/StepperSlice";
import { ToastContainer, toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function BookRide() {
  const { data } = useSelector((state) => state?.vehicles?.vehicles);
  const navigate = useNavigate();
  const { isLoading, isSuccess, orders } = useSelector(
    (state) => state?.orders
  );

  useEffect(() => {
    sessionStorage.setItem("vehicleData", JSON.stringify(data));
  }, []);

  const justify = {
    textAlign: "justify",
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: Adds smooth scrolling animation
    });
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    const data = {
      customer_id: userID,
    };
    dispatch(getCustomer(data));
    // eslint-disable-next-line
  }, []);

  const { customers } = useSelector((state) => state?.customer);
  const { locations } = useSelector((state) => state?.locations);

  const udtlCookie = Cookies.get("udtl");
  const userID = JSON.parse(udtlCookie)?.uid || [];
  const userName = JSON.parse(udtlCookie)?.fullName || "";

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureImage, setSignatureImage] = useState(customers[0]?.signature);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState(customers[0]?.documents);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSignatureImage(customers[0]?.signature);
      setFileList(customers[0]?.documents);
    }, 100);
    // eslint-disable-next-line
  }, [customers]);

  const startDrawing = (position) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
  };

  const draw = (position) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    setSignatureImage(canvas.toDataURL());
  };

  // const getEventPosition = (e) => {
  //     const rect = canvasRef.current.getBoundingClientRect();
  //     return {
  //         x: e.clientX - rect.left,
  //         y: e.clientY - rect.top,
  //     };
  // };

  const getEventPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    let eventPosition;
    if (e?.touches && e?.touches?.length) {
      eventPosition = e.touches[0];
    } else if (e?.changedTouches && e?.changedTouches.length) {
      eventPosition = e.changedTouches[0];
    } else {
      eventPosition = e;
    }

    return {
      x: eventPosition.clientX - rect.left,
      y: eventPosition.clientY - rect.top,
    };
  };

  // const getTouchPosition = (e) => {
  //     const rect = canvasRef.current.getBoundingClientRect();
  //     const touch = e.touches[0] || e.changedTouches[0];
  //     return {
  //         x: touch.clientX - rect.left,
  //         y: touch.clientY - rect.top,
  //     };
  // };

  // const getTouchPosition = (e) => {
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const eventPosition = e.touches ? e.touches[0] : e;
  //   return {
  //     x: eventPosition.clientX - rect.left,
  //     y: eventPosition.clientY - rect.top,
  //   };
  // };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignatureImage(null);
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  // const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleChange = async ({ fileList: newFileList }) => {
    // Convert newly added files to base64
    const updatedFileList = await Promise.all(
      newFileList?.map(async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        return file;
      })
    );

    // Update the fileList
    setFileList(updatedFileList);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const [agree, setAgree] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    const data = {
      customer_id: userID,
      signature: signatureImage,
    };
    await instance
      .post(NEW_SIGNATURE, data)
      .then((response) => {})
      .catch((err) => {});
  };
  const handleCancels = () => {
    setIsModalOpen(false);
  };

  const saveNewOrder = () => {
    setSaveLoading(true);
    if (
      signatureImage === null ||
      signatureImage === undefined ||
      signatureImage === ""
    ) {
      toast.error("Please fill signature", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setSaveLoading(false);
      return;
    }
    if (fileList?.length === 0 || !fileList) {
      toast.error("Please upload image", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setSaveLoading(false);
      return;
    }
    const data = {
      source: locations?.source,
      destination: locations?.destination,
      routeNo: locations?.routeNo,
      vehicleId: locations?.vehicleId,
      customerId: customers[0]?.user_id,
      customerName: customers[0]?.fullName,
      scheduledDate: locations?.scheduleDate,
      scheduledTime: JSON.parse(sessionStorage.getItem("locationData"))
        .pickupTime,
      // scheduledTime: locations?.scheduleTime,
      shortDescription: locations?.shortDescription,
      // tripStatus: tripStatus,
      totalAmount: locations?.totalAmount,
      paymentStatus: "",
      paymentReference: "",
      paymentMode: "",
      signature: signatureImage,
      documents: fileList,
      meetAndGreet: locations.meetAndGreet,
      noOfBags: locations.noOfBags,
      noOfPassengers: locations.noOfPassengers,
      tripOccasion: locations?.tripOccasion,
      tripOccasionDetails: locations?.tripOccasionDetails,
      totalKms: locations?.totalKms,
      totalHours: locations?.hour,
      rideType: locations?.rideType,
      stops: locations?.stops,
      nightCharge: locations?.nightCharge,
      bagType: locations?.bagType,
      flightInformation: locations?.flightInformation,
      needCarSeat: locations?.needCarSeat,
      seatCount: locations?.seatCount,
      additionalInfo: locations?.additionalInfo,
      gratuiryTypeCash: locations?.gratuiryTypeCash,
      gratuityAmount: locations?.gratuityAmount,
      discount: locations?.discount,
      voucherAmount: locations?.voucherAmount,
      voucherCode: locations?.voucherCode,
      returnDate: locations?.returnDate,
      returnTime: locations?.returnTime,
      wheelChair: locations?.needWheelChair,
      carryOnBagsCount: locations?.carryOnBagsCount,
      checkedBagCount: locations?.checkedBagCount,
    };
    dispatch(newOrder(data));
    // sessionStorage.removeItem("locationData");
    // Navigate("/make-payment/" + "1ef8aa8sd8cs8es8dfs7b5df44sdf4");
  };

  useEffect(() => {
    if (isSuccess) {
      setSaveLoading(false);
      window.location.href = orders;
      // Navigate("/success");
      // Navigate("/payment/"+1111111);
    }
  }, [isSuccess]);

  return (
    <div
      className="container p-4"
      style={{ background: "#eff3e7", borderRadius: "10px" }}
    >
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
      <div>
        <h3>Rental Agreement</h3>
        <p>
          This Rental Agreement (this “Agreement”) is entered into as of the
          later of the signature dates below (the “Effective Date”), by and
          between Saywa Limo, a Washington limited liability vendor (“Vendor”),
          and Full Name, with an address at Billing Address and an email address
          at Email Address ("Customer")
        </p>
        <strong> Services: </strong>
        <ul>
          <li style={{ listStyle: "none" }}>
            Nature of Services. Throughout the Term (as defined below), the
            Vendor contracts to rent a passenger vehicle with a chauffeur to
            Customer at the hourly rate as discussed.
          </li>
        </ul>
        <strong> Cancellation: </strong>
        <ul>
          <li style={{ listStyle: "none" }}>
            If there is a need for cancellation, the customer can cancel up to
            seventy-two (72) hours before booking without a fee. Once the
            booking is within the seventy-two (72) hour mark, a fee will be
            placed consisting of the initial amount paid for the booking.
          </li>
        </ul>
        <strong> Warranty: </strong>
        <ul>
          <li style={{ listStyle: "none" }}>
            Vendor warrants that the vehicle has undergone regular maintenance
            and is in good and clean condition. The preceding warranty does not
            warrant that the vehicle will be free from unforeseen mechanical
            defects.
          </li>
        </ul>
        <strong> Payment: </strong>
        <ul>
          <li style={{ listStyle: "none" }}>
            Compensating the service provided by Vendor, Customer agrees to pay
            Final Total for the services, including tax, gratuity, and fuel
            surcharge, to be rendered for Hours of Reservation and Miles
            Provided. Any additional hours will be charged at the vehicle rate
            per hour and $6.00 per additional mile over the agreed set limit.
            Miles are based on garage to garage. All hourly reservations are
            automatically subjugated to a minimum of 20% gratuity charge that is
            provided to the chauffeur. Extra gratuity can be handed to the
            chauffeur at the client’s discretion.
          </li>
        </ul>
        <strong>Protection of Vendor’s Property &amp; Safety.</strong>
        <ul>
          <li style={{ textAlign: "justify" }}>
            <b>Protection of Property:</b>The customer agrees to pay for any/all
            damage and cleaning to the vehicle that becomes required due to the
            conduct of any person in the vehicle. Such damages include, but are
            not limited to, burns, spillage, vomiting, broken glassware,
            scratches, stains, and broken windows, seats, mirrors, etc… For such
            repairs and cleaning, Customer agrees that the charges will be
            assessed to the credit card for the individual or entity who has
            rented the vehicle. If the credit card cannot be charged, Customer
            agrees to remit payment for damages or cleaning within seven (7)
            days of the date of the event. Failure to do so will result in
            additional charges for any missed business due to the damages or
            failed cleaning that has been caused by Customer.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>Assumption of Risk by Customer:</b>Vendor does not guarantee the
            safety or assume any responsibility for any personal articles or
            items lost, stolen, damaged, or left in the vehicle. Vendor is
            additionally not responsible for delays in the vehicle’s departure
            and arrival caused by weather, road conditions, hazards, accidents,
            or other unforeseen events, including acts of God or War
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>Guarantee of Safety:</b>In the case of chauffeur negligence
            during the operation of the vehicle resulting in medical injury,
            commercial insurance covers up to $1,000,000.00 in damages. Medical
            attention must be seeked within seventy-two (72) hours of such
            negligence for commercial insurance to be applicable. Notification
            regarding such matters must be provided through writing to the
            Vendor. The customer agrees to indemnify the chauffeur and Vendor
            for any costs and fees incurred in defense of any claim made against
            them arising out of and connected to the rental of the vehicle that
            has not been proven true.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>Safety of Property:</b> As agreed, upon in 2.1, a minimum of
            $500.00 will be charged per vehicle as a cleaning fee if the vehicle
            is a mess and results in a lengthy cleanup. In addition, a minimum
            of $1,250.00 will be charged per vehicle if any damages are done to
            the vehicle or if there are any biohazardous materials that need to
            be cleaned such as bodily fluids.
          </li>
        </ul>
        <strong>Rules &amp; Special Conditions:</strong>
        <ul>
          <li style={{ textAlign: "justify" }}>
            <b>R.1:</b> Consumption of alcoholic beverages (by a minor).
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>R.2:</b> All passengers must be wearing seatbelts at all times
            while the vehicle is in motion.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>R.3:</b> Consumption of illegal drugs as well as
            marijuana/edibles.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>R.4:</b> Smoking of any substance including vaping.
          </li>
          <li style={{ textAlign: "justify" }}>
            R.5: Violent or unruly behavior.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>R.6:</b> Conduct causing, or in the chauffeur’s opinion likely to
            cause, damage to the vehicle.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>R.7:</b> Conduct interfering with, or in the chauffeur’s view
            likely to interfere with, safe operation of the vehicle.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>R.8:</b> The Vendor expressly reserves the right to terminate or
            cancel service without any refund whatsoever if the chauffeur
            observes a violation of the rules as stated above.
          </li>
        </ul>
        <strong>Termination of Agreement.</strong>
        <ul>
          <li style={{ textAlign: "justify" }}>
            <b>Term:</b> The Vender shall provide a vehicle service to the
            Customer on Date of Reservation from Pickup Location at Start of
            Reservation, to End of Reservation (the “Agreement Time”) at the
            hourly rate agreed upon above.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>Termination:</b> If the Customer breaches this contract, the
            Vendor shall be entitled to terminate service under the agreement
            immediately to be entitled to his attorney’s fees, the cost of
            collection, and costs incurred in any lawsuits arising out of or in
            connection with the said breach.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>Severability:</b> If any provisions of this contract are deemed
            void or unenforceable, the remaining provisions shall remain in full
            force and effect.
          </li>
          <li style={{ textAlign: "justify" }}>
            <b>Jurisdiction:</b> The parties agree that all terms and conditions
            stated herein shall be construed under the law of the State of
            Washington and any action or proceeding brought in connection with
            or arising out of this contract shall be within the jurisdiction of
            the Pierce County District or Pierce County Superior Courts
          </li>
        </ul>
        <ul>
          <li style={{ listStyle: "none" }}>
            <b>
              IN WITNESS WHEREOF,the parties have exeuted this Agreement as of
              the date first above written.
            </b>
          </li>
        </ul>
      </div>

      <h3 style={{ textDecoration: "underline" }}>Customer</h3>
      <div>
        <div>Signature:</div>
        <Button type="primary" onClick={showModal}>
          Sign Here
        </Button>

        {signatureImage && (
          <>
            <div>
              <img
                src={signatureImage}
                alt="Hand Signature"
                style={{ width: "100px" }}
              />
            </div>
            <div>
              <Button size="small" onClick={clearSignature}>
                Clear Signature
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="mt-4">Driver's Licence /Valid Copy of your State ID:</div>
      <div>
        <Upload
          customRequest={({ file, onSuccess, onError }) => {
            // Customize the request using the custom axios instance
            const formData = new FormData();
            formData.append("file", file);
            formData.append("custId", userID);

            image_instance
              .post(UPLOAD, formData)
              .then((response) => {
                // Handle successful response
                onSuccess(response.data);
                setFileList([...fileList, response.data]);
              })
              .catch((error) => {
                // Handle error
                onError(error);
              });
          }}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList?.length >= 8 ? null : uploadButton}
        </Upload>
      </div>
      <div>
        <input
          type="checkbox"
          id="checkbox"
          onChange={() => {
            if (signatureImage !== null || fileList?.length === 0) {
              setAgree(!agree);
            }
          }}
        />{" "}
        <label htmlFor="checkbox">
          I hereby agree to the terms and conditions outlined in the generated
          agreement.
        </label>
      </div>
      <div className=" mt-3 d-flex gap-3">
        <LoadingButton
          loading={saveLoading}
          loadingIndicator={
            <CircularProgress
              color="inherit"
              style={{ color: "#fff" }}
              size={16}
            />
          }
          variant="contained"
          style={{
            width: "200px",
            background: agree ? "#b3b3b3" : "#000000",
            color: "white",
          }}
          disabled={agree}
          onClick={() => saveNewOrder()}
        >
          {saveLoading ? "" : "Pay Now"}
        </LoadingButton>
        <Button
          variant="contained"
          style={{
            width: "200px",
            background: "#ffffff",
            border: "1px solid #000000",
            color: "black",
          }}
          onClick={() => {
            locations?.rideType === "package-trip"
              ? navigate("/")
              : dispatch(activeStepx(1));
          }}
        >
          Back
        </Button>
      </div>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>

      <Modal
        title="Signature"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancels}
      >
        <div>
          {/* <canvas
                        style={{ border: '1px solid black', width: '100%' }}
                        ref={canvasRef}
                        width={300} // Set an initial width here
                        height={200}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={endDrawing}
                    /> */}

          {/* <canvas
                        style={{ border: '1px solid black', width: '100%' }}
                        ref={canvasRef}
                        width={300} // Set an initial width here
                        height={200}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={endDrawing}
                        onMouseDown={startDrawing} // Add this line
                        onMouseMove={draw} // Add this line
                        onMouseUp={endDrawing} // Add this line
                    /> */}

          <canvas
            style={{ border: "1px solid black", width: "100%" }}
            ref={canvasRef}
            width={400} // Set an initial width here
            height={300}
            onTouchStart={(e) => startDrawing(getEventPosition(e))}
            onTouchMove={(e) => draw(getEventPosition(e))}
            onTouchEnd={endDrawing}
            onMouseDown={(e) => startDrawing(getEventPosition(e))}
            onMouseMove={(e) => draw(getEventPosition(e))}
            onMouseUp={endDrawing}
          />
        </div>
      </Modal>
    </div>
  );
}

export default BookRide;
