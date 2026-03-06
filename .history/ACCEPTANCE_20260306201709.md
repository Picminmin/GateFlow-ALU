# GateFlow ALU Acceptance Criteria

## MVP acceptance criteria

The MVP is accepted only if all of the following are true.

---

## 1. Local execution

- [ ] The project installs successfully
- [ ] The project runs locally with `npm install` and `npm run dev`
- [ ] The app opens in a browser without requiring a backend

---

## 2. Circuit visualization

- [ ] A 1-bit full adder is rendered on screen
- [ ] The rendered view includes gates, wires, inputs, and outputs
- [ ] The layout is readable and educational

---

## 3. Inputs and outputs

- [ ] The user can change A
- [ ] The user can change B
- [ ] The user can change Cin
- [ ] The app shows Sum
- [ ] The app shows Cout

---

## 4. Logical correctness

For all input combinations of A, B, and Cin:

- [ ] Sum is correct
- [ ] Cout is correct

The expected truth table is:

| A | B | Cin | Sum | Cout |
|---|---|-----|-----|------|
| 0 | 0 | 0   | 0   | 0    |
| 0 | 0 | 1   | 1   | 0    |
| 0 | 1 | 0   | 1   | 0    |
| 0 | 1 | 1   | 0   | 1    |
| 1 | 0 | 0   | 1   | 0    |
| 1 | 0 | 1   | 0   | 1    |
| 1 | 1 | 0   | 0   | 1    |
| 1 | 1 | 1   | 1   | 1    |

---

## 5. Signal propagation visualization

- [ ] Signals are shown as moving dots on wires
- [ ] The direction of propagation is visually understandable
- [ ] Active wires are highlighted
- [ ] Gate output changes are visible

---

## 6. Circuit mode switching

- [ ] The app supports Primitive mode
- [ ] The app supports Optimized mode
- [ ] Switching mode changes the actual circuit graph
- [ ] Primitive and Optimized modes differ in structure and/or propagation depth
- [ ] Mode switching is not implemented as a purely cosmetic change

---

## 7. Playback controls

- [ ] The app supports Play
- [ ] The app supports Pause
- [ ] The app supports Reset
- [ ] The app supports Step
- [ ] The app supports speed control

---

## 8. Inspection and logging

- [ ] Clicking a gate shows gate details
- [ ] Gate details include type, current inputs, current output, and delay
- [ ] An event log is shown
- [ ] The event log updates as the simulation progresses

---

## 9. Code quality

- [ ] Circuit definitions are separated from simulation logic
- [ ] Simulation logic is separated from rendering logic
- [ ] The code is readable and modular
- [ ] The codebase is extendable for future circuits such as 4-bit ripple-carry adder

---

## 10. Explicit non-goals for MVP

The MVP does not need to include:

- subtraction
- multiplication
- backend
- save/load
- user accounts
- complete ALU support
- NOR-only mode
