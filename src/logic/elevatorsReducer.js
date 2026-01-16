import { bestElevatorReducer } from "./callController";

export const elevatorsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CALL": {
      const { floor } = action.payload;

      if (state.callsQueue.some((c) => c.floor === floor && !c.done))
        return state;

      const createdAt = Date.now();

      const newCall = {
        id: `${createdAt}-${Math.random().toString(16).slice(2)}`,
        floor,
        createdAt,
        arrivedAt: null,
        durationMs: null,
        assignedTo: null,
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
        elevators: state.elevators.map((e) =>
          e.id === elevatorId
            ? {
                ...e,
                status,
              }
            : e
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

      let arrivedFloor = null;

      const newElevators = state.elevators.map((elevator) => {
        if (elevator.id !== elevatorId || elevator.targetFloors.length === 0)
          return elevator;

        const targetFloor = elevator.targetFloors[0];
        let nextFloor = elevator.currentFloor;

        if (targetFloor > elevator.currentFloor) nextFloor++;
        else if (targetFloor < elevator.currentFloor) nextFloor--;

        if (nextFloor === targetFloor) {
          arrivedFloor = nextFloor;
          return {
            ...elevator,
            currentFloor: nextFloor,
            status: "doors_open",
            targetFloors: elevator.targetFloors.slice(1),
          };
        }

        return {
          ...elevator,
          currentFloor: nextFloor,
          status: "moving",
        };
      });

      if (arrivedFloor === null) {
        return { ...state, elevators: newElevators };
      }

      const nowTime = Date.now();
      const newCallsQueue = state.callsQueue.map((call) => {
        if (call.done) return call;

        if (call.floor !== arrivedFloor) return call;
        if (call.assignedTo !== elevatorId) return call;

        return {
          ...call,
          done: true,
          arrivedAt: nowTime,
          durationMs: nowTime - call.createdAt,
        };
      });

      return {
        ...state,
        elevators: newElevators,
        callsQueue: newCallsQueue,
      };
    }
    case "CLEANUP_CALLS": {
      const { olderThanMs } = action.payload;
      const nowTime = Date.now();

      return {
        ...state,
        callsQueue: state.callsQueue.filter(
          (call) => nowTime - call.createdAt <= olderThanMs
        ),
      };
    }

    default:
      return state;
  }
};
