
## Setup

### Clone repository
git clone https://github.com/omri9180/elevators-control.git

### Enter project folder
cd elevators-control

### Install dependencies
npm install

### Run locally
npm run dev


## Dispatch Algorithm
I chose an algorithm that prioritizes elevators based on the fastest estimated time of arrival (ETA) for each incoming call.  
For every call, the system calculates the expected arrival time for all elevators and assigns the call to the elevator with the minimal ETA.

Initially, I implemented a solution based on the closest elevator. While it worked, it required multiple condition checks and became harder to maintain.  
Switching to an ETA-based calculation simplified the logic and provided a more scalable and accurate dispatching solution.

## One Key Design Decision

The decision to use `useReducer` allowed me to manage the system state in a centralized and predictable way, instead of maintaining many separate local states across components.

This approach keeps the logic organized, easier to reason about, and more maintainable as the system grows.

An alternative approach would have been using local state per component, but that would have increased complexity and made the system harder to manage and extend.


## One Technical Challenge

One of the main challenges in this project was managing real-time behavior in a simulation that requires continuous updates, such as elevator movement, door timing, and call handling.

To overcome this, I used a reference (`useRef`) to keep access to the most up-to-date state inside interval-based logic.  
This allowed the simulation to remain accurate and responsive without running into stale state issues during runtime.
