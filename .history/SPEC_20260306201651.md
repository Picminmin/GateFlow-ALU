
---

# 2. SPEC.md

```md
# GateFlow ALU Specification

## 1. Project overview

GateFlow ALU is a local web application for visualizing ALU-related logic circuits in real time.

The application should help users understand how basic arithmetic and logic operations are processed internally by showing:

- logic gates
- interconnecting wires
- time-dependent signal propagation
- moving dots representing data traveling through the circuit
- different circuit implementations for the same logical function

The application is educational and interactive rather than photorealistic.

---

## 2. Main concept

The user provides digital inputs.
The system simulates gate-level propagation through a circuit.
The UI visualizes the circuit and shows how signals move and change over time.

A key feature is comparison between circuit implementations.

For example, the same 1-bit full adder should be viewable in:

- Primitive mode
- Optimized mode

These modes must use different circuit graphs, not merely a cosmetic change.

---

## 3. MVP scope

The MVP is limited to a **1-bit full adder visualization**.

### Inputs
- A: 0 or 1
- B: 0 or 1
- Cin: 0 or 1

### Outputs
- Sum: 0 or 1
- Cout: 0 or 1

### Supported modes
- Primitive mode
- Optimized mode

### Required controls
- Play
- Pause
- Reset
- Step
- Speed control

### Required panels
- Left panel: inputs and mode selection
- Center panel: circuit visualization
- Right panel: selected gate details
- Bottom panel: event log

---

## 4. User stories

### Story 1
As a learner, I want to input A, B, and Cin values so that I can observe how a full adder computes Sum and Cout.

### Story 2
As a learner, I want to watch signals move along wires so that I can visually follow data flow through the circuit.

### Story 3
As a learner, I want to switch between Primitive and Optimized implementations so that I can compare their structures and propagation behavior.

### Story 4
As a learner, I want to step through the simulation one event at a time so that I can study timing and gate behavior carefully.

### Story 5
As a learner, I want to click a gate and inspect its inputs, output, type, and delay so that I can understand its local role in the circuit.

---

## 5. Functional requirements

### 5.1 Circuit rendering
The app must render the current circuit using SVG.

The visualization must include:
- gates
- wires
- labels
- input nodes
- output nodes

### 5.2 Signal animation
Signals must be represented as moving glowing dots along wires.

The animation should make it easy to see:
- when a signal is active
- which path it takes
- the direction of propagation

### 5.3 Gate state display
Each gate should visually indicate whether its output is currently 0 or 1.

### 5.4 Simulation engine
The simulation should be deterministic and implemented as a discrete-event simulation.

Each gate should have a small propagation delay.

### 5.5 Mode switching
Switching between Primitive and Optimized mode must replace the circuit graph being simulated and rendered.

This change must affect:
- nodes
- edges
- propagation path
- number of gates
- depth of propagation

### 5.6 Event log
The app must display an event log showing signal changes over time.

### 5.7 Gate inspection
Clicking a gate must show:
- gate id
- gate type
- current inputs
- current output
- propagation delay

---

## 6. Non-functional requirements

- The app should run locally in a browser
- No backend is required for the MVP
- The code should be readable and modular
- The codebase should be easy to extend with more circuits later
- The UI should prioritize clarity over visual complexity

---

## 7. Architecture requirements

The implementation should separate the following concerns:

### 7.1 Circuit definitions
Represent each circuit as typed graph data.

### 7.2 Simulation engine
Responsible for:
- input assignment
- event scheduling
- gate evaluation
- propagation updates

### 7.3 Renderer
Responsible for:
- gate layout rendering
- wire drawing
- moving dot animation
- active-state highlighting

### 7.4 UI layer
Responsible for:
- input controls
- playback controls
- mode switching
- gate selection
- event log rendering

---

## 8. Suggested data model

A circuit should conceptually contain:

- nodes
- edges
- input ids
- output ids

A node should contain:
- id
- type
- label
- x
- y
- delay

An edge should contain:
- id
- from
- to
- optional path points

A simulation state should contain:
- current logical values
- scheduled events
- elapsed time
- active moving signals
- selected gate

---

## 9. Circuit modes

### Primitive mode
A direct, explicit implementation using more intermediate gates.

### Optimized mode
A functionally equivalent implementation using fewer gates and/or lower propagation depth.

### Deferred mode
NOR-only mode is not required in the MVP, but the architecture should allow it later.

---

## 10. Out of scope for MVP

The following are explicitly not required in the first version:

- full ALU implementation
- subtraction
- multiplication
- backend
- authentication
- save/load feature
- multiplayer or sharing
- sound effects
- photorealistic hardware UI
- advanced theorem-based circuit minimization engine

---

## 11. Post-MVP roadmap

After the MVP works, possible next steps are:

1. half adder
2. 4-bit ripple-carry adder
3. preset examples such as 3 + 5
4. NOR-only mode
5. basic ALU operation switching
6. carry / zero / overflow flags
7. guided educational overlays

---

## 12. Success criteria

The MVP is successful if:

- the app runs locally
- a 1-bit full adder is visible
- the user can modify A, B, and Cin
- Sum and Cout are correct
- signals visibly propagate as moving dots
- Primitive and Optimized modes show different graphs
- the simulation can be played, paused, reset, and stepped
