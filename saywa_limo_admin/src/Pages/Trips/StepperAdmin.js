import { Steps } from "antd";
import React from "react";
import { useSelector } from "react-redux";

function StepperAdmin() {
  const { tabIndexState } = useSelector((state) => state?.trips);
  return (
    <Steps
      current={tabIndexState}
      size="small"
      items={[
        {
          title: "Customer Selection",
        },
        {
          title: "Route Selection",
        },
        {
          title: "Vehicle Selection",
        },
        {
          title: "Passenger Details",
        },
        {
          title: "Preview",
        },
      ]}
    />
  );
}

export default StepperAdmin;
