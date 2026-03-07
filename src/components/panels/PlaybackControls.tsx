interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
}

export function PlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStep,
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
    </section>
  );
}
