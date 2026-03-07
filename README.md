# GateFlow ALU

GateFlow ALU is a local educational web app that visualizes 1-bit full-adder circuits at gate level.

## MVP Features

- 1-bit full adder inputs: `A`, `B`, `Cin`
- Outputs: `Sum`, `Cout`
- Primitive and Optimized circuit modes (distinct graphs)
- SVG circuit rendering (gates, wires, labels)
- Active signal dots and wire/gate highlighting
- Playback controls: Play, Pause, Reset, Step
- Speed control
- Gate details panel
- Bottom event log panel

## Local Setup

Requirements:

- Node.js 18+ (or compatible current LTS)
- npm

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  app/
  components/
  circuits/
  simulation/
  renderer/
  types/
  utils/
```

## Scope Notes

MVP intentionally excludes:

- 4-bit circuits
- additional ALU operations
- backend/persistence
- NOR-only mode
