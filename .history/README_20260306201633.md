# GateFlow ALU

GateFlow ALU is an interactive educational web app that visualizes how basic ALU operations are processed at the logic-gate level in real time.

The main idea is to let users *see computation happen*:
signals travel through wires as moving dots, logic gates change state, and users can compare different circuit implementations that compute the same result.

## Goal

This project aims to make digital logic and ALU behavior visually understandable.

Instead of showing only input/output values, the app should show:

- logic gates and wires
- signal propagation over time
- moving dots representing data flow
- propagation delays
- differences between multiple circuit implementations

## MVP

The first version should focus on a **1-bit full adder**.

### Inputs
- A
- B
- Cin

### Outputs
- Sum
- Cout

### Required MVP features
- Render the circuit as an SVG-based interactive visualization
- Animate signals as moving glowing dots on wires
- Highlight active wires and gate outputs
- Provide play / pause / reset / step controls
- Provide animation speed control
- Support two circuit modes:
  - Primitive mode
  - Optimized mode
- Switching mode must change the actual circuit graph, not just the labels or appearance
- Show a gate detail panel for the selected gate
- Show an event log of signal changes over time

## Future scope

After the MVP works, the project may be extended with:

- half adder visualization
- 4-bit ripple-carry adder
- NOR-only implementation mode
- additional ALU operations such as AND, OR, XOR, NOT
- zero / carry / overflow flags
- preset demonstrations
- teaching overlays and guided walkthroughs

## Tech stack

Planned stack for the MVP:

- React
- TypeScript
- Vite
- SVG for rendering
- No backend in the first version

## Design principles

- Educational first
- Visually clear
- Deterministic simulation
- Modular architecture
- Easy to extend with new circuits

## Repository structure (planned)

```text
gateflow-alu/
├─ README.md
├─ SPEC.md
├─ TASKS.md
├─ ACCEPTANCE.md
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ circuits/
│  ├─ simulation/
│  ├─ renderer/
│  ├─ types/
│  └─ utils/
