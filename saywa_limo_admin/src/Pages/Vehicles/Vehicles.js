import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import CloseIcon from "@mui/icons-material/Close";
import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { instance } from "../../Const/ApiHeader";
import { GETVEHICLE, IMAGE_BASE_URL } from "../../Const/ApiConst";

function Vehicles() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [open, setOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const handleClickOpen = (images) => {
    setPreviewImages(images);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadData = async (page) => {
    setLoading(true);
    const data = {
      page: page,
      per_page: perPage,
      searchKey: searchKey,
    };
    instance
      .post(GETVEHICLE, data)
      .then((response) => {
        setUserData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const handlePageChange = (page) => {
    loadData(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    const data = {
      page: page,
      per_page: newPerPage,
      searchKey: searchKey,
    };
    const response = await instance.post(GETVEHICLE, data);

    setUserData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const searchAction = async (e) => {
    setLoading(true);
    setSearchKey(e.target.value);
    const data = {
      searchKey: e.target.value,
    };
    const response = await instance.post(GETVEHICLE, data);

    setUserData(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData(1); // fetch page 1 of users
    // eslint-disable-next-line
  }, []);

  const vehicleImage = {
    width: "100px",
    // height: "60px",
    borderRadius: "10px",
    margin: "5px",
    objectFit: "contain",
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.vehicleName,
      sortable: true,
    },
    {
      name: "Features",
      selector: (row) => row.feature,
    },
    {
      name: "Image",
      selector: (row) => (
        <div onClick={() => handleClickOpen(row.images)}>
          <img
            src={IMAGE_BASE_URL + row.images[0]}
            alt=""
            style={vehicleImage}
          />
        </div>
      ),
    },
    {
      name: "Base Price",
      selector: (row) => row.basePrice,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    // {
    //     name: 'Created',
    //     selector: row => row.created
    // },
    {
      name: "Action",
      selector: (row) => (
        <Link to={"/Update_Vehicle/" + row._id}>
          <Button variant="contained" style={{background:"#c19b65"}} size="small" startIcon={<EditIcon />}>
            Edit
          </Button>
        </Link>
      ),
    },
  ];

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
        <Link color="text.primary" className="breadcrumpItem">
          Vehicles
        </Link>
      </Breadcrumbs>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <strong>Vehicles</strong>
        <div>
          <Link to="/Add_Vehicle">
            <Button variant="contained" style={{background:"#c19b65"}}>Add Vehicle</Button>
          </Link>
        </div>
      </div>
      <div className="mb-2 mt-2 col-3">
        <Form.Control type="search" placeholder="Search..." />
      </div>

      <DataTable
        columns={columns}
        data={userData}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Preview Images"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {previewImages.map((res, i) => (
              <img
                // src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnyYwus9SLSRsM9VkRHP8cqQYEmpfEAsenrKI7UIqf0Q&s'
                src={IMAGE_BASE_URL + res}
                alt=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "100%",
                  margin: "5px",
                }}
                key={i}
              />
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Vehicles;
