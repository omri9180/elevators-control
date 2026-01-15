import { useReducer, useEffect, useRef } from "react";
import { elevatorsReducer } from "../logic/elevatorsReducer";
import elevatorSound from "../assets/sounds/elevator-ding-dong.mp3";
import {
  ELEVATOR_TIME_DOORS,
  ELEVATOR_TIME_MOVING,
  NUMBER_OF_ELEVATORS,
} from "../logic/settings";

const initializeElevators = () => {
  return Array.from({ length: NUMBER_OF_ELEVATORS }, (_, index) => ({
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
  const prevStatusRef = useRef([]);
  const doorCloseRef = useRef({});
  const doorTimersRef = useRef({});

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    state.elevators.forEach((elevator, i) => {
      const prevStatus = prevStatusRef.current[i];
      if (prevStatus !== "doors_open" && elevator.status === "doors_open") {
        const sound = new Audio(elevatorSound);
        sound.currentTime = 0;
        sound.play();
      }
    });
    prevStatusRef.current = state.elevators.map((e) => e.status);
  }, [state.elevators]);

  useEffect(() => {
    const elevatorIntervals = setInterval(() => {
      const currentState = stateRef.current;

      currentState.elevators.forEach((elevator) => {
        if (!elevator) return;
        if (elevator.targetFloors.length === 0) return;

        if (
          elevator.status === "doors_open" ||
          elevator.status === "doors_closing"
        )
          return;

        dispatch({
          type: "MOVE_ELEVATOR",
          payload: { elevatorId: elevator.id },
        });
      });
    }, ELEVATOR_TIME_MOVING);

    return () => clearInterval(elevatorIntervals);
  }, []);

  const clearTimer = (elevatorId) => {
    const time1 = doorTimersRef.current[`${elevatorId}_time1`];
    const time2 = doorTimersRef.current[`${elevatorId}_time2`];

    if (typeof time1 === "number") clearTimeout(time1);
    if (typeof time2 === "number") clearTimeout(time2);

    delete doorTimersRef.current[`${elevatorId}_time1`];
    delete doorTimersRef.current[`${elevatorId}_time2`];
    delete doorCloseRef.current[elevatorId];
  };

  useEffect(() => {
    state.elevators.forEach((elevator) => {
      if (!elevator) return;
      if (elevator.status !== "doors_open") return;
      if (doorCloseRef.current[elevator.id]) return;
      doorCloseRef.current[elevator.id] = true;

      const time1 = setTimeout(() => {
        dispatch({
          type: "SET_STATUS",
          payload: { elevatorId: elevator.id, status: "idle" },
        });

        const time2 = setTimeout(() => {
          const latest = stateRef.current.elevators.find(
            (e) => e.id === elevator.id
          );

          const hasMoreTargets = !!latest && latest.targetFloors.length > 0;
          const nextTarget = hasMoreTargets ? latest.targetFloors[0] : null;

          dispatch({
            type: "SET_STATUS",
            payload: {
              elevatorId: elevator.id,
              status: hasMoreTargets ? "moving" : "idle",
              direction: hasMoreTargets
                ? nextTarget > latest.currentFloor
                  ? "up"
                  : "down"
                : null,
            },
          });

          clearTimer(elevator.id);
        }, ELEVATOR_TIME_DOORS);

        doorTimersRef.current[`${elevator.id}_time2`] = time2;
      }, ELEVATOR_TIME_DOORS);

      doorTimersRef.current[`${elevator.id}_time1`] = time1;
    });

    // cleanup
    return () => {
      Object.keys(doorCloseRef.current).forEach((idStr) => {
        clearTimer(Number(idStr));
      });
    };
  }, [state.elevators, dispatch]);

  return {
    elevators: state.elevators,
    callsQueue: state.callsQueue,
    dispatch,
  };
};
