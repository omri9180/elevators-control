import { ELEVATOR_TIME_MOVING, ELEVATOR_TIME_DOORS } from "./settings";

export const bestElevatorReducer = (elevator, callFloor) => {
  if (!elevator || elevator.length === 0) return null;

  const bestElevator = elevator.filter((e) => e.status !== "doors_open");

  const bestElevatorList = bestElevator.length > 0 ? bestElevator : elevator;

  return bestElevatorList.reduce((best, curr) => {
    const bestTime = estimateTime(best, callFloor);
    const currTime = estimateTime(curr, callFloor);
    return currTime < bestTime ? curr : best;
  }, bestElevatorList[0]);
};

export const estimateTime = (elevator, callFloor) => {
  const { currentFloor, targetFloors, status } = elevator;

  if (!targetFloors || targetFloors.length === 0) {
    return Math.abs(currentFloor - callFloor) * ELEVATOR_TIME_MOVING;
  }

  const doorsTime =
    status === "doors_open" || status === "doors_closing"
      ? ELEVATOR_TIME_DOORS
      : 0;

  let time = doorsTime;
  let elevatorFloor = currentFloor;

  for (const floor of targetFloors) {
    time += Math.abs(elevatorFloor - floor) * ELEVATOR_TIME_MOVING;
    time += ELEVATOR_TIME_DOORS;
    elevatorFloor = floor;
  }
  time += Math.abs(elevatorFloor - callFloor) * ELEVATOR_TIME_MOVING;
  return time;
};
