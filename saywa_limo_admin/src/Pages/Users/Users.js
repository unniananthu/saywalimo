import { Breadcrumbs, Button, FormControlLabel, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { instance } from "../../Const/ApiHeader";
import { GETUSERS, TOGGLESTATUS } from "../../Const/ApiConst";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26, 
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

function Users() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchKey, setSearchKey] = useState("");

  const loadData = async (page) => {
    setLoading(true);
    const data = {
      page: page,
      per_page: perPage,
      searchKey: searchKey,
    };
    instance
      .post(GETUSERS, data)
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
    const response = await instance.post(GETUSERS, data);

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
    const response = await instance.post(GETUSERS, data);

    setUserData(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData(1); // fetch page 1 of users
    // eslint-disable-next-line
  }, []);

  const toggleStatus = (e, id) => {
    var status = "";
    if (e.target.checked) {
      status = "Live";
    } else {
      status = "Suspended";
    }
    const data = {
      id: id,
      status: status,
    };
    instance.post(TOGGLESTATUS, data);
  };

  const columns = [
    {
      name: "User Name",
      selector: (row) => (
        <Tooltip title={row.userName}>
          <span>{row.userName}</span>
        </Tooltip>
      ),
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => (
        <Tooltip title={row.firstName + " " + row.lastName} exact="true">
          <span exact="true">{row.firstName + " " + row.lastName}</span>
        </Tooltip>
      ),
      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) => (
        <Tooltip title={row.designation} exact="true">
          <span exact="true">{row.designation}</span>
        </Tooltip>
      ),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => (
        <Tooltip title={row.emailId} exact="true">
          <span exact="true">{row.emailId}</span>
        </Tooltip>
      ),
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => (
        <Tooltip title={row.countryCode + "-" + row.contactNumber} exact="true">
          <span exact="true">{row.countryCode + "-" + row.contactNumber}</span>
        </Tooltip>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div className="p-1">
          {row.status === "Live" ? (
            <FormControlLabel
              control={
                <IOSSwitch
                  sx={{ m: 1 }}
                  defaultChecked
                  onChange={(e) => toggleStatus(e, row._id)}
                />
              }
            />
          ) : (
            <FormControlLabel
              control={<IOSSwitch sx={{ m: 1 }} />}
              onChange={(e) => toggleStatus(e, row._id)}
            />
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <Link to={"/Update_User/" + row._id}>
          <Button size="small" variant="contained" color="warning">
            Edit
          </Button>
        </Link>
      ),
      sortable: true,
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
          Users
        </Link>
      </Breadcrumbs>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <strong>Users</strong>
        <div>
          <Link to="/Add_User">
            <Button variant="contained">Add User</Button>
          </Link>
        </div>
      </div>
      <div className="mb-2 mt-2 col-3">
        <Form.Control
          type="search"
          placeholder="Search..."
          onChange={(e) => searchAction(e)}
        />
      </div>

      <DataTable
        responsive={true}
        columns={columns}
        data={userData}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />
    </div>
  );
}

export default Users;
