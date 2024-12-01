import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { MdOutlineDragIndicator } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { wayPoints } from "../../store/WaypointSlice";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Autocomplete } from "@react-google-maps/api";

function DraggableWaypoints() {
  const wayPointsList = useSelector((state) => state?.waypoints?.wayPoints);
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (wayPointsList.length !== 0) {
      setTimeout(() => {
        setTasks(wayPointsList);
      }, 100);
    } else {
      if (JSON.parse(sessionStorage.getItem("waypoints"))) {
        setTasks(JSON.parse(sessionStorage.getItem("waypoints")));
      }
    }
    // eslint-disable-next-line
  }, [sessionStorage.getItem("waypoints"), wayPointsList]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedTasks = [...tasks];
    const [reorderedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, reorderedTask);

    setTasks(updatedTasks);
    dispatch(wayPoints(updatedTasks));
  };

  const deleteWayPoint = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    dispatch(wayPoints(updatedTasks));
    sessionStorage.setItem("waypoints", JSON.stringify(updatedTasks));
  };

  const addOrUpdatetoArray = (index, updatedContent) => {
    const updatedTasks = [...tasks];
    const updatedTask = { ...updatedTasks[index], content: updatedContent };
    updatedTasks[index] = updatedTask;
    setTasks(updatedTasks);
    sessionStorage.setItem("waypoints", JSON.stringify(updatedTasks));
    dispatch(wayPoints(updatedTasks));
  };

  return (
    <div className="w-100">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="task-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((taskz, index) => (
                <Draggable key={taskz.id} draggableId={taskz.id} index={index}>
                  {(provided) => (
                    <div
                      className="d-flex align-items-center gap-2 mt-1 mb-0 w-100 "
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="d-flex align-items-center ">
                        <MdOutlineDragIndicator />
                        <Autocomplete>
                          <input
                            type="text"
                            onBlur={(e) =>
                              e.target.value !== "" ||
                              e.target.value !== undefined ||
                              e.target.value !== null
                                ? addOrUpdatetoArray(index, e.target.value)
                                : null
                            }
                            placeholder="Search Location"
                            defaultValue={
                              taskz.content.split(" ")[0] !== "Task"
                                ? taskz.content
                                : ""
                            }
                          />
                        </Autocomplete>
                      </div>
                      <IoCloseCircleOutline
                        style={{ fontSize: "25px", color: "orange" }}
                        onClick={() => deleteWayPoint(index)}
                      />
                      {/* {task.content} */}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default DraggableWaypoints;
