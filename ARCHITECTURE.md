# GateFlow ALU Architecture

## 1. Purpose of this document

This document defines the intended architecture of GateFlow ALU.

The project should remain easy to understand, easy to extend, and suitable for educational visualization.
To achieve that, the implementation must clearly separate:

- circuit definition
- simulation logic
- rendering
- user interface state

This separation is more important than early optimization.

---

## 2. Architectural principles

### 2.1 Educational clarity first
This project is an educational visualization tool.
Readable code and explicit structure are preferred over clever but hard-to-follow abstractions.

### 2.2 Separate data, behavior, and presentation
A circuit should be representable as data.
Simulation should operate on that data.
Rendering should visualize simulation state without owning the logic.

### 2.3 Deterministic simulation
The same circuit, inputs, delays, and playback settings should produce the same simulation result.

### 2.4 Extensibility
The MVP focuses on a 1-bit full adder, but the architecture should make it easy to add:

- half adder
- 4-bit ripple-carry adder
- NOR-only implementations
- basic ALU operation switching

### 2.5 Real graph switching
Circuit mode switching must replace the actual circuit graph.
It must not only hide or relabel nodes.

---

## 3. High-level architecture

The application should be organized into four main layers:

1. Circuit Definitions
2. Simulation Engine
3. Renderer
4. UI / App State

These layers should communicate in a clean and predictable direction.

```text
User Input
   ↓
UI / App State
   ↓
Simulation Engine
   ↓
Simulation Snapshot
   ↓
Renderer
