import { Button, Input, Table, Form, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVehicles,
  liveSearchVehicle,
  updateBaseDistanceOrPriceSliceItem,
  updateBaseDistancePriceSliceItem,
  updateBaseDistanceSliceItem,
} from "../../store/Vehicles/VehicleSlice";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? <Input type="number" /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function SettingsPage() {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("kms");
  const [saveLoading, setSaveLoading] = useState(false);
  const [miles, setMiles] = useState(0);
  const [price, setPrice] = useState(0);
  const [selectedCalculation, setSelectedCalculation] = useState("Increase");
  const { allVehicleList, isLoading } = useSelector((state) => state?.vehicle);

  useEffect(() => {
    dispatch(getAllVehicles());
  }, [dispatch]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      _id: record._id,
      vehicleName: record.vehicleName,
      baseDistance: record.baseDistance,
      pricePerUnitDistance: record.pricePerUnitDistance,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...allVehicleList];
      const index = newData.findIndex((item) => key === item.key);

      if (index >= -1) {
        const item = newData[index];
        const updatedItem = { ...item, ...row };
        newData.splice(index, 1, updatedItem);
        // Dispatch update action here
        console.log("Updated Item:", updatedItem);
        await dispatch(updateBaseDistanceOrPriceSliceItem(updatedItem));
        setEditingKey("");
      } else {
        newData.push(row);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "",
      editable: true,
      dataIndex: "_id",
      key: "_id",
      width: 10,

      render: (text) => (
        <span style={{ display: "none", width: "1px !important" }}>{text}</span>
      ),
    },
    {
      title: "Vehicle Name",
      dataIndex: "vehicleName",
      key: "vehicleName",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Base Distance",
      dataIndex: "baseDistance",
      key: "baseDistance",
      editable: true,
      render: (text) => `${text} Mile(s)`,
    },
    {
      title: "Price Post Base Distance",
      dataIndex: "pricePerUnitDistance",
      key: "pricePerUnitDistance",
      editable: true,
      render: (text) => `$ ${text}`,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <a onClick={cancel}>Cancel</a>
          </span>
        ) : (
          <Button disabled={editingKey !== ""} onClick={() => edit(record)}>
            Edit
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      hidden: col._id,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "baseDistance" ||
          col.dataIndex === "pricePerUnitDistance"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const saveDistance = () => {
    setSaveLoading(true);
    const data = {
      miles,
    };
    dispatch(updateBaseDistanceSliceItem(data)).then((res) => {
      setSaveLoading(false);
      setOpenModal(false);
    });
  };

  const savePrice = () => {
    setSaveLoading(true);
    const data = { price: parseFloat(price), type: selectedCalculation };
    dispatch(updateBaseDistancePriceSliceItem(data)).then((res) => {
      setSaveLoading(false);
      setOpenModal(false);
    });
  };

  const searchAction = (e) => {
    const data = {
      searchKey: e.target.value,
    };
    dispatch(liveSearchVehicle(data));
  };

  return (
    <div>
      <div className="d-flex justify-content-between gap-3 mb-3">
        <div>
          <Input.Search
            placeholder="Search vehicle"
            onChange={(e) => searchAction(e)}
          />
        </div>
        <div className="d-flex gap-3">
          <Button
            type="primary"
            onClick={() => {
              setOpenModal(true);
              setModalType("kms");
            }}
          >
            Update Base Distance
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setOpenModal(true);
              setModalType("price");
            }}
          >
            Update Price
          </Button>
        </div>
      </div>
      <Form form={form} component={false}>
        <Table
          loading={isLoading}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={allVehicleList.map((item, index) => ({
            ...item,
            key: index,
          }))}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <Modal
        centered
        open={openModal}
        confirmLoading={saveLoading}
        onOk={() => (modalType === "kms" ? saveDistance() : savePrice())}
        onCancel={() => setOpenModal(false)}
        title={
          modalType === "kms"
            ? "Update Base Distance"
            : "Update Price after Base Distance"
        }
      >
        {modalType === "kms" ? (
          <Input
            placeholder="Enter base Miles eg: 10"
            onChange={(e) => setMiles(e.target.value)}
          />
        ) : (
          <div className="d-flex flex-column gap-4">
            <div className="d-flex flex-column">
              <label>
                <small>Type</small>
              </label>
              <Select
                value={selectedCalculation}
                onChange={(value) => {
                  setSelectedCalculation(value);
                }}
                options={[
                  { label: "Increase", value: "Increase" },
                  { label: "Decrease", value: "Decrease" },
                ]}
              />
            </div>
            <div>
              <label>
                <small>{`${selectedCalculation} in (%)`}</small>
              </label>
              <div>
                <Input
                  placeholder="Enter price after base Miles eg 10"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SettingsPage;
