interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onSpeedChange: (nextSpeed: number) => void;
}

export function PlaybackControls({
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onStep,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <section className="panel" aria-label="Playback controls">
      <h2>Playback</h2>
      <div className="controls-grid">
        <button type="button" onClick={onPlay} disabled={isPlaying}>
          Play
        </button>
        <button type="button" onClick={onPause} disabled={!isPlaying}>
          Pause
        </button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
        <button type="button" onClick={onStep}>
          Step
        </button>
      </div>
      <label className="speed-control">
        Speed: {speed.toFixed(2)}x
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
