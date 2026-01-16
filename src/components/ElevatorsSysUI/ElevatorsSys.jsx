import "./ElevatorsSys.css";
import { useElevator } from "../../hooks/useElevator";
import liftIcon from "../../assets/lift.png";
import bellIcon from "../../assets/bell.png";
import { useEffect, useState } from "react";
import { estimateTime } from "../../logic/callController";

const FloorRow = ({ numberOfFloors, numberOfElevators }) => {
  const { elevators, callsQueue, dispatch } = useElevator();
  const [showTime, setShowTime] = useState({});

  const callElevator = (floor) => {
    if (callsQueue.some((call) => call.floor === floor && !call.done)) return;
    dispatch({ type: "ADD_CALL", payload: { floor } });

    dispatch({ type: "ASSIGN_CALL", payload: { call: { floor } } });
  };

  useEffect(() => {
    callsQueue.forEach((call) => {
      if (call.done) return;
      if (call.assignedTo == null) return;

      const elevator = elevators.find((e) => e.id === call.assignedTo);
      if (!elevator) return;

      const key = `${call.floor}-${call.assignedTo}`;
      if (showTime[key] != null) return;

      const etaMs = estimateTime(elevator, call.floor);

      setShowTime((prev) => ({
        ...prev,
        [key]: etaMs,
      }));
    });

    callsQueue.forEach((call) => {
      if (!call.done) return;
      if (call.assignedTo == null) return;

      const key = `${call.floor}-${call.assignedTo}`;

      if (showTime[key] == null) return;

      setShowTime((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    });
  }, [callsQueue, elevators, showTime]);

  return (
    <div className="board-wrapper">
      <div className="shaft-overlay">
        {elevators.map((elevator, colIndex) => {
          if (!elevator) return null;

          const rowFromTop = numberOfFloors - 1 - elevator.currentFloor;

          const x = colIndex * 90;
          const y = rowFromTop * 60;

          return (
            <div
              key={elevator.id}
              className="shaft-elevator"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <img
                src={liftIcon}
                alt="elevator Icon"
                className={`elevator-icon elevator-${elevator.status}`}
              />
            </div>
          );
        })}
      </div>
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
                    const showTimeKey = `${floorNumber}-${elevator?.id}`;
                    const elevatorDurationMs = showTime[showTimeKey];

                    return (
                      <div key={elevatorCellIndex} className="board-cell">
                        {elevatorDurationMs != null && (
                          <div className="duration-show">
                            arrive in {(elevatorDurationMs / 1000).toFixed(1)}s
                          </div>
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
                ) ? (
                  "waiting"
                ) : (
                  <>
                    call{" "}
                    <img
                      src={bellIcon}
                      alt="Call Elevator Bell"
                      className="elevator-bell-button"
                    />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </>
    </div>
  );
};

export default FloorRow;
