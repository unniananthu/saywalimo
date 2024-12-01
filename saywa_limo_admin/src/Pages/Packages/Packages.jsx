import { Button, Input, Switch, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ALL_PACKAGE_SLICE_ITEM,
  LIVE_SEARCH_PACKAGE_SLICE_ITEM,
  TOGGLE_PACKAGE_STATUS_SLICE_ITEM,
} from "../../store/Packages/PackageSlice";
import { useSelector } from "react-redux";
import moment from "moment";
import { CircularProgress } from "@mui/material";

function PackagesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { packageList, isLoading } = useSelector((state) => state?.packages);

  useEffect(() => {
    dispatch(ALL_PACKAGE_SLICE_ITEM());
  }, []);

  const updateStatus = (status, id) => {
    const data = {
      id: id,
      status: status ? "Active" : "Inactive",
    };
    dispatch(TOGGLE_PACKAGE_STATUS_SLICE_ITEM(data));
  };

  const columns = [
    {
      title: "NAME",
      dataIndex: "PackageName",
    },
    { title: "TOUR LENGTH", dataIndex: "TourLength" },
    { title: "TOTAL PERSON", dataIndex: "TotalPerson" },
    { title: "STATUS", dataIndex: "selectedStatus" },
    {
      title: "CREATED",
      render: (value) => (
        <div>{moment(value.created_at).format("MM/DD/YYYY")}</div>
      ),
    },
    {
      title: "Status",
      render: (value) => (
        <div>
          <Switch
            checked={value.status === "Active" ? true : false}
            checkedChildren={
              isLoading ? (
                <CircularProgress style={{ color: "white" }} size={13} />
              ) : (
                "Active"
              )
            }
            unCheckedChildren={
              isLoading ? (
                <CircularProgress style={{ color: "white" }} size={13} />
              ) : (
                "Inactive"
              )
            }
            onChange={(e) => updateStatus(e, value._id)}
          />
        </div>
      ),
    },
    {
      title: "ACTION",
      render: (value) => (
        <Button onClick={() => navigate(`${value._id}`)}>Update</Button>
      ),
    },
  ];

  const searchPackage = (e) => {
    const data = {
      searchkey: e,
    };
    dispatch(LIVE_SEARCH_PACKAGE_SLICE_ITEM(data));
  };
  return (
    <div>
      <div className="d-flex justify-content-between gap-2 mb-4">
        <div>
          <Input.Search
            placeholder="Search..."
            onChange={(e) => searchPackage(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate("add_package")}>Add Package</Button>
      </div>
      <div>
        <Table columns={columns} dataSource={packageList} />
      </div>
    </div>
  );
}

export default PackagesPage;
