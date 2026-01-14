import "./FloorRow.css";
import { useElevator } from "../../hooks/useElevator";
import liftIcon from "../../assets/lift.png";
import { useEffect } from "react";

const FloorRow = ({ numberOfFloors, numberOfElevators }) => {
  const { elevators, callsQueue, dispatch } = useElevator();

  const callElevator = (floor) => {
    if (callsQueue.some((call) => call.floor === floor && !call.done)) return;
    dispatch({ type: "ADD_CALL", payload: { floor } });

    dispatch({ type: "ASSIGN_CALL", payload: { call: { floor } } });
    console.log(`Elevator called to floor ${floor}`);
  };

  useEffect(() => {}, [callsQueue]);

  return (
    <>
      {Array.from({ length: numberOfFloors }, (_, floorIndex) => {
        const floorNumber = numberOfFloors - floorIndex - 1;

        return (
          <div key={floorIndex} className="board-row">
            <div className="floorTitle">
              {floorIndex === numberOfFloors - 1
                ? "Ground Floor"
                : `Floor #${floorNumber}`}
            </div>

            <div
              className="floor-row"
              style={{
                gridTemplateColumns: `repeat(${numberOfElevators}, 1fr)`,
              }}
            >
              {Array.from(
                { length: numberOfElevators },
                (_, elevatorCellIndex) => {
                  const elevator = elevators[elevatorCellIndex];
                  const elevatorArrived = elevator.currentFloor === floorNumber;

                  return (
                    <div key={elevatorCellIndex} className="board-cell">
                      {elevatorArrived && (
                        <img
                          src={liftIcon}
                          alt="elevator Icon"
                          className={`elevator-icon elevator-${elevator.status}`}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>

            <button
              onClick={() => callElevator(floorNumber)}
              className={`call-button ${
                callsQueue.some(
                  (call) => call.floor === floorNumber && !call.done
                )
                  ? "waiting"
                  : ""
              }`}
            >
              {callsQueue.some(
                (call) => call.floor === floorNumber && !call.done
              )
                ? "waiting"
                : `Call ${floorNumber}`}
            </button>
          </div>
        );
      })}
    </>
  );
};

export default FloorRow;
