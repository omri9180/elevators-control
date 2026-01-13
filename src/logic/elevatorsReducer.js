import {bestElevatorReducer} from './callController';

export const elevatorsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CALL": {
        console.log("Reducer received ADD_CALL action:", action);
      const newCall = {
        floor: action.payload.floor,
        time: Date.now(),
        done: false,
      };
      return {
        ...state,
        callsQueue: [...state.callsQueue, newCall],
      };
    }
    case "SET_STATUS": {
      const { elevatorId, status } = action.payload;

      return {
        ...state,
        elevators: state.elevators.map((elevator) =>
          elevator.id === elevatorId ? { ...elevator, status } : elevator
        ),
      };
    }
    case "ASSIGN_CALL": {
      const { call } = action.payload;

      const bestElevator = bestElevatorReducer(state.elevators, call.floor);

      if(!bestElevator) return state;
      
      return {
        ...state,
        elevators: state.elevators.map((elevator) =>
          elevator.id === bestElevator.id
            ? {
                ...elevator,
                targetFloors: [...elevator.targetFloors, call.floor],
                status: "moving"} : elevator
        ),
        callsQueue: state.callsQueue.map((c) =>
          c.floor === call.floor ? {...call, assignedTo: bestElevator.id} : c
        ),
      }

      
    }
    default:
      return state;
  }
};