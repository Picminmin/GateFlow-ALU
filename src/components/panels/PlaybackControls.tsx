interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onSpeedChange: (nextSpeed: number) => void;
  lang: 'en' | 'ja';
}

export function PlaybackControls({
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onStep,
  onSpeedChange,
  lang,
}: PlaybackControlsProps) {
  return (
    <section className="panel" aria-label={lang === 'ja' ? '再生コントロール' : 'Playback controls'}>
      <h2>{lang === 'ja' ? '再生' : 'Playback'}</h2>
      <div className="controls-grid">
        <button type="button" onClick={onPlay} disabled={isPlaying}>
          {lang === 'ja' ? '再生' : 'Play'}
        </button>
        <button type="button" onClick={onPause} disabled={!isPlaying}>
          {lang === 'ja' ? '一時停止' : 'Pause'}
        </button>
        <button type="button" onClick={onReset}>
          {lang === 'ja' ? 'リセット' : 'Reset'}
        </button>
        <button type="button" onClick={onStep}>
          {lang === 'ja' ? 'ステップ' : 'Step'}
        </button>
      </div>
      <label className="speed-control">
        {lang === 'ja' ? '速度' : 'Speed'}: {speed.toFixed(2)}x
        <input
          type="range"
          min={0.25}
          max={2}
          step={0.25}
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
        />
      </label>
    </section>
  );
}
