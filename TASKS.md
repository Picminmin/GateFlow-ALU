# GateFlow ALU Task List

## Phase 0: Repository setup
- [x] Initialize Vite + React + TypeScript project
- [x] Create initial folder structure
- [x] Add README-based project overview
- [x] Confirm app runs locally with `npm run dev`

## Phase 1: Core types and architecture
- [x] Define shared TypeScript types for nodes, edges, circuits, events, and simulation state
- [x] Create circuit definition module structure
- [x] Create simulation engine module structure
- [x] Create renderer module structure
- [x] Create UI component structure

## Phase 2: Static full adder view
- [x] Implement static SVG rendering for a 1-bit full adder
- [x] Render input nodes A, B, Cin
- [x] Render output nodes Sum, Cout
- [x] Render gates and wires with readable labels
- [ ] Add a clean educational layout

## Phase 3: Circuit mode support
- [ ] Define Primitive mode circuit graph
- [ ] Define Optimized mode circuit graph
- [ ] Implement mode switch UI
- [ ] Make mode switching replace the actual rendered graph

## Phase 4: Simulation engine
- [ ] Implement input assignment logic
- [ ] Implement gate evaluation logic
- [ ] Implement discrete-event scheduling
- [ ] Implement propagation delays
- [ ] Implement simulation state updates over time
- [ ] Ensure outputs are logically correct

## Phase 5: Animation
- [ ] Represent active signals as moving dots on wires
- [ ] Highlight active wires
- [ ] Highlight gate outputs when active
- [ ] Add time-based animation loop
- [ ] Support deterministic step-by-step playback

## Phase 6: Controls and UI
- [ ] Add inputs panel for A, B, Cin
- [ ] Add playback controls: play, pause, reset, step
- [ ] Add speed control
- [ ] Add selected gate details panel
- [ ] Add bottom event log panel

## Phase 7: Validation and cleanup
- [ ] Confirm Sum and Cout are correct for all 8 input combinations
- [ ] Confirm Primitive and Optimized modes differ structurally
- [ ] Confirm stepping works reliably
- [ ] Refactor for readability
- [ ] Improve labels and visual clarity
- [ ] Update README with run instructions

## Post-MVP tasks
- [ ] Add half adder mode
- [ ] Add 4-bit ripple-carry adder
- [ ] Add preset examples
- [ ] Add NOR-only mode
- [ ] Add simple ALU operation switching
