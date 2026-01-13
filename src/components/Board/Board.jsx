import "./Board.css";
import FloorRow from "../FloorRow/FloorRow";

const Board = () => {
  const NUMBER_OF_FLOORS = 10;
  const NUMBER_OF_ELEVATORS = 5;

  return (
    <div className="board-main">
      <div className="elevator-board">
        <FloorRow numberOfFloors={NUMBER_OF_FLOORS} numberOfElevators={NUMBER_OF_ELEVATORS} />
      </div>
    </div>
  );
};
export default Board;

