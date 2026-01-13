import "./FloorRow.css";
import { useElevator } from "../../hooks/useElevator";

const FloorRow = ({ numberOfFloors, numberOfElevators }) => {
  const { dispatch} = useElevator();

  const callElevator = (floor) => {
    dispatch({ type: "ADD_CALL", payload: { floor } });
  }

  return (
    <>
      {Array.from({ length: numberOfFloors }, (_, floorIndex) => (
        <div key={floorIndex} className="board-row">
          <div className="floorTitle">
            {floorIndex === numberOfFloors - 1
              ? "Ground Floor"
              : `Floor #${numberOfFloors - floorIndex - 1}`}
          </div>

          <div
            className="floor-row"
            style={{ gridTemplateColumns: `repeat(${numberOfElevators}, 1fr)` }}
          >
            {Array.from({ length: numberOfElevators }, (_, floorCellIndex) => (
              <div key={floorCellIndex} className="board-cell">
                {floorCellIndex + 1}
              </div>
            ))}
          </div>

          <button onClick={()=> callElevator(numberOfFloors - floorIndex - 1)} className="call-button">
            Call {numberOfFloors - floorIndex - 1}
          </button>
        </div>
      ))}
    </>
  );
};

export default FloorRow;
