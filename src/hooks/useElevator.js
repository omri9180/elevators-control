import { useReducer } from "react";
import { elevatorsReducer } from "../logic/elevatorsReducer";

const FLOORS_NUM = 10;
const ELEVATORS_NUM = 5;

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

  return {
    elevators: state.elevators,
    callsQueue: state.callsQueue,
    dispatch,
  };
};
