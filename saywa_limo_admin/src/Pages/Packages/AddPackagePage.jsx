import { Checkbox, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVehicles } from "../../store/Vehicles/VehicleSlice";
import { IMAGE_BASE_URL } from "../../Const/ApiConst";
import { Button } from "react-bootstrap";
import {
  DELETE_IMAGE_PACKAGE_SLICE_ITEM,
  GET_SINGLE_PACKAGE_SLICE_ITEM,
  NEW_PACKAGE_SLICE_ITEM,
} from "../../store/Packages/PackageSlice";
import { useNavigate, useParams } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import { FaCloudUploadAlt } from "react-icons/fa";

function AddPackagePage() {
  const [PackageName, setPackageName] = useState("");
  const [TourLength, setTourLength] = useState(0);
  const [TotalPerson, setTotalPerson] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("Visible");
  const [Description, setDescription] = useState("");
  const [eventType, setEventType] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehiclePrices, setVehiclePrices] = useState({});
  const [imges, setImges] = useState([]);
  const [imagesPreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setEventType([...eventType, value]);
    } else {
      setEventType(eventType.filter((item) => item !== value));
    }
  };

  const handlePriceChange = (e, vehicleId) => {
    const price = e.target.value;
    setVehiclePrices((prevPrices) => ({ ...prevPrices, [vehicleId]: price }));

    setVehicles((prevVehicles) => {
      const vehicleIndex = prevVehicles.findIndex(
        (vehicle) => vehicle._id === vehicleId
      );
      if (vehicleIndex !== -1) {
        const updatedVehicles = prevVehicles.map((vehicle) =>
          vehicle._id === vehicleId ? { ...vehicle, price } : vehicle
        );
        return updatedVehicles;
      }
      return prevVehicles;
    });
  };

  const handleChangeVehicle = (e, vehicle) => {
    const { checked } = e.target;
    const price = vehiclePrices[vehicle._id] || "";

    if (checked) {
      setVehicles([
        ...vehicles,
        {
          _id: vehicle._id,
          vehicleNo: vehicle?.vehicleNo,
          name: vehicle.vehicleName,
          price,
          maxPersons: "2",
          maxBags: vehicle?.maxBags,
          feature: vehicle?.feature,
          basePrice: price,
          baseDistance: vehicle?.baseDistance,
          pricePerUnitDistance: vehicle?.pricePerUnitDistance,
          pricePerUnitHour: vehicle?.pricePerUnitHour,
          description: vehicle?.description,
          status: vehicle?.status,
          images: vehicle?.images,
        },
      ]);
    } else {
      setVehicles(vehicles.filter((item) => item._id !== vehicle._id));
    }
  };

  const { allVehicleList } = useSelector((state) => state?.vehicle);
  const { singlePackageItem } = useSelector((state) => state?.packages);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const data = {
        id: id,
      };
      dispatch(GET_SINGLE_PACKAGE_SLICE_ITEM(data)).then((res) => {
        // singlePackageItem;

        if (res.type === "get-single-packages/fulfilled") {
          setPackageName(res.payload[0]?.PackageName);
          setTotalPerson(res.payload[0]?.TotalPerson);
          setTourLength(res.payload[0]?.TourLength);
          setDescription(res.payload[0]?.Description);
          setVehicles(res.payload[0]?.vehicles);
          setEventType(res.payload[0]?.eventType);
        }
      });
    }
  }, []);

  useEffect(() => {
    dispatch(getAllVehicles());
  }, [dispatch]);

  const uploadImage = (e) => {
    const selectedFiles = e.target.files;
    const selectedPreviews = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setImges([...imges, ...selectedFiles]);
    setImagePreviews([...imagesPreviews, ...selectedPreviews]);
  };
  const deleteImageAction = (i) => {
    const updatedFilesPreview = imagesPreviews
      .slice(0, i)
      .concat(imagesPreviews.slice(i + 1));
    const updatedFiles = imges.slice(0, i).concat(imges.slice(i + 1));
    setImges(updatedFiles);
    setImagePreviews(updatedFilesPreview);
  };

  const saveNewPackage = () => {
    const formData = new FormData();
    for (let i = 0; i < imges.length; i++) {
      formData.append("images", imges[i]);
    }
    formData.append("id", id ? id : null);
    formData.append("PackageName", PackageName);
    formData.append("TourLength", TourLength);
    formData.append("TotalPerson", TotalPerson);
    formData.append("selectedStatus", selectedStatus);
    formData.append("Description", Description);
    formData.append("eventType", JSON.stringify(eventType));
    formData.append("vehicles", JSON.stringify(vehicles));
    formData.append("vehiclePrices", JSON.stringify(vehiclePrices));

    dispatch(NEW_PACKAGE_SLICE_ITEM(formData));
    navigate("/packages");
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

  return (
    <div>
      <div className="row mb-3 ">
        <div className="col-12 col-md-6">
          <label className="text-secondary">Package Name</label>
          <Input
            value={PackageName}
            onChange={(e) => setPackageName(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <label>Package Image</label>
          <div className="d-flex align-items-center flex-wrap">
            {singlePackageItem[0]?.PackageImage.length !== 0 && (
              <div style={vehicleImagePreviewContainer}>
                <CancelIcon
                  color="error"
                  style={{
                    position: "absolute",
                    right: "-5px",
                    top: "-5px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    dispatch(
                      DELETE_IMAGE_PACKAGE_SLICE_ITEM({
                        id: singlePackageItem[0]?._id,
                        image: singlePackageItem[0]?.PackageImage,
                      })
                    );
                  }}
                />
                {
                  <img
                    src={singlePackageItem[0]?.PackageImage[0]?.url}
                    style={vehicleImagePreview}
                  />
                }
              </div>
            )}
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
              <FaCloudUploadAlt
                style={{ fontSize: "60px", color: "#808080" }}
              />
              <strong>Drag & Drop or Browse file</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-4">
          <label className="text-secondary">Tour Length</label>
          <Input
            value={TourLength}
            onChange={(e) => setTourLength(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6 mt-4">
          <label className="text-secondary">Total Person</label>
          <Input
            value={TotalPerson}
            onChange={(e) => setTotalPerson(e.target.value)}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className=" col-12 col-md-6 d-flex flex-column ">
          <label className="text-secondary">Status</label>
          <Select
            value={selectedStatus}
            options={[
              { value: "Visible", label: "Visible" },
              { value: "Hidden", label: "Hidden" },
            ]}
            onChange={(value) => setSelectedStatus(value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="text-secondary">Small Description</label>
          <Input.TextArea
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="text-secondary">Choose Event</label>
        <div className="row">
          <div className="col-12 col-md-4">
            <Checkbox
              value="Half Day Tour"
              checked={eventType.includes("Half Day Tour")}
              onChange={handleChange}
            >
              Half Day Tour
            </Checkbox>
          </div>
          <div className="col-12 col-md-4">
            <Checkbox
              value="Full Day Tour"
              checked={eventType.includes("Full Day Tour")}
              onChange={handleChange}
            >
              Full Day Tour
            </Checkbox>
          </div>
          <div className="col-12 col-md-4">
            <Checkbox
              value="Birthday/Quincera"
              checked={eventType.includes("Birthday/Quincera")}
              onChange={handleChange}
            >
              Birthday/Quincera
            </Checkbox>
          </div>
          <div className="col-12 col-md-4">
            <Checkbox
              value="Wedding Shuttle & Wedding Send-off"
              checked={eventType.includes("Wedding Shuttle & Wedding Send-off")}
              onChange={handleChange}
            >
              Wedding Shuttle & Wedding Send-off
            </Checkbox>
          </div>
          <div className="col-12 col-md-4">
            <Checkbox
              value="Concerts"
              checked={eventType.includes("Concerts")}
              onChange={handleChange}
            >
              Concerts
            </Checkbox>
          </div>
          <div className="col-12 col-md-4">
            <Checkbox
              value="Sporting Events"
              checked={eventType.includes("Sporting Events")}
              onChange={handleChange}
            >
              Sporting Events
            </Checkbox>
          </div>
          <div className="col-12 col-md-4">
            <Checkbox
              value="Day Night"
              checked={eventType.includes("Day Night")}
              onChange={handleChange}
            >
              Day Night
            </Checkbox>
          </div>
          <div className="col-12 col-md-4">
            <Checkbox
              value="Wine Tasting"
              checked={eventType.includes("Wine Tasting")}
              onChange={handleChange}
            >
              Wine Tasting
            </Checkbox>
          </div>
        </div>
      </div>
      <div>
        <label className="text-secondary">Choose Vehicle</label>
        <div className="d-flex flex-wrap gap-4">
          {allVehicleList.map((res, i) => (
            <div key={i} className="vehicle-checkbox">
              <Checkbox
                checked={vehicles.some((vehicle) => vehicle._id === res._id)}
                onChange={(e) => {
                  handleChangeVehicle(e, res);
                }}
                value={res._id}
              >
                <div>
                  <strong>{res.vehicleName}</strong>
                </div>
                <img
                  src={`${IMAGE_BASE_URL}${res.images[0]}`}
                  alt=""
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "contain",
                  }}
                />
                <div className="text-center">
                  {vehicles.find((vehicle) => vehicle._id === res._id)?.price ||
                    ""}
                </div>
                <div className="mt-2">
                  <Input
                    type="number"
                    placeholder="Price"
                    // value="SSSS"
                    onChange={(e) => handlePriceChange(e, res._id, res)}
                  />
                </div>
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <Button style={{ width: "200px" }} onClick={saveNewPackage}>
          {id ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default AddPackagePage;
