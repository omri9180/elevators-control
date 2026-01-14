export const bestElevatorReducer = (elevator, callFloor) => {
  const idleElevators = elevator.filter((e) => e.status === "idle");

  if (idleElevators.length > 0) {
    return idleElevators.reduce((prev, curr) =>
      Math.abs(curr.currentFloor - callFloor) <
      Math.abs(prev.currentFloor - callFloor)
        ? curr
        : prev
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

  return elevator.length > 0 ? elevator[0] : null;
};
