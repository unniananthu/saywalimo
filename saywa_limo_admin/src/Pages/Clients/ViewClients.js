import React, { useEffect } from "react";
import { instance } from "../../Const/ApiHeader";
import { LOAD_CLIENT_DATA } from "../../Const/ApiConst";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Table } from "react-bootstrap";

function ViewClients() {
  const params = useParams();

  const [list_data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = {
      id: params.id,
    };
    await instance.post(LOAD_CLIENT_DATA, data).then((response) => {
      setData(response?.data.data);
    });
  };
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Trip No</th>
            <th>Full Name</th>
            <th>Pickup Date</th>
            <th>Pickup Location</th>
            <th>Drop off Location</th>
            <th>Total amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list_data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center">No data found!</td>
            </tr>
          ) : (
            list_data?.map((res, i) => (
              <tr>
                <td style={{ fontSize: "12px", color: "grey" }}>
                  {res.tripNo}
                </td>
                <td style={{ fontSize: "12px", color: "grey" }}>
                  {res.customerName}
                </td>
                <td style={{ fontSize: "12px", color: "grey" }}>
                  {res.scheduledDate}
                </td>
                <td style={{ fontSize: "12px", color: "grey" }}>
                  {res.source}
                </td>
                <td style={{ fontSize: "12px", color: "grey" }}>
                  {res.destination}
                </td>
                <td
                  style={{ fontSize: "12px", color: "grey", textAlign: "end" }}
                >
                  $ {res.totalAmount}
                </td>
                <td style={{ fontSize: "12px", color: "grey" }}>
                  {res.tripStatus}
                </td>
                <td style={{ fontSize: "12px", color: "grey" }}>
                  <Link to={`/view-trip/${res._id}`}>View</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default ViewClients;
