import "./Board.css";
import ElevatorsSys from "../ElevatorsSysUI/ElevatorsSys";
import { NUMBER_OF_FLOORS, NUMBER_OF_ELEVATORS } from "../../logic/settings";

const Board = () => {
  return (
    <div className="board-main">
      <div className="elevator-board">
        <ElevatorsSys
          numberOfFloors={NUMBER_OF_FLOORS}
          numberOfElevators={NUMBER_OF_ELEVATORS}
        />
      </div>
    </div>
  );
};
export default Board;
