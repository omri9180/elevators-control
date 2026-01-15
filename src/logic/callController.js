import { ELEVATOR_TIME_MOVING,ELEVATOR_TIME_DOORS } from "./settings";
export const bestElevatorReducer = (elevator, callFloor) => {
  if (elevator.length === 0) return null;
  const idleElevators = elevator.filter((e) => e.status === "idle");

  if (idleElevators.length > 0) {
    return idleElevators.reduce((prev, curr) =>
      Math.abs(curr.currentFloor - callFloor) <
      Math.abs(prev.currentFloor - callFloor)
        ? curr
        : prev,
        idleElevators[0]
    );
  }

  const movingElevators = elevator.filter(
    (e) =>
      (e.direction === "up" && e.currentFloor <= callFloor) ||
      (e.direction === "down" && e.currentFloor >= callFloor)
  );

  if (movingElevators.length > 0) {
    return movingElevators.reduce(
      (prev, curr) =>
        Math.abs(curr.currentFloor - callFloor) <
        Math.abs(prev.currentFloor - callFloor)
          ? curr
          : prev,
      movingElevators[0]
    );
  }

  return elevator[0];
};

const estimateTime = (elevator, callFloor) => {
  const{ currentFloor, targetFloors, status } = elevator;

  if(!targetFloors || targetFloors.length ===0){
    return Math.abs(currentFloor-callFloor) * ELEVATOR_TIME_MOVING;
  }

  const doorsTime = status ==="doors_open" || status === "doors_closing" ? ELEVATOR_TIME_DOORS : 0;
  
  let time = doorsTime;
  let elevatorFloor = currentFloor;

  for(const floor of targetFloors){
    time += Math.abs(elevatorFloor - floor) * ELEVATOR_TIME_MOVING;
    time += ELEVATOR_TIME_DOORS;
    elevatorFloor = floor;
  }
  time += Math.abs(elevatorFloor - callFloor) * ELEVATOR_TIME_MOVING;
  return time;
}