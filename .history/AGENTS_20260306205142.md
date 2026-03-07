## Implementation guardrails

- Do not combine simulation logic, rendering logic, and React UI logic in the same file.
- Keep circuit definitions in `src/circuits/`.
- Keep simulation engine code in `src/simulation/`.
- Keep SVG rendering code in `src/renderer/` or `src/components/circuit/`.
- Do not hardcode the circuit graph inside React components.
- Do not implement Primitive/Optimized switching as a cosmetic label change.
- Primitive and Optimized modes must use distinct circuit graphs.
- Do not add 4-bit logic, extra ALU operations, backend code, or persistence during MVP work.
- Before editing code, briefly state:
  1. which task you are implementing,
  2. which files you will modify,
  3. what will remain out of scope.
- After each task, verify the app still runs locally if the environment allows it.
- If a task is too large, split it into smaller subtasks and append them to `TASKS.md` before continuing.
- Prefer small commits after each completed task.
- Stop after one coherent task is finished, summarize changes, and identify the next unchecked task.
