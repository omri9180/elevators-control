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
    default:
      return state;
  }
};
