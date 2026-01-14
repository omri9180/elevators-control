import { useReducer, useEffect } from "react";
import { elevatorsReducer } from "../logic/elevatorsReducer";

const FLOORS_NUM = 10;
const ELEVATORS_NUM = 5;
const ELEVATOR_TIME_MOVING = 1000;

const initializeElevators = () => {
  return Array.from({ length: ELEVATORS_NUM }, (_, index) => ({
    id: index + 1,
    currentFloor: 0,
    targetFloors: [],
    direction: "up",
    status: "idle",
    lastCallTime: null,
  }));
};

const initState = {
  elevators: initializeElevators(),
  callsQueue: [],
};

export const useElevator = () => {
  const [state, dispatch] = useReducer(elevatorsReducer, initState);

  useEffect(() => {
    const elevatorIntervals = setInterval(() => {
      state.elevators.forEach((elevator) => {
        if (elevator.targetFloors.length === 0) return;

        dispatch({
          type: "MOVE_ELEVATOR",
          payload: { elevatorId: elevator.id },
        });

        if (elevator.currentFloor === elevator.targetFloors[0]) {
          dispatch({
            type: "ARRIVE_FLOOR",
            payload: { elevatorId: elevator.id },
          });
        }
      });
    }, ELEVATOR_TIME_MOVING);

    console.log("Elevators state:", state.elevators);
    console.log("Calls queue:", state.callsQueue);

    return () => clearInterval(elevatorIntervals);
  }, [state.elevators]);

  return {
    elevators: state.elevators,
    callsQueue: state.callsQueue,
    dispatch,
  };
};
