interface EventLogPanelProps {
  entries: string[];
}

export function EventLogPanel({ entries }: EventLogPanelProps) {
  return (
    <section className="panel event-log" aria-label="Event log panel">
      <h2>Event Log</h2>
      {entries.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul>
          {entries.map((entry, index) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
