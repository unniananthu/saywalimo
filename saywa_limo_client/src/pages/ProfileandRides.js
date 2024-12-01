import React from "react";

import { Typography } from "antd";
import OrderComponent from "../components/orders/OrderComponent";

const { Title } = Typography;

function ProfileandRides() {
  return (
    <div className="container">
      <h3 className="mt-4">My Trips</h3>
      <div className="pb-4">
        <OrderComponent />
      </div>
    </div>
  );
}

export default ProfileandRides;
