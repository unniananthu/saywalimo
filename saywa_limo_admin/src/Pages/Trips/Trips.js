import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Breadcrumbs, Tab, Tooltip } from "@mui/material";
import { ALL_TRIP } from "../../Const/ApiConst";
import { instance } from "../../Const/ApiHeader";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import FilteredTableComponent from "../../Components/FilteredTableComponent";

function Trips() {
  const columns = [
    {
      name: "Trip #",
      selector: (row) => row.tripNo,
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.customerdata[0]?.fullName,
      sortable: true,
    },
    {
      name: "Pickup Date & Time",
      selector: (row) => (
        <div>
          <div>{row.scheduledDate}</div>
          <div>{row.scheduledTime}</div>
        </div>
      ),
      // sortable: true,
    },
    {
      name: "Pickup Location",
      selector: (row) => (
        <Tooltip title={row.source}>
          <span className="d-flex flex-column">
            <span style={{ cursor: "alias", fontWeight: "bold" }}>
              {row.source}
            </span>
            <span>
              {row.stops.length !== 0 ? row.stops.length + " Stops" : ""}
            </span>
          </span>
        </Tooltip>
      ),
      // sortable: true,
    },
    {
      name: "Drop off Location",
      selector: (row) => (
        <Tooltip title={row.destination}>
          <span style={{ cursor: "alias" }}>{row.destination}</span>
        </Tooltip>
      ),
      // sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => (
        <div className="text-end">{"$ " + row.totalAmount}</div>
      ),
      // sortable: true,
      style: { display: "flex", justifyContent: "end" },
    },
    {
      name: "Status",
      selector: (row) => row.tripStatus,
      // sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <Link to={"/trip_action/" + row._id}>
          <RemoveRedEyeIcon />
        </Link>
      ),
      // sortable: true,
    },
  ];

  const [tripDataArray, setTripDataArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const loadData = async (page) => {
    setLoading(true);
    const data = {
      page: page,
      per_page: perPage,
      searchKey: searchKey,
      sort: -1,
    };
    instance
      .post(ALL_TRIP, data)
      // .post(GET_PENDING_TRIPS, data)
      .then((response) => {
        setTripDataArray(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    const data = {
      page: page,
      per_page: newPerPage,
      searchKey: searchKey,
    };
    const response = await instance.post(ALL_TRIP, data);

    setTripDataArray(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    loadData(page);
  };

  useEffect(() => {
    loadData(1); // fetch page 1 of users
    // eslint-disable-next-line
  }, []);

  const liveSearchAction = async (e) => {
    setSearchKey(e.target.value);
    setLoading(true);
    const data = {
      page: 1,
      per_page: perPage,
      searchKey: e.target.value,
    };
    await instance
      .post(ALL_TRIP, data)
      .then((response) => {
        setTripDataArray(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleSort = async (column, sortDirection) => {
    const sortType = sortDirection == "asc" ? 1 : -1;

    // setData(remoteData);

    setLoading(true);
    const data = {
      page: 1,
      per_page: perPage,
      // searchKey: e.target.value,
      column: column.name,
      sort: sortType,
    };
    await instance
      .post(ALL_TRIP, data)
      .then((response) => {
        setTripDataArray(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
      })
      .catch((err) => console.log(err));
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
        <Link color="text.primary" className="breadcrumpItem">
          Trip
        </Link>
      </Breadcrumbs>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <strong>Trips</strong>
      </div>
      {/* <div className="mb-2 mt-2 col-3">
        <Form.Control
          type="search"
          placeholder="Search..."
          onBlur={(e) => liveSearchAction(e)}
        />
      </div> */}

      <div className="mt-4 mob-view">
        <select
          className="form-select"
          onChange={(e) => {
            setValue(e.target.value);
          }}
        >
          <option label="All" value="1">
            All
          </option>
          <option value="2">Un-Assigned Trips</option>
          <option value="3">Pending Enroute</option>
          <option value="4">Pending Arrival</option>
          <option value="5">Pending Onboard</option>
          <option value="6">Pending Completed</option>
          <option value="7">Completed Trips</option>
          {/* <Tab label="Un-Asssigned Trips" value="2" />
          <Tab label="Pending Enroute" value="3" />
          <Tab label="Pending Arrival" value="4" />
          <Tab label="Pending Onboard" value="5" />
          <Tab label="Pending Completed" value="6" />
          <Tab label="Completed Trips" value="7" /> */}
        </select>
      </div>

      <TabContext value={value}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider" }}
          className="web-view"
        >
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            scrollButtons="auto"
          >
            <Tab label="All Trips" value="1" />
            <Tab
              label="Un-Assigned Trips"
              value="2"
              sx={{ background: "yellow" }}
            />
            <Tab
              label="Pending Enroute"
              value="3"
              sx={{ background: "#7ecbff" }}
            />
            <Tab
              label="Pending Arrival"
              value="4"
              sx={{ background: "#f78fff" }}
            />
            <Tab
              label="Pending Onboard"
              value="5"
              sx={{ background: "#ff8c63" }}
            />
            <Tab
              label="Pending Completed"
              value="6"
              sx={{ background: "#7ffff6" }}
            />
            <Tab
              label="Completed Trips"
              value="7"
              sx={{ background: "#a8ffaa" }}
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <DataTable
            columns={columns}
            data={tripDataArray}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            onSort={handleSort}
            sortServer
          />
        </TabPanel>
        <TabPanel value="2">
          <FilteredTableComponent data="Pending" />
        </TabPanel>

        <TabPanel value="3">
          <FilteredTableComponent data="Trip Confirmed" />
        </TabPanel>
        <TabPanel value="4">
          <FilteredTableComponent data="Enroute" />
        </TabPanel>
        <TabPanel value="5">
          <FilteredTableComponent data="Arrived" />
        </TabPanel>
        <TabPanel value="6">
          <FilteredTableComponent data="Onboard" />
        </TabPanel>
        <TabPanel value="7">
          <FilteredTableComponent data="Completed" />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Trips;
