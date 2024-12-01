import { Breadcrumbs, TextField } from "@mui/material";
import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";
import { imageInstance } from "../../Const/ApiHeader";
import { ADDVEHICLE } from "../../Const/ApiConst";
import { Link, useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./Vehicle.css";
import CancelIcon from "@mui/icons-material/Cancel";
import { LoadingButton } from "@mui/lab";

function AddVehicle() {
  const Navigate = useNavigate();
  // States
  const [vehicleName, setVehicleName] = useState("");
  const [feature, setFeature] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [baseDistance, setBaseDistance] = useState("");
  const [pricePerUnitDistance, setPricePerUnitDistance] = useState("");
  const [pricePerUnitHour, setPricePerUnitHour] = useState("");
  const [description, setDescription] = useState("");
  const [imges, setImges] = useState([]);
  const [imagesPreviews, setImagePreviews] = useState([]);
  const [vehicleNo, setVehicleNo] = useState("");
  const [maxPersons, setMaxPersons] = useState("");
  const [maxBags, setMaxBags] = useState("");
  const [addBtnLoading, setAddBtnLoading] = useState(false);
  // Error States
  const [vehicleNameError, setVehicleNameError] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [basePriceError, setBasePriceError] = useState("");
  const [baseDistanceError, setBaseDistanceError] = useState("");
  const [pricePerUnitDistanceError, setPricePerUnitDistanceError] =
    useState("");
  const [pricePerUnitHourError, setPricePerUnitHourError] = useState("");

  const saveAction = (e) => {
    e.preventDefault();
    setAddBtnLoading(true);
    const data = {
      vehicleName: vehicleName,
      feature: feature,
      basePrice: basePrice,
      baseDistance: baseDistance,
      pricePerUnitDistance: pricePerUnitDistance,
      pricePerUnitHour: pricePerUnitHour,
      description: description,
      vehicleNo: vehicleNo,
    };

    const formData = new FormData();
    for (let i = 0; i < imges.length; i++) {
      formData.append("images", imges[i]);
    }
    // formData.append('images', imges)
    formData.append("vehicleName", vehicleName);
    formData.append("feature", feature);
    formData.append("basePrice", basePrice);
    formData.append("baseDistance", baseDistance);
    formData.append("pricePerUnitDistance", pricePerUnitDistance);
    formData.append("pricePerUnitHour", pricePerUnitHour);
    formData.append("description", description);
    formData.append("vehicleNo", vehicleNo);
    formData.append("maxPersons", maxPersons);
    formData.append("maxBags", maxBags);

    imageInstance
      .post(ADDVEHICLE, formData)
      .then((response) => {
        setAddBtnLoading(false);
        Navigate("/Vehicles");
      })
      .catch((err) => {
        err?.response?.data?.errors.forEach((element) => {
          switch (element.path) {
            case "vehicleName":
              setVehicleNameError(element.msg);
              break;

            default:
              break;
          }
        });
      });
  };

  const vehicleImagePreviewContainer = {
    position: "relative",
    margin: "10px",
    border: "2px solid white",
    padding: "2px",
    borderRadius: "5px",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
  };
  const vehicleImagePreview = {
    height: "100px",
  };

  // Delete Image Action
  const deleteImageAction = (i) => {
    const updatedFilesPreview = imagesPreviews
      .slice(0, i)
      .concat(imagesPreviews.slice(i + 1));
    const updatedFiles = imges.slice(0, i).concat(imges.slice(i + 1));
    setImges(updatedFiles);
    setImagePreviews(updatedFilesPreview);
  };
  const uploadImage = (e) => {
    const selectedFiles = e.target.files;
    const selectedPreviews = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setImges([...imges, ...selectedFiles]);
    setImagePreviews([...imagesPreviews, ...selectedPreviews]);
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
          to="/Vehicles"
          className="breadcrumpItem"
        >
          Vehicles
        </Link>
        <Link color="text.primary" className="breadcrumpItem">
          New Vehicles
        </Link>
      </Breadcrumbs>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <strong>Vehicles</strong>
      </div>
      <hr />
      <Form
        onSubmit={(e) => saveAction(e)}
        autoComplete="off"
        encType="multipart/form-data"
      >
        <Form.Label className="text-secondary">
          <strong>Information</strong>
        </Form.Label>
        <Row className="">
          <Col className="col-12 col-md-6 mt-4">
            <TextField
              error={vehicleNameError}
              helperText={vehicleNameError}
              fullWidth
              size="small"
              label="Car Name"
              onChange={(e) => setVehicleName(e.target.value)}
            />
          </Col>
          <Col className="mt-4">
            <TextField
              error={featureError}
              helperText={featureError}
              fullWidth
              size="small"
              label="Vehicle Licence"
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="col-12 col-md-4 mt-4">
            <TextField
              error={featureError}
              helperText={featureError}
              fullWidth
              size="small"
              label="Max Persons Allowed"
              onChange={(e) => setMaxPersons(e.target.value)}
            />
          </Col>
          <Col className="col-12 col-md-4 mt-4">
            <TextField
              error={featureError}
              helperText={featureError}
              fullWidth
              size="small"
              label="Max Bags Allowed"
              onChange={(e) => setMaxBags(e.target.value)}
            />
          </Col>
          <Col className="mt-4">
            <TextField
              error={featureError}
              helperText={featureError}
              fullWidth
              size="small"
              label="Feature"
              onChange={(e) => setFeature(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="col-12 col-md-6 mt-4">
            <TextField
              error={basePriceError}
              helperText={basePriceError}
              fullWidth
              size="small"
              label="Base Price"
              onChange={(e) => setBasePrice(e.target.value)}
            />
          </Col>
          <Col className="mt-4">
            <TextField
              error={baseDistanceError}
              helperText={baseDistanceError}
              fullWidth
              size="small"
              label="Distance for Base Fare"
              onChange={(e) => setBaseDistance(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className="col-12 col-md-6 mt-4">
            <TextField
              error={pricePerUnitDistanceError}
              helperText={pricePerUnitDistanceError}
              fullWidth
              size="small"
              label="Price per Unit Distance"
              onChange={(e) => setPricePerUnitDistance(e.target.value)}
            />
          </Col>
          <Col className="mt-4">
            <TextField
              error={pricePerUnitHourError}
              helperText={pricePerUnitHourError}
              fullWidth
              size="small"
              label="Price per Unit Hour"
              onChange={(e) => setPricePerUnitHour(e.target.value)}
            />
          </Col>
        </Row>
        {/* <Row className='mb-4'>
                    <Col>
                        <Row>
                            <Col>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label="Price per Unit Distance" />
                            </Col>
                            <Col>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label="Price per Unit Distance" />
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            size='small'
                            label="Small Description" />
                    </Col>
                </Row> */}
        <Form.Label className="text-secondary mt-4">
          <strong>Images</strong>
        </Form.Label>
        <div className="d-flex align-items-center flex-wrap">
          {imagesPreviews.map((res, i) => (
            <div style={vehicleImagePreviewContainer} key={i}>
              <CancelIcon
                color="error"
                style={{
                  position: "absolute",
                  right: "-5px",
                  top: "-5px",
                  cursor: "pointer",
                }}
                onClick={(e) => deleteImageAction(i)}
              />

              {/* {console.log(res.FileList)} */}
              <img src={res} alt="" style={vehicleImagePreview} />
            </div>
          ))}
          <div className="upload-button-container">
            <input
              type="file"
              multiple
              style={{
                opacity: 1,
              }}
              className="upload-input"
              accept="image/*"
              onChange={uploadImage}
            />
            <FaCloudUploadAlt style={{ fontSize: "60px", color: "#808080" }} />
            <strong>Drag & Drop or Browse file</strong>
          </div>
        </div>

        <div className="text-center mt-4">
          <LoadingButton
            loading={addBtnLoading}
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

export default AddVehicle;
