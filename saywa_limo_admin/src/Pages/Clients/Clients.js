import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Breadcrumbs, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { DELETE_USER } from "../../Const/ApiConst";
import { instance } from "../../Const/ApiHeader";
import Modal from "react-bootstrap/Modal";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input, Table } from "antd";
import { useDispatch } from "react-redux";
import {
  ALLCUSTOMERS,
  DELETE_CUSTOMERS,
  UPDATE_CUSTOMERS,
} from "../../store/Customers/CustomerSlice";
import { useSelector } from "react-redux";

function Clients() {
  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Product Name must be at least 3 characters")
      .max(50, "Product Name can be at most 50 characters")
      .matches(/^[a-zA-Z ]+$/, "Enter characters only"),
    contactNo: yup
      .string()
      .matches(/^[0-9]{10}$/, "Enter 10-digit number")
      .required("Contact number is required"),
    email: yup
      .string()
      .email("Enter a valid email") // Use Yup's built-in email validation
      .required("Email address is required"),
  });
  const [userData, setUserData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [userId, setUserId] = useState();

  const { customers, isLoading } = useSelector((state) => state?.customer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // HANDLE EDIT CLIENT
  const handleEditClient = (client) => {
    setUserId(client._id);
    handleShow();
    formik.setValues({
      name: client.fullName,
      contactNo: client.contact_no,
      email: client.email,
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      contactNo: 0,
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const contactnoAsNumber = parseInt(values.contactNo, 10);
      const data = {
        ...values,
        contactNo: contactnoAsNumber,
        id: userId,
      };

      dispatch(UPDATE_CUSTOMERS(data));
      handleClose();
    },
  });

  const searchAction = async (e) => {
    setSearchKey(e.target.value);

    const data = {
      page: e.current,
      per_page: e.pageSize,
      searchKey: e.target.value,
    };
    dispatch(ALLCUSTOMERS(data));
  };

  useEffect(() => {
    const data = {
      page: 1,
      per_page: 10,
      searchKey,
    };
    dispatch(ALLCUSTOMERS(data));
    // eslint-disable-next-line
  }, []);

  const loadPaginationData = (e) => {
    const data = {
      page: e.current,
      per_page: e.pageSize,
      searchKey,
    };
    dispatch(ALLCUSTOMERS(data));
  };

  // modelbox
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const newColumns = [
    { title: "Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Contact No", dataIndex: "contact_no" },
    {
      title: "Actions",
      render: (row) => (
        <div className="d-flex gap-2">
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/view-client/${row.user_id}`)}
          >
            View
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              handleEditClient(row);
            }}
          >
            Edit
          </Button>
          <Button
            // variant="contained"
            size="small"
            style={{ backgroundColor: "red", color: "White" }}
            onClick={() => {
              setDeleteModalShow(true);
              setDeleteUserData(row);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const [deletemodalShow, setDeleteModalShow] = React.useState(false);
  const [deleteUserData, setDeleteUserData] = useState([]);

  function DeleteModal(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete User?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure, want to delete <b>{deleteUserData.fullName}</b>?{" "}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>No</Button>
          <Button
            onClick={() => {
              const data = {
                id: deleteUserData._id,
              };
              dispatch(DELETE_CUSTOMERS(data));
              setDeleteModalShow(false);
            }}
            variant="contained"
            color="error"
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

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
          Clients
        </Link>
      </Breadcrumbs>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <strong>Clients</strong>
      </div>
      <div className="mb-2 mt-2 col-3">
        <Input.Search
          type="search"
          placeholder="Search Client..."
          onChange={(e) => searchAction(e)}
        />
      </div>

      <Table
        loading={isLoading}
        columns={newColumns}
        dataSource={customers?.data}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          total: customers?.total,
          pageSizeOptions: ["10", "20", "50", "100", "500"],
        }}
        onChange={(e) => loadPaginationData(e)}
      />
      <Modal
        centered
        show={show}
        onHide={handleClose}
        animation={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Client Details Update</Modal.Title>
        </Modal.Header>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                    id="name"
                    name="name"
                    label="Name"
                    fullWidth
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("name", true)}
                  />
                  <div className="error text-danger">
                    {formik.touched.name && formik.errors.name}
                  </div>
                </div>
                <div>
                  <TextField
                    variant="outlined"
                    id="contactNo"
                    name="contactNo"
                    label="Contact Number"
                    fullWidth
                    value={formik.values.contactNo}
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("contactNo", true)}
                  />
                  <div className="error text-danger">
                    {formik.touched.contactNo && formik.errors.contactNo}
                  </div>
                </div>
                <div>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched("email", true)}
                  />
                  <div className="error text-danger">
                    {formik.touched.email && formik.errors.email}
                  </div>
                </div>
              </Box>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={formik.handleSubmit}>
              Update
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <DeleteModal
        show={deletemodalShow}
        onHide={() => setDeleteModalShow(false)}
      />
    </div>
  );
}

export default Clients;
