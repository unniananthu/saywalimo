import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ALL_PACKAGE_SLICE_ITEM } from "../../store/Packages/PackageSlice";
import { useSelector } from "react-redux";

function TripPackageComponent({ onClick }) {
  const dispatch = useDispatch();

  const { packageList } = useSelector((state) => state?.packages);

  useEffect(() => {
    dispatch(ALL_PACKAGE_SLICE_ITEM());
  }, []);

  return (
    <div className="d-flex ">
      {packageList.map((res, i) => (
        <div
          key={i}
          className="p-3 m-3"
          style={{
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          onClick={() => onClick(res)}
        >
          <img src={res?.PackageImage[0]?.url} width={200} />
          <div className="text-center">{res?.PackageName}</div>
        </div>
      ))}
    </div>
  );
}

export default TripPackageComponent;
