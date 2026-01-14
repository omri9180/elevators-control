import "./FloorRow.css";
import { useElevator } from "../../hooks/useElevator";
import liftIcon from "../../assets/lift.png";

const FloorRow = ({ numberOfFloors, numberOfElevators }) => {
  const { elevators, dispatch } = useElevator();

  const callElevator = (floor) => {
    dispatch({ type: "ADD_CALL", payload: { floor } });

    dispatch({type: "ASSIGN_CALL", payload: {call: {floor}}});
    console.log(`Elevator called to floor ${floor}`);
  };

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
                          className="elevator-icon"
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>

            <button
              onClick={() => callElevator(floorNumber)}
              className="call-button"
            >
              Call {floorNumber}
            </button>
          </div>
        );
      })}
    </>
  );
};

export default FloorRow;
