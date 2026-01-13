
export const bestElevatorReducer = (elevator, callFloor) => {

    const idleElevators = elevator.filter(e => e.status === 'IDLE');

    if (idleElevators.length === 0) {
        return idleElevators.reduce((prev, curr)=> 
        Math.abs(curr.currentFloor - callFloor) < Math.abs(prev.currentFloor - callFloor) ? curr : prev);
    }

    const movingElevators = elevator.filter(e=> 
    (e.direction === 'up' && e.currentFloor <= callFloor) ||
    (e.direction === 'down' && e.currentFloor >= callFloor)
    )

    if(movingElevators.length>0){
        return movingElevators.reduce((prev, curr)=>
        Math.abs(curr.currentFloor - callFloor) < Math.abs(prev.currentFloor - callFloor) ? curr : prev);
    }

    return elevator[0];
}