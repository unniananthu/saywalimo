import { Breadcrumbs, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";
import { imageInstance, instance } from "../../Const/ApiHeader";
import {
  DELETE_VEHICLE_IMAGE,
  GET_SINGLE_VEHICLE,
  IMAGE_BASE_URL,
  UPDATE_VEHICLE,
  UPDATE_VEHICLE_IMAGE,
} from "../../Const/ApiConst";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./Vehicle.css";
import CancelIcon from "@mui/icons-material/Cancel";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import VehicleSlice, {
  setSingleVehicle,
} from "../../store/Vehicles/VehicleSlice";

function UpdateVehicle() {
  const Navigate = useNavigate();

  //   Redux
  const params = useParams();

  // States
  const [vehicleDetails, setVehicleDetails] = useState([]);
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
  const [status, setStatus] = useState("Live");
  // Error States
  const [vehicleNameError, setVehicleNameError] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [basePriceError, setBasePriceError] = useState("");
  const [baseDistanceError, setBaseDistanceError] = useState("");
  const [pricePerUnitDistanceError, setPricePerUnitDistanceError] =
    useState("");
  const [pricePerUnitHourError, setPricePerUnitHourError] = useState("");

  const dispatch = useDispatch();
  const { singleVehicle } = useSelector((state) => state?.vehicle);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = {
        vhid: params.id,
      };
      const vehicleData = await instance.post(GET_SINGLE_VEHICLE, data);
      dispatch(setSingleVehicle(vehicleData.data[0]));
      setVehicleDetails(vehicleData.data[0]);
      setVehicleName(vehicleData.data[0].vehicleName);
      setVehicleNo(vehicleData.data[0].vehicleNo);
      setMaxPersons(vehicleData.data[0].maxPersons);
      setMaxBags(vehicleData.data[0].maxBags);
      setFeature(vehicleData.data[0].feature);
      setBasePrice(vehicleData.data[0].basePrice);
      setBaseDistance(vehicleData.data[0].baseDistance);
      setPricePerUnitDistance(vehicleData.data[0].pricePerUnitDistance);
      setPricePerUnitHour(vehicleData.data[0].pricePerUnitHour);
      setImagePreviews(vehicleData.data[0].images);
      setStatus(vehicleData.data[0].status);
    } catch (error) {
      console.log(error);
    }
  };

  const saveAction = (e) => {
    e.preventDefault();
    setAddBtnLoading(true);
    const data = {
      id: params.id,
      vehicleName: vehicleName,
      feature: feature,
      basePrice: basePrice,
      baseDistance: baseDistance,
      pricePerUnitDistance: pricePerUnitDistance,
      pricePerUnitHour: pricePerUnitHour,
      description: description,
      vehicleNo: vehicleNo,
      maxPersons: maxPersons,
      maxBags: maxBags,
      status: status,
    };

    const formDatas = new FormData();
    for (let i = 0; i < imges.length; i++) {
      formDatas.append("images", imges[i]);
    }
    // formData.append('images', imges)
    formDatas.append("id", params.id);
    formDatas.append("vehicleName", vehicleName);
    formDatas.append("feature", feature);
    formDatas.append("basePrice", basePrice);
    formDatas.append("baseDistance", baseDistance);
    formDatas.append("pricePerUnitDistance", pricePerUnitDistance);
    formDatas.append("pricePerUnitHour", pricePerUnitHour);
    formDatas.append("description", description);
    formDatas.append("vehicleNo", vehicleNo);
    formDatas.append("maxPersons", maxPersons);
    formDatas.append("maxBags", maxBags);
    formDatas.append("status", status);

    try {
      instance
        .post(UPDATE_VEHICLE, data)
        .then((response) => {
          setAddBtnLoading(false);
          Navigate("/Vehicles");
        })
        .catch((err) => {
          err.response.data.errors.forEach((element) => {
            switch (element.path) {
              case "vehicleName":
                setVehicleNameError(element.msg);
                break;

              default:
                break;
            }
          });
        });
    } catch (error) {
      console.log(error);
    }
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
  const deleteImageAction = async (i, res) => {
    const updatedFilesPreview = imagesPreviews
      .slice(0, i)
      .concat(imagesPreviews.slice(i + 1));
    const updatedFiles = imges.slice(0, i).concat(imges.slice(i + 1));
    setImges(updatedFiles);
    setImagePreviews(updatedFilesPreview);
    const data = {
      vhid: params.id,
      imgid: res,
    };
    await instance.post(DELETE_VEHICLE_IMAGE, data);
    loadData();
  };

  const uploadImage = async (e) => {
    const selectedFiles = e.target.files;

    const selectedPreviews = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setImges([...imges, ...selectedFiles]);
    setImagePreviews([...imagesPreviews, ...selectedPreviews]);

    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }

    formData.append("id", params.id);

    await imageInstance.post(UPDATE_VEHICLE_IMAGE, formData);
    loadData();
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
          Update Vehicles
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
        <Row>
          <Col className="col-12 col-md-6 mt-4">
            {""}
            <TextField
              value={vehicleName}
              error={vehicleNameError}
              helperText={vehicleNameError}
              fullWidth
              size="small"
              label="Car Name"
              onChange={(e) => setVehicleName(e.target.value)}
            />
          </Col>
          <Col className="mt-4">
            {""}
            <TextField
              value={vehicleNo}
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
            {""}
            <TextField
              value={maxPersons}
              error={featureError}
              helperText={featureError}
              fullWidth
              size="small"
              label="Max Persons Allowed"
              onChange={(e) => setMaxPersons(e.target.value)}
            />
          </Col>
          <Col className="col-12 col-md-4 mt-4">
            {""}
            <TextField
              value={maxBags}
              error={featureError}
              helperText={featureError}
              fullWidth
              size="small"
              label="Max Bags Allowed"
              onChange={(e) => setMaxBags(e.target.value)}
            />
          </Col>
          <Col className="mt-4">
            {""}
            <TextField
              value={feature}
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
              value={basePrice}
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
              value={baseDistance}
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
          <Col className="col-12 col-md-4 mt-4">
            <TextField
              value={pricePerUnitDistance}
              error={pricePerUnitDistanceError}
              helperText={pricePerUnitDistanceError}
              fullWidth
              size="small"
              label="Price per Unit Distance"
              onChange={(e) => setPricePerUnitDistance(e.target.value)}
            />
          </Col>
          <Col className="col-12 col-md-4 mt-4">
            <TextField
              value={pricePerUnitHour}
              error={pricePerUnitHourError}
              helperText={pricePerUnitHourError}
              fullWidth
              size="small"
              label="Price per Unit Hour"
              onChange={(e) => setPricePerUnitHour(e.target.value)}
            />
          </Col>
          <Col className="mt-4">
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Live</option>
              <option>Inactive</option>
            </select>
          </Col>
        </Row>
        <Form.Label className="text-secondary mt-4">
          <strong>Images</strong>
        </Form.Label>
        <div className="d-flex align-items-center flex-wrap">
          {singleVehicle?.images?.map((res, i) => (
            <div style={vehicleImagePreviewContainer} key={i}>
              <CancelIcon
                color="error"
                style={{
                  position: "absolute",
                  right: "-5px",
                  top: "-5px",
                  cursor: "pointer",
                }}
                onClick={(e) => deleteImageAction(i, res)}
              />
              {/* {console.log(res.FileList)} */}
              <img
                src={`${IMAGE_BASE_URL}${res}`}
                alt=""
                style={vehicleImagePreview}
              />
            </div>
          ))}
          <div className="upload-button-container">
            <FaCloudUploadAlt style={{ fontSize: "60px", color: "#808080" }} />
            <strong>Drag & Drop or Browse file</strong>
            <input
              type="file"
              multiple
              style={{
                opacity: 1,
              }}
              className="upload-input"
              accept="image/*"
              onChange={(e) => uploadImage(e)}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <LoadingButton
            loading={addBtnLoading}
            variant="contained"
            type="submit"
            style={{ background: "#c19b65" }}
            startIcon={<SaveIcon />}
          >
            Save
          </LoadingButton>
        </div>
      </Form>
    </div>
  );
}

export default UpdateVehicle;

// import { Breadcrumbs, TextField } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import { Col, Form, Row } from 'react-bootstrap'
// import SaveIcon from '@mui/icons-material/Save';
// import { imageInstance, instance } from '../../Const/ApiHeader';
// import { ADDVEHICLE, DELETE_VEHICLE_IMAGE, GET_SINGLE_VEHICLE, IMAGE_BASE_URL, UPDATE_VEHICLE } from '../../Const/ApiConst';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { FaCloudUploadAlt } from 'react-icons/fa'
// import './Vehicle.css'
// import CancelIcon from '@mui/icons-material/Cancel';
// import { LoadingButton } from '@mui/lab';
// import UpdateSkeleton from './UpdateSkeleton';

// function UpdateVehicle() {

//     const Navigate = useNavigate()
//     const params = useParams()
//     // States
//     const [vehicleName, setVehicleName] = useState('')
//     const [feature, setFeature] = useState('')
//     const [basePrice, setBasePrice] = useState('')
//     const [baseDistance, setBaseDistance] = useState('')
//     const [pricePerUnitDistance, setPricePerUnitDistance] = useState('')
//     const [pricePerUnitHour, setPricePerUnitHour] = useState('')
//     const [description, setDescription] = useState('')
//     const [imges, setImges] = useState([])
//     const [imagesPreviews, setImagePreviews] = useState([])
//     const [vehicleNo, setVehicleNo] = useState('')
//     const [maxPersons, setMaxPersons] = useState('')
//     const [addBtnLoading, setAddBtnLoading] = useState(false)

//     const [skeletonLoader, setSkeletonLoader] = useState(false)
//     // Error States
//     const [vehicleNameError, setVehicleNameError] = useState('')
//     const [featureError, setFeatureError] = useState('')
//     const [basePriceError, setBasePriceError] = useState('')
//     const [baseDistanceError, setBaseDistanceError] = useState('')
//     const [pricePerUnitDistanceError, setPricePerUnitDistanceError] = useState('')
//     const [pricePerUnitHourError, setPricePerUnitHourError] = useState('')

//     const loadData = async () => {
//         setSkeletonLoader(true)
//         const data = {
//             vhid: params.id
//         }
//         await instance.post(GET_SINGLE_VEHICLE, data)
//             .then((response) => {
//                 setSkeletonLoader(false)
//                 setVehicleName(response.data.data[0].vehicleName)
//                 setFeature(response.data.data[0].feature)
//                 setBasePrice(response.data.data[0].basePrice)
//                 setBaseDistance(response.data.data[0].baseDistance)
//                 setPricePerUnitDistance(response.data.data[0].pricePerUnitDistance)
//                 setPricePerUnitHour(response.data.data[0].pricePerUnitHour)
//                 setVehicleNo(response.data.data[0].vehicleNo)
//                 setMaxPersons(response.data.data[0].maxPersons)
//                 response.data.data[0].images.forEach(element => {
//                     imagesPreviews.push(IMAGE_BASE_URL + element)
//                 });

//             }).catch(err => console.log(err))
//     }

//     useEffect(() => {
//         loadData()
//     }, [])

//     const saveAction = (e) => {
//         e.preventDefault()
//         setAddBtnLoading(true)
//         const data = {
//             vehicleName: vehicleName,
//             feature: feature,
//             basePrice: basePrice,
//             baseDistance: baseDistance,
//             pricePerUnitDistance: pricePerUnitDistance,
//             pricePerUnitHour: pricePerUnitHour,
//             description: description,
//             vehicleNo: vehicleNo
//         }

//         const formData = new FormData()
//         for (let i = 0; i < imges.length; i++) {
//             formData.append('images', imges[i]);
//         }
//         // formData.append('images', imges)
//         formData.append('vehicleName', vehicleName)
//         formData.append('feature', feature)
//         formData.append('basePrice', basePrice)
//         formData.append('baseDistance', baseDistance)
//         formData.append('pricePerUnitDistance', pricePerUnitDistance)
//         formData.append('pricePerUnitHour', pricePerUnitHour)
//         formData.append('description', description)
//         formData.append('vehicleNo', vehicleNo)
//         formData.append('maxPersons', maxPersons)
//         formData.append('id', params.id)

//         instance.post(
//             UPDATE_VEHICLE,
//             formData
//         ).then(response => {
//             setAddBtnLoading(false)
//             Navigate('/Vehicles')
//         }).catch(err => {
//             err.response.data.errors.forEach(element => {
//                 switch (element.path) {
//                     case ('vehicleName'):
//                         setVehicleNameError(element.msg)
//                         break;

//                     default:
//                         break;
//                 }
//             });
//         })
//     }

//     const vehicleImagePreviewContainer = {
//         position: 'relative',
//         margin: '10px',
//         border: '2px solid white',
//         padding: '2px',
//         borderRadius: '5px',
//         boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
//     }
//     const vehicleImagePreview = {
//         height: '100px'
//     }

//     // Delete Image Action
//     const deleteImageAction = async (res, i) => {
//         const updatedFilesPreview = imagesPreviews.slice(0, i).concat(imagesPreviews.slice(i + 1));
//         const updatedFiles = imges.slice(0, i).concat(imges.slice(i + 1));
//         setImges(updatedFiles)
//         setImagePreviews(updatedFilesPreview)

//         const imageName = res.substring(res.lastIndexOf('/') + 1);
//         const data = {
//             imgid: imageName,
//             vhid: params.id
//         }
//         if (typeof res === 'string' && res.startsWith('blob:')) {
//         } else {
//             instance.post(DELETE_VEHICLE_IMAGE, data)
//                 .then(response => { console.log(response) })
//                 .catch(err => { console.log(err) })
//         }

//     }
//     const uploadImage = (e) => {
//         const selectedFiles = e.target.files;
//         const selectedPreviews = Array.from(selectedFiles).map((file) => URL.createObjectURL(file));
//         setImges([...imges, ...selectedFiles]);
//         setImagePreviews([...imagesPreviews, ...selectedPreviews]);
//     }

//     if (skeletonLoader) {
//         return <UpdateSkeleton />
//     } else {
//         return (
//             <div >
//                 <Breadcrumbs aria-label="breadcrumb">
//                     <Link underline="hover" color="inherit" to="/" className='breadcrumpItem'>
//                         Home
//                     </Link>
//                     <Link underline="hover" color="inherit" to="/Vehicles" className='breadcrumpItem'>
//                         Vehicles
//                     </Link>
//                     <Link color="text.primary" className='breadcrumpItem'>Update Vehicle</Link>
//                 </Breadcrumbs>
//                 <div className='d-flex justify-content-between align-items-center mt-4'>
//                     <strong>Vehicles</strong>
//                 </div>
//                 <hr />
//                 <Form onSubmit={(e) => saveAction(e)} autoComplete='off' encType='multipart/form-data'>
//                     <Form.Label className='text-secondary'><strong>Information</strong></Form.Label>
//                     <Row className='mb-4'>
//                         <Col>
//                             <TextField
//                                 error={vehicleNameError}
//                                 helperText={vehicleNameError}
//                                 fullWidth
//                                 value={vehicleName}
//                                 size='small'
//                                 label="Car Name"
//                                 onChange={(e) => setVehicleName(e.target.value)} />
//                         </Col>
//                         <Col>
//                             <TextField
//                                 error={featureError}
//                                 helperText={featureError}
//                                 fullWidth
//                                 size='small'
//                                 label="Vehicle No"
//                                 value={vehicleNo}
//                                 onChange={(e) => setVehicleNo(e.target.value)} />
//                         </Col>
//                     </Row>
//                     <Row className='mb-4'>
//                         <Col>
//                             <TextField
//                                 error={featureError}
//                                 helperText={featureError}
//                                 fullWidth
//                                 size='small'
//                                 label="Max Persons Allowed"
//                                 value={maxPersons}
//                                 onChange={(e) => setMaxPersons(e.target.value)} />
//                         </Col>
//                         <Col>
//                             <TextField
//                                 error={featureError}
//                                 helperText={featureError}
//                                 fullWidth
//                                 size='small'
//                                 label="Feature"
//                                 value={feature}
//                                 onChange={(e) => setFeature(e.target.value)} />
//                         </Col>
//                     </Row>
//                     <Row className='mb-4'>
//                         <Col>
//                             <TextField
//                                 error={basePriceError}
//                                 helperText={basePriceError}
//                                 fullWidth
//                                 size='small'
//                                 label="Base Price"
//                                 value={basePrice}
//                                 onChange={(e) => setBasePrice(e.target.value)} />
//                         </Col>
//                         <Col>
//                             <TextField
//                                 error={baseDistanceError}
//                                 helperText={baseDistanceError}
//                                 fullWidth
//                                 size='small'
//                                 label="Distance for Base Fare"
//                                 value={baseDistance}
//                                 onChange={(e) => setBaseDistance(e.target.value)} />
//                         </Col>
//                     </Row>
//                     <Row className='mb-4'>
//                         <Col>
//                             <TextField
//                                 error={pricePerUnitDistanceError}
//                                 helperText={pricePerUnitDistanceError}
//                                 fullWidth
//                                 size='small'
//                                 label="Price per Unit Distance"
//                                 value={pricePerUnitDistance}
//                                 onChange={(e) => setPricePerUnitDistance(e.target.value)} />
//                         </Col>
//                         <Col>
//                             <TextField
//                                 error={pricePerUnitHourError}
//                                 helperText={pricePerUnitHourError}
//                                 fullWidth
//                                 size='small'
//                                 label="Price per Unit Hour"
//                                 value={pricePerUnitHour}
//                                 onChange={(e) => setPricePerUnitHour(e.target.value)} />
//                         </Col>
//                     </Row>

//                     <Form.Label className='text-secondary'><strong>Images</strong></Form.Label>
//                     <div className='d-flex align-items-center flex-wrap'>
//                         {imagesPreviews.map((res, i) => (
//                             <div style={vehicleImagePreviewContainer} key={i}>
//                                 <CancelIcon
//                                     color='error'
//                                     style={{
//                                         position: 'absolute',
//                                         right: '-5px',
//                                         top: '-5px',
//                                         cursor: 'pointer'
//                                     }}
//                                     onClick={(e) => deleteImageAction(res, i)} />

//                                 {/* {console.log(res.FileList)} */}
//                                 <img src={res} alt='' style={vehicleImagePreview} />

//                             </div>
//                         ))}
//                         <div className='upload-button-container'>
//                             <input
//                                 type='file'
//                                 style={{
//                                     opacity: 1
//                                 }}
//                                 className='upload-input'
//                                 accept="image/*"
//                                 onChange={uploadImage} />
//                             <FaCloudUploadAlt style={{ fontSize: '60px', color: '#808080' }} />
//                             <strong>Drag & Drop or Browse file</strong>
//                         </div>
//                     </div>

//                     <div className='text-center mt-4'>
//                         <LoadingButton
//                             loading={addBtnLoading}
//                             variant='contained'
//                             type='submit'
//                             startIcon={<SaveIcon />}>Update</LoadingButton>
//                     </div>
//                 </Form>
//             </div>
//         )
//     }
// }

// export default UpdateVehicle
