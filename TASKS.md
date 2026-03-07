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
- [x] Add a clean educational layout

## Phase 3: Circuit mode support
- [x] Define Primitive mode circuit graph
- [x] Define Optimized mode circuit graph
- [x] Implement mode switch UI
- [x] Make mode switching replace the actual rendered graph

## Phase 4: Simulation engine
- [x] Implement input assignment logic
- [x] Implement gate evaluation logic
- [x] Implement discrete-event scheduling
- [x] Implement propagation delays
- [x] Implement simulation state updates over time
- [x] Ensure outputs are logically correct

## Phase 5: Animation
- [x] Represent active signals as moving dots on wires
- [x] Highlight active wires
- [x] Highlight gate outputs when active
- [x] Add time-based animation loop
- [x] Support deterministic step-by-step playback

## Phase 6: Controls and UI
- [x] Add inputs panel for A, B, Cin
- [x] Add playback controls: play, pause, reset, step
- [x] Add speed control
- [x] Add selected gate details panel
- [x] Add bottom event log panel

## Phase 7: Validation and cleanup
- [x] Confirm Sum and Cout are correct for all 8 input combinations
- [x] Confirm Primitive and Optimized modes differ structurally
- [x] Confirm stepping works reliably
- [x] Refactor for readability
- [x] Improve labels and visual clarity
- [x] Update README with run instructions

## Post-MVP tasks
- [ ] Add half adder mode
- [ ] Add 4-bit ripple-carry adder
- [ ] Add preset examples
- [ ] Add NOR-only mode
- [ ] Add simple ALU operation switching
