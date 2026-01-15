import "./Board.css";
import FloorRow from "../FloorRow/FloorRow";
import { NUMBER_OF_FLOORS, NUMBER_OF_ELEVATORS } from "../../logic/settings";

const Board = () => {

  return (
    <div className="board-main">
      <div className="elevator-board">
        <FloorRow numberOfFloors={NUMBER_OF_FLOORS} numberOfElevators={NUMBER_OF_ELEVATORS} />
      </div>
    </div>
  );
};
export default Board;

