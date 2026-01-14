import { bestElevatorReducer } from "./callController";

export const elevatorsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CALL": {
        console.log("ADD_CALL:", action.payload.floor);
  console.log("callsQueue before:", state.callsQueue);
      const newCall = {
        floor: action.payload.floor,
        time: Date.now(),
        done: false,
      };

      console.log("callsQueue after:", [...state.callsQueue, newCall]);
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

      if (!bestElevator) return state;

      return {
        ...state,
        elevators: state.elevators.map((elevator) =>
          elevator.id === bestElevator.id
            ? {
                ...elevator,
                targetFloors: [...elevator.targetFloors, call.floor],
                status: "moving",
              }
            : elevator
        ),
        callsQueue: state.callsQueue.map((c) =>
          c.floor === call.floor ? { ...c, assignedTo: bestElevator.id } : c
        ),
      };
    }
    case "MOVE_ELEVATOR": {
      const { elevatorId } = action.payload;

      return {
        ...state,
        elevators: state.elevators.map((elevator) => {
          if (elevator.id !== elevatorId || elevator.targetFloors.length === 0)
            return elevator;

          const targetFloor = elevator.targetFloors[0];
          let nextFloor = elevator.currentFloor;
          if (targetFloor > elevator.currentFloor) nextFloor++;
          else if (targetFloor < elevator.currentFloor) nextFloor--;

          if (nextFloor === targetFloor) {
            return{
              ...elevator,
              currentFloor: nextFloor,
              status: "doors_open",
              targetFloors: elevator.targetFloors.slice(1),
              direction: null,
            }
          }

          return {
            ...elevator,
            currentFloor: nextFloor,
            status: "moving",
            direction: nextFloor > elevator.currentFloor ? "up" : "down",
          };
        }),
      };
    }
    case "ARRIVE_FLOOR": {
      const { elevatorId } = action.payload;

      return {
        ...state,
        elevators: state.elevators.map((elevator) => {
          elevator.id === elevatorId
            ? {
                ...elevator,
                targetFloors: elevator.targetFloors.slice(1),
                status: "doors_open",
              }
            : elevator;
        }),
      };
    }
    case "REMOVE_CALL": {
      const { callFloor } = action.payload;
      return null;
    }
    case "SET_DIRECTION": {
      const { elevatorId, direction } = action.payload;
      return null;
    }
    default:
      return state;
  }
};
