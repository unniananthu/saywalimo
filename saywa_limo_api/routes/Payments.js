const stripe = require("stripe")(process.env.STRIPE_KEY);
const express = require("express");
const Trips = require("../models/Trips");
const CUSTOMERMODAL = require("../models/Customers");
const VEHICLES = require("../models/Vehicles");
const router = express.Router();
const nodemailer = require("nodemailer");
const REFERALS = require("../models/Referals");
const Vehicle = require("./Vehicles");

const PDFDocument = require("pdfkit");

// Use express.raw() to get the raw request body
router.use(express.raw({ type: "application/json" }));

const fs = require("fs").promises;
const path = require("path");
const processs = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const Customers = require("../models/Customers");

// Webhook to handle Stripe events
router.post("/webhook", async (req, res) => {
  var custID = "";
  const endpointSecret = process.env.STRIPE_WEBHOOK;

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Manually extract the raw body from the request
    const rawBody = req.body.toString("utf8");
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (
    event.type === "payment_intent.created" &&
    event.data.object.receipt_email !== null
  ) {
    // Mail setup
    let transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST_NAME,
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.AUTH_EMAIL_USER,
        pass: process.env.AUTH_EMAIL_PASSWORD,
      },
    });
    var amount = parseFloat(event.data.object.amount) / 10000;
    const mailOptions = {
      from: `"Saywa Limo" <${process.env.CONTACT_EMAIL}>`,
      to: event.data.object.receipt_email,
      subject: "New Trip Created",
      html: `<p style="text-align: left;">Dear ${
        event.data.object.metadata.custName
      },</p>
      <p style="text-align: left;">Your documents have been verified. We will assign a driver and send you another email.</p>
      <p style="text-align: left;">You have a pending payment of <strong>$${
        event.data.object.amount / 100
      } </strong>for the trip number <strong>${
        event.data.object.metadata.tripNo
      }</strong>. To complete the payment, please click the link below:</p>
          <table style="border-collapse: collapse; width: 100%;" border="1">
        <thead>
          <tr>
            <th style="width: 20%;">Order No</th>
            <th style="width: 20%;">Pick up location</th>
            <th style="width: 20%;">Drop off location</th>
            <th style="width: 20%;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="width: 20%;">${event.data.object.metadata.tripNo}</td>
            <td style="width: 20%;">${event.data.object.metadata.source}</td>
            <td style="width: 20%;">${
              event.data.object.metadata.destination
            }</td>
            <td style="width: 20%;">$${event.data.object.amount / 100}</td>
          </tr>
        </tbody>
      </table>
      <p  style="padding-top:16px"><a style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;" href="${
        process.env.CLIENT_URL
      }/payment/${event.data.object.client_secret}/${
        event.data.object.metadata.tripID
      }">Pay Now</a></p>
       
      <p>If you have any questions or concerns, please don't hesitate to contact us at ${
        process.env.CONTACT_EMAIL
      }.</p>
      <p>Thank you for your business!</p>
    </div>`,
    };
  } else if (event.type === "charge.succeeded") {
    const session = event.data.object;
  } else if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // await stripe.invoices.pay(event.data.object.metadata.invoiceId);
    const paymentIntentId = session.payment_intent;
    const name = session.name;

    const invoiceData = event.data.object.metadata;

    const query = { paymentId: event.data.object.id };
    const data = {
      paymentReference: paymentIntentId,
    };

    const tripCount = (await Trips.find()).length;
    const zeroPad = (num, places) => String(num).padStart(places, "0");
    const tripData = new Trips({
      no: tripCount + 1,
      tripNo: zeroPad(tripCount + 1, 4),
      // invoiceId: invoice.id,
      source: invoiceData.source,
      destination: invoiceData.destination,
      routeNo: invoiceData.routeNo,
      vehicleId: invoiceData.vehicleId,
      customerId: invoiceData.customerId,
      customerName: invoiceData.customerName,
      scheduledDate: invoiceData.scheduledDate,
      scheduledTime: invoiceData.scheduledTime,
      shortDescription: invoiceData.shortDescription,
      tripStatus: "Pending",
      totalAmount: invoiceData.totalAmount,
      paymentStatus: invoiceData.paymentStatus,
      paymentId: session.id,
      paymentReference: "",
      paymentMode: invoiceData.paymentMode,
      noOfPassengers: invoiceData.noOfPassengers,
      noOfBags: invoiceData.noOfBags,
      // signature: invoiceData.signature,
      // documents: invoiceData.documents,
      meetAndGreet: invoiceData.meetAndGreet,
      tripOccasion: invoiceData.tripOccasion,
      tripOccasionDetails: invoiceData.tripOccasionDetails,
      totalKms: invoiceData.totalKms,
      stops: invoiceData.stops,
      scheduleDate: invoiceData.scheduleDate,
      scheduleTime: invoiceData.scheduleTime,
      rideType: invoiceData.rideType,
      totalHours: invoiceData.totalHours,
      bagType: invoiceData.bagType,
      flightInformation: invoiceData.flightInformation,
      needCarSeat: invoiceData.needCarSeat,
      seatCount: JSON.parse(invoiceData.seatCount),
      additionalInfo: invoiceData.additionalInfo,
      gratuiryTypeCash: invoiceData.gratuiryTypeCash,
      gratuityAmount: invoiceData.gratuityAmount,
      discount: invoiceData.discount,
      paymentReference: paymentIntentId,
      nightCharge: invoiceData.nightCharge,
      walletAmount: invoiceData.voucherAmount,
      referalCode: invoiceData.voucherCode,
      returnDate: invoiceData?.returnDate,
      returnTime: invoiceData?.returnTime,
      wheelChair: invoiceData?.wheelChair,
      carryOnBagsCount: invoiceData?.carryOnBagsCount,
      checkedBagCount: invoiceData?.checkedBagCount,
    });

    if (
      invoiceData.voucherCode !== "" ||
      invoiceData.voucherCode !== null ||
      invoiceData.voucherCode !== undefined
    ) {
      await REFERALS.updateOne(
        { referal_code: invoiceData.voucherCode },
        { status: "applied" }
      );
    }

    if (
      invoiceData.walletBalance !== 0 ||
      invoiceData.walletBalance !== "" ||
      invoiceData.walletBalance !== null ||
      invoiceData.walletBalance !== undefined
    ) {
      await CUSTOMERMODAL.updateOne(
        { user_id: invoiceData.customerId },
        { wallet_balance: 0 }
      );
    }
    // if (
    //   invoiceData.walletBalance !== 0 ||
    //   invoiceData.walletBalance !== "" ||
    //   invoiceData.walletBalance !== null ||
    //   invoiceData.walletBalance !== undefined
    // ) {
    //   await CUSTOMERMODAL.updateOne(
    //     { user_id: invoiceData.customerId },
    //     { $inc: { wallet_balance: -parseInt(invoiceData.walletBalance) } }
    //   );
    // }

    const tripdata = await tripData.save();

    sendTripSuccessMailToAdmin(tripdata);
    // await Trips.findOneAndUpdate(query, data);

    sendTripSuccessMailToClient(tripdata);

    authorize().then(listEvents).catch(console.error);

    const convertedTime = convertDateTimeToISO(
      tripData.scheduledDate,
      tripData.scheduledTime
    );

    async function listEvents(auth) {
      const calendar = google.calendar({ version: "v3", auth });
      const tripTime = `${tripData.scheduledDate} ${tripData.scheduledTime}:00-07:00`;

      const vehicleData = await VEHICLES.find({ _id: tripData.vehicleId });
      const custData = await CUSTOMERMODAL.find({
        user_id: tripData.customerId,
      });

      const event = {
        summary: `Saywa - ${tripData?.customerName} - ${vehicleData[0].vehicleName}`,
        location: `${tripData.source}`,
        description: `<b>New Trip Added by ${tripData.customerName}</b> <p></p><hr/>Phone : <b>${custData[0].contact_no}</b>    \n Pickup:<b> ${tripData.source}</b>  \nDropoff : <b>${tripData.destination}</b> \nVehicle : <b>${vehicleData[0].vehicleName}</b> \n Bags : <b>${tripData.noOfBags}</b> \n Passengers: <b>${tripData.noOfPassengers}</b> \n Meet and Greet: <b>${tripData.meetAndGreet}</b> \n Notes: <b>${tripData.shortDescription}</b>`,
        start: {
          dateTime: convertedTime,
          timeZone: "America/Los_Angeles",
        },
        end: {
          dateTime: convertedTime,
          timeZone: "America/Los_Angeles",
        },

        attendees: [{ email: custData[0].email }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 10 },
          ],
        },
      };

      calendar.events.insert(
        {
          auth: auth,
          calendarId: "primary",
          resource: event,
        },
        function (err, event) {
          if (err) {
            console.log(
              "There was an error contacting the Calendar service: " + err
            );
            return;
          }

          return;
        }
      );
    }
  }

  res.status(200).json({ received: true });
});

function convertDateTimeToISO(date, time) {
  const zeroPad = (num, places) => String(num).padStart(places, "0");

  const newDate = date.split("-");
  const timeWithoutAMPM = time.split(" ");

  var newHour = "";
  var tempnewHour = timeWithoutAMPM[0].split(":");
  var newTime = tempnewHour[1];
  if (timeWithoutAMPM[1] === "PM") {
    newHour = zeroPad(parseInt(tempnewHour[0]) + 12, 2);
  } else {
    newHour = zeroPad(parseInt(tempnewHour[0]), 2);
  }
  return `${newDate[2]}-${newDate[0]}-${
    parseInt(newDate[1]) - 1
  }T${newHour}:${newTime}:00-07:00`;
}
async function sendTripSuccessMailToClient(tripData) {
  // mail setup
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST_NAME,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.AUTH_EMAIL_USER,
      pass: process.env.AUTH_EMAIL_PASSWORD,
    },
  });

  const custDatax = await CUSTOMERMODAL.find({
    user_id: tripData.customerId,
  });

  // JJJJJJ  NOTE HERE

  const tripDatas = await Trips.find({ _id: tripData._id });
  // Done
  const query = {
    _id: tripData._id,
  };
  const customer = await Trips.find(query).limit(1);
  const custData = await Customers.find({
    user_id: tripData.customerId,
  }).limit(1);

  await sendEmail(custData[0].email, customer, tripDatas, custData);
}

async function sendTripSuccessMailToAdmin(tripData) {
  const custDatax = await CUSTOMERMODAL.find({
    user_id: tripData.customerId,
  });
  // mail setup
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST_NAME,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.AUTH_EMAIL_USER,
      pass: process.env.AUTH_EMAIL_PASSWORD,
    },
  });

  // const query = { paymentId: paymentID };
  // const tripData = await Trips.find(query).limit(1);

  //   Mail Data
  const mailOptions = {
    from: `"Saywa Limo" <${process.env.NO_REPLY}>`,
    to: `${process.env.ADMIN_MAIL},${process.env.CONTACT_EMAIL}`,
    subject: "New trip received",
    html: `<table
    width="100%"
    id="m_-4521581668634247801outer_wrapper"
    style="background-color: #f7f7f7"
    bgcolor="#f7f7f7"
  >
    <tbody>
      <tr>
        <td></td>
        <td width="600">
          <div
            id="m_-4521581668634247801wrapper"
            dir="ltr"
            style="margin: 0 auto; padding: 70px 0; width: 100%; max-width: 600px"
            width="100%"
          >
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              height="100%"
              width="100%"
            >
              <tbody>
                <tr>
                  <td align="center" valign="top">
                    <div id="m_-4521581668634247801template_header_image"></div>
                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      width="100%"
                      id="m_-4521581668634247801template_container"
                      style="
                        background-color: #fff;
                        border: 1px solid #dedede;
                        border-radius: 3px;
                      "
                      bgcolor="#fff"
                    >
                      <tbody>
                        <tr>
                          <td align="center" valign="top">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              id="m_-4521581668634247801template_header"
                              style="
                                background-color: #000000;
                                color: #fff;
                                border-bottom: 0;
                                font-weight: bold;
                                line-height: 100%;
                                vertical-align: middle;
                                font-family: 'Helvetica Neue', Helvetica, Roboto,
                                  Arial, sans-serif;
                                border-radius: 3px 3px 0 0;
                              "
                              bgcolor="#0c9991"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    id="m_-4521581668634247801header_wrapper"
                                    style="padding: 36px 48px; display: block"
                                  >
                                    <h1
                                      style="
                                        font-family: 'Helvetica Neue', Helvetica,
                                          Roboto, Arial, sans-serif;
                                        font-size: 30px;
                                        font-weight: 300;
                                        line-height: 150%;
                                        margin: 0;
                                        text-align: left;
                                        color: #fff;
                                        background-color: inherit;
                                      "
                                      bgcolor="inherit"
                                    >
                                      New Booking
                                    </h1>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="top">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              id="m_-4521581668634247801template_body"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    valign="top"
                                    id="m_-4521581668634247801body_content"
                                    style="background-color: #fff"
                                    bgcolor="#fff"
                                  >
                                    <table
                                      border="0"
                                      cellpadding="20"
                                      cellspacing="0"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            valign="top"
                                            style="padding: 48px 48px 32px"
                                          >
                                            <div
                                              id="m_-4521581668634247801body_content_inner"
                                              style="
                                                color: #636363;
                                                font-family: 'Helvetica Neue',
                                                  Helvetica, Roboto, Arial,
                                                  sans-serif;
                                                font-size: 14px;
                                                line-height: 150%;
                                                text-align: left;
                                              "
                                              align="left"
                                            >
                                            <p>Dear ${custDatax[0].fullName},</p>
                                              <p style="margin: 0 0">
                                                Thank you for your booking. We will provide you with regular updates on the status of your trip.
                                              </p>
                                              <br />
                                              <h2
                                                style="
                                                  color: #00000;
                                                  display: block;
                                                  font-family: 'Helvetica Neue',
                                                    Helvetica, Roboto, Arial,
                                                    sans-serif;
                                                  font-size: 18px;
                                                  font-weight: bold;
                                                  line-height: 130%;
                                                  margin: 0 0;
                                                  text-align: left;
                                                  margin-bottom:10px
                                                "
                                              >
                                                Trip Information

                                              </h2>
                                              
                                              <ul>
                                              <li>
                                              Passenger Name: ${tripData.customerName}
                                              </li>
                                              <li>
                                                Trip Type: ${tripData.rideType}
                                              </li>
                                              <li>
                                                Departure :  ${tripData.source} 
                                                  </li>
                                         
                                             <li>
                                                Destination: ${tripData.destination}
                                              </li> 
                                              <li>
                                                Departure Time : ${tripData.scheduledDate}, ${tripData.scheduledTime} 
                                              </li>
                                              </ul>
                                             
                                            
  
                                              <p></p>
                                              <div
                                                style="
                                                  display: flex;
                                                  justify-content: center;
                                                "
                                              >
                                                <a
                                                  href="https://admin.saywalimo.com/trip_action/${tripData._id}"
                                                  style="
                                                    text-decoration: none;
                                                    color: #ffffff;
                                                  "
                                                  ><div
                                                    style="
                                                      background: #c19b65;
                                                      padding: 10px;
                                                      border-radius: 10px;
                                                      width: 200px;
                                                      text-align: center;
                                                    "
                                                  >
                                                    <strong>View trip</strong>
                                                  </div></a
                                                >
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
  `,
  };

  //   Send Action
  transporter.sendMail(mailOptions);
}

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = path.join(processs.cwd(), "tokenx.json");
const CREDENTIALS_PATH = path.join(processs.cwd(), "google_cal.json");
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}
async function authorize(tripdata) {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

const generateInvoice = async (customer, tripData, custData) => {
  const doc = new PDFDocument();
  const pdfPath = path.join(__dirname, "invoice.pdf");

  doc.pipe(fs.createWriteStream(pdfPath));
  let nightCharge = false;
  let TimeAndAMPMData = customer[0].scheduledTime.split(" ");
  console.log("TimeAndAMPMData", TimeAndAMPMData);
  if (TimeAndAMPMData.length > 0) {
    timeData = TimeAndAMPMData[0].split(":");
    if (parseInt(timeData[0]) == 10 || parseInt(timeData[0]) == 11) {
      if (TimeAndAMPMData[1] == "PM") {
        nightCharge = true;
      } else {
        nightCharge = false;
      }
    } else if (parseInt(timeData[0]) == 12 || 1 || 2 || 3 || 4 || 5) {
      if (
        parseInt(
          timeData[0] == 5 && timeData[1] <= 45 && TimeAndAMPMData[1] == "AM"
        )
      ) {
        nightCharge = true;
      } else if (TimeAndAMPMData[1] == "AM") {
        nightCharge = true;
      } else {
        nightCharge = false;
      }
    }
  }

  // Arrived
  const totalValue = await VehiclesRateCalc(
    customer[0]?.vehicleId.toString(),
    tripData,
    nightCharge
  );
  const vehicleinfo = await Vehicle.findOne({
    _id: customer[0]?.vehicleId.toString(),
  });

  // doc.pipe(fs.createWriteStream(filePath));
  const logoimage = path.join(__dirname, "logo.png");
  doc
    .fillColor("#444444")
    .image(`${logoimage}`, 55, 57, { width: 100 })
    .moveDown();
  doc
    .fillColor("#444444")
    .fontSize(20)
    // .text("Saywa", 55, 57)

    .fontSize(10)
    .text("3009 Bridgeport Way West", 55, 105)
    .text("Tacoma, WA 98466", 55, 118)
    .text("reservations@saywalimo.com", 55, 131)
    .text("877-206-0780", 55, 144)

    .fontSize(10)
    // .text("Seattle", 200, 105, { align: "right" })
    // .text("US", 200, 120, { align: "right" })
    .moveDown();

  doc
    .fillColor("#000000")
    .fontSize(20)
    .text("INVOICE", 50, 180, { align: "center" });
  generateHr(doc, 200);

  const customerInformationTop = 220;

  doc
    .fontSize(10)
    .text("Invoice no:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(customer[0]?.tripNo, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(
      formatDate(new Date(tripData[0].created_at)),
      150,
      customerInformationTop + 15
    )

    .text("Bill to:", 300, customerInformationTop)
    .font("Helvetica-Bold")
    .text(tripData[0].customerName, 350, customerInformationTop)
    .font("Helvetica")
    .text(custData[0].email, 350, customerInformationTop + 14)
    .text(custData[0].contact_no, 350, customerInformationTop + 28)

    .moveDown();

  const invoiceTableTop = 230;

  doc
    .font("Helvetica-Bold")
    .text("#", 50, invoiceTableTop + 60)
    .text("Quantity", 75, invoiceTableTop + 60)
    .text("Description", 125, invoiceTableTop + 60)
    .text("Price", 325, invoiceTableTop + 60, { align: "right" });
  generateHr(doc, invoiceTableTop + 80);

  const destination =
    customer[0]?.rideType === "hourly-trip"
      ? ""
      : ` to ${customer[0]?.destination}`;

  const onewayTrip =
    "Transfer Ride starting at " +
    customer[0]?.scheduledDate +
    ", " +
    customer[0]?.scheduledTime +
    " from " +
    customer[0]?.source +
    destination;
  doc
    .font("Helvetica")
    .text("1", 70, invoiceTableTop + 90)
    .text("1", 95, invoiceTableTop + 90)
    .text(onewayTrip, 125, invoiceTableTop + 90, { align: "left" })
    .text("$" + parseInt(customer[0]?.totalAmount), 300, invoiceTableTop + 90, {
      align: "right",
    });
  generateHr(doc, invoiceTableTop + 180);
  const BaseRatePosition = invoiceTableTop + 200;

  const discountPrice = customer[0]?.discount
    ? parseInt(customer[0]?.discount)
    : 0;

  generateTableRow(
    doc,
    BaseRatePosition,
    "",
    "",
    "Sub Total",
    "",
    `$ ${parseInt(customer[0]?.totalAmount) + discountPrice}`
  );

  const primeTimePosition = BaseRatePosition + 20;
  generateTableRow(
    doc,
    primeTimePosition,
    "",
    "",
    "Discount",
    "",
    discountPrice
  );

  const duePosition = primeTimePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Grand Total",
    "",
    `$ ${customer[0]?.totalAmount}`
  );
  doc.font("Helvetica");
  doc.moveDown(1);
  doc.text("Best regards,", 50);
  doc.moveDown();
  doc.text("Saywa Team", 50);
  doc.moveDown(2);
  doc.font("Helvetica-Bold");
  doc.text("Terms and Conditions");
  doc.font("Helvetica");
  doc.moveDown();
  doc.text(
    "If weather/road conditions become harsh and hazardous. An extra surcharge will be billed to the client depending on the extent of conditions.For airport pickups, we provide an hour standby.",
    50
  );
  doc.moveDown(1);
  doc.text(
    "For regular reservations, a 30 minute standby is provided, afterwards standby will be charged. $95 for Sedan. $115 for SUV. Cancellations made within 3 hours of the reservation are charged full fare. No shows is the same concept with no refund. The driver has the right to decline a reservation if the client hasn't shown up for 1 hour since the scheduled pickup time. Changes made within 3 hours of the reservation will be charged as standby. By paying this invoice, the client agrees to these terms and conditions.",
    50
  );

  doc.end();

  const fileName = "invoice.pdf";
};

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y, { width: 500 })
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    // .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

async function sendEmail(email, customer, tripData, custData) {
  await generateInvoice(customer, tripData, custData);
  // mail setup

  const vehicleData = await Vehicle.find({ _id: customer[0].vehicleId });

  const mailOptions = {
    from: `"Saywa" <${process.env.CONTACT_EMAIL}>`,
    to: email,
    subject: "Thank You for Riding with Saywa! ---LL",
    text: `<table
    width="100%"
    id="m_-4521581668634247801outer_wrapper"
    style="background-color: #f7f7f7"
    bgcolor="#f7f7f7"
  >
    <tbody>
      <tr>
        <td></td>
        <td width="600">
          <div
            id="m_-4521581668634247801wrapper"
            dir="ltr"
            style="margin: 0 auto; padding: 70px 0; width: 100%; max-width: 600px"
            width="100%"
          >
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              height="100%"
              width="100%"
            >
              <tbody>
                <tr>
                  <td align="center" valign="top">
                    <div id="m_-4521581668634247801template_header_image"></div>
                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      width="100%"
                      id="m_-4521581668634247801template_container"
                      style="
                        background-color: #fff;
                        border: 1px solid #dedede;
                        border-radius: 3px;
                      "
                      bgcolor="#fff"
                    >
                      <tbody>
                        <tr>
                          <td align="center" valign="top">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              id="m_-4521581668634247801template_header"
                              style="
                                background-color: #000000;
                                color: #fff;
                                border-bottom: 0;
                                font-weight: bold;
                                line-height: 100%;
                                vertical-align: middle;
                                font-family: 'Helvetica Neue', Helvetica, Roboto,
                                  Arial, sans-serif;
                                border-radius: 3px 3px 0 0;
                              "
                              bgcolor="#0c9991"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    id="m_-4521581668634247801header_wrapper"
                                    style="padding: 36px 48px; display: block"
                                  >
                                    <h1
                                      style="
                                        font-family: 'Helvetica Neue', Helvetica,
                                          Roboto, Arial, sans-serif;
                                        font-size: 30px;
                                        font-weight: 300;
                                        line-height: 150%;
                                        margin: 0;
                                        text-align: left;
                                        color: #fff;
                                        background-color: inherit;
                                      "
                                      bgcolor="inherit"
                                    >
                                      New Trip
                                    </h1>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="top">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              id="m_-4521581668634247801template_body"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    valign="top"
                                    id="m_-4521581668634247801body_content"
                                    style="background-color: #fff"
                                    bgcolor="#fff"
                                  >
                                    <table
                                      border="0"
                                      cellpadding="20"
                                      cellspacing="0"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            valign="top"
                                            style="padding: 48px 48px 32px"
                                          >
                                            <div
                                              id="m_-4521581668634247801body_content_inner"
                                              style="
                                                color: #636363;
                                                font-family: 'Helvetica Neue',
                                                  Helvetica, Roboto, Arial,
                                                  sans-serif;
                                                font-size: 14px;
                                                line-height: 150%;
                                                text-align: left;
                                              "
                                              align="left"
                                            >
                                              <p style="margin: 0 0">
                                                  Dear ${customer[0].customerName}
                                              </p>
                                              <p style="text-align:justify">Thank you for choosing Saywa for your recent ride! We hope you had a pleasant experience.
   </p>
                                              <p style="text-align:justify">Your feedback is invaluable to us in our efforts to continually improve our service. Did we meet your expectations? Please share any suggestions on how we can enhance your experience next time.
   </p>
                                              <p style="text-align:justify">
                                               Your ride has been charged to the payment method selected during booking, so no further action is required from you. Attached to this email, you will find a copy of your invoice for your reference.

                                              </p>
                                             
                                              <p>
                                              	<table style="width:100%">
                                                  <tr style="background:#f0f0f0 ">
                                                    <td style="text-align:start; padding:10px">Booking Number :
                                                    <td style="text-align:start; padding:10px">${tripData[0].tripNo}
                                                  </tr> 
                                                  <tr style="background:#f0f0f0 ">
                                                    <td style="text-align:start; padding:10px">Date and time :
                                                    <td style="text-align:start; padding:10px">${tripData[0].scheduledDate} ${tripData[0].scheduledTime}
                                                  </tr>
                                                  <tr style="background:#f0f0f0 ">
                                                    <td style="text-align:start; padding:10px">From :
                                                    <td style="text-align:start; padding:10px">${tripData[0].source}
                                                  </tr>
                                                  <tr style="background:#f0f0f0 ">
                                                    <td style="text-align:start; padding:10px">To :
                                                    <td style="text-align:start; padding:10px">${tripData[0].destination}
                                                  </tr>
                                                  <tr style="background:#f0f0f0 ">
                                                    <td style="text-align:start; padding:10px">Distance :
                                                    <td style="text-align:start; padding:10px">${tripData[0].totalKms}
                                                  </tr>
                                                   <tr style="background:#f0f0f0 ">
                                                    <td style="text-align:start; padding:10px">Price :
                                                    <td style="text-align:start; padding:10px">${tripData[0].totalAmount}
                                                  </tr>
                                                   <tr style="background:#f0f0f0 ">
                                                    <td style="text-align:start; padding:10px">Vehicle :
                                                    <td style="text-align:start; padding:10px">${vehicleData[0]?.vehicleName}
                                                  </tr>
                                                   
                                                     <tr style="background:#f0f0f0 ">
                                                    <td style="text-align:start; padding:10px">Mobile :
                                                    <td style="text-align:start; padding:10px">${custData[0].contact_no}
                                                  </tr>
                                                   <tr style="background:#f0f0f0 ">
                                                    <td style="text-align:start; padding:10px">Email :
                                                    <td style="text-align:start; padding:10px">${email}
                                                  </tr>
                                              </table>
                                              <p>Safe travels!</p>
                                              <p>
                                                Best regards,<br />Saywa Limo
                                              </p>
  
                                              <br />
                                               <div>
                                            <b>About Saywa</b><br/>
                                            <p style="text-align:justify">
 Seattle’s premier luxury transportation provider specializing exclusively in airport transfers. Established in 2023, Saywa has built a solid reputation as the leading choice for limousine and luxury transportation services in Seattle.</p>
											<p style="text-align:justify"> Our services are tailored specifically for airport transfers, ensuring a seamless and luxurious experience for our clients. With a focus on corporate travel and special events, Saywa offers sleek and stylish vehicles paired with exceptional service and attention to detail. Choose Saywa for a truly extraordinary and memorable transportation experience.</p>
                                            <p>

 <p>TRAVEL:<br/></p>

 <p>Luxury Transportation Services | Saywa: Explore Destinations in Style</p>
											<p style="text-align:justify">
                                            Discover seamless travel experiences with Saywa’s luxury transportation services. Whether for corporate events, special celebrations, or reliable transportation needs, trust Saywa to take you in comfort and style. From bustling city centers to serene countryside retreats, Saywa is your trusted partner for exploring diverse destinations effortlessly. Begin your journey with Saywa and experience travel redefined.</p>

                                            </div>
                                            </div>
                                           
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
  `,
    attachments: [
      {
        filename: "invoice.pdf",
        path: __dirname + "/invoice.pdf",
        contentType: "application/pdf",
      },
    ],
  };

  // Send email
  try {
    handleSendEmailAttachment(mailOptions);
    // const info = await transporter.sendMail(mailOptions);

    // fs.unlink(__dirname + "/invoice.pdf", (err) => {
    //   if (err) {
    //     console.error("Error deleting invoice.pdf:", err);
    //   } else {
    //     console.log("Invoice.pdf deleted successfully.");
    //   }
    // });
    // console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = router;
