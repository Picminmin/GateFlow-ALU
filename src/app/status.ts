export function truthTableStatusMessage(isValid: boolean, mismatchCount: number): string {
  return isValid
    ? 'Truth table check: pass (all 8 input combinations)'
    : `Truth table check: fail (${mismatchCount} mismatch(es))`;
}

export function globalTruthTableStatusMessage(allPass: boolean): string {
  return allPass
    ? 'Global check: Primitive and Optimized both match all 8 full-adder truth-table rows.'
    : 'Global check: At least one mode fails truth-table validation.';
}

export function structureStatusMessage(structuresDiffer: boolean, primitiveNodeCount: number, optimizedNodeCount: number): string {
  return structuresDiffer
    ? `Structure check: Primitive (${primitiveNodeCount} nodes) and Optimized (${optimizedNodeCount} nodes) differ.`
    : 'Structure check: Primitive and Optimized graphs are not structurally distinct.';
}

export function steppingStatusMessage(isDeterministic: boolean): string {
  return isDeterministic
    ? 'Stepping check: repeated step sequences produce identical snapshots.'
    : 'Stepping check: repeated step sequences diverge.';
}
