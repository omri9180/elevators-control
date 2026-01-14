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
