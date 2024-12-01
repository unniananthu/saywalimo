import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "./package.css";
import { getActivePackageSliceItem } from "../store/Packages/PackageSlice";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function PackagesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packagesList, isLoading } = useSelector((state) => state?.package);

  useEffect(() => {
    dispatch(getActivePackageSliceItem());
  }, []);
  return (
    <div className="container mt-4 mb-4">
      <h3 className="mb-2">Available Packages</h3>
      {isLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center  mt-5 mb-5">
          <CircularProgress style={{ color: "black" }} />
          <span>Please wait...</span>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-4">
          {packagesList?.map((res, i) => (
            <div
              key={i}
              className="package-container"
              onClick={() => navigate(`/package/${res._id}`)}
            >
              <div className="d-flex flex-column gap-2">
                <div>
                  <img
                    src={res.PackageImage[0]?.url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="d-flex flex-column">
                  <div>
                    <strong>{res.PackageName}</strong>
                  </div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "12px",
                    }}
                    className="text-secondary"
                  >
                    {res.Description}
                  </div>
                </div>
              </div>
            </div>
          ))}{" "}
        </div>
      )}
    </div>
  );
}

export default PackagesPage;
