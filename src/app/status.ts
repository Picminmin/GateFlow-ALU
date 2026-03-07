export type Language = 'en' | 'ja';

export function truthTableStatusMessage(isValid: boolean, mismatchCount: number, lang: Language): string {
  if (lang === 'ja') {
    return isValid
      ? '真理値表チェック: 合格（8通りすべて一致）'
      : `真理値表チェック: 不合格（不一致 ${mismatchCount} 件）`;
  }
  return isValid
    ? 'Truth table check: pass (all 8 input combinations)'
    : `Truth table check: fail (${mismatchCount} mismatch(es))`;
}

export function globalTruthTableStatusMessage(allPass: boolean, lang: Language): string {
  if (lang === 'ja') {
    return allPass
      ? '全体チェック: Primitive / Optimized ともに全8行の真理値表に一致。'
      : '全体チェック: いずれかのモードが真理値表検証に失敗。';
  }
  return allPass
    ? 'Global check: Primitive and Optimized both match all 8 full-adder truth-table rows.'
    : 'Global check: At least one mode fails truth-table validation.';
}

export function structureStatusMessage(
  structuresDiffer: boolean,
  primitiveNodeCount: number,
  optimizedNodeCount: number,
  lang: Language,
): string {
  if (lang === 'ja') {
    return structuresDiffer
      ? `構造チェック: Primitive（${primitiveNodeCount}ノード）と Optimized（${optimizedNodeCount}ノード）は異なる構造です。`
      : '構造チェック: Primitive と Optimized が構造的に区別できていません。';
  }
  return structuresDiffer
    ? `Structure check: Primitive (${primitiveNodeCount} nodes) and Optimized (${optimizedNodeCount} nodes) differ.`
    : 'Structure check: Primitive and Optimized graphs are not structurally distinct.';
}

export function steppingStatusMessage(isDeterministic: boolean, lang: Language): string {
  if (lang === 'ja') {
    return isDeterministic
      ? 'ステップ実行チェック: 同じ操作列で同一スナップショットを再現。'
      : 'ステップ実行チェック: 同じ操作列で結果が分岐。';
  }
  return isDeterministic
    ? 'Stepping check: repeated step sequences produce identical snapshots.'
    : 'Stepping check: repeated step sequences diverge.';
}
