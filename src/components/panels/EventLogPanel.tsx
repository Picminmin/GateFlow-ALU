interface EventLogPanelProps {
  entries: string[];
  lang: 'en' | 'ja';
}

export function EventLogPanel({ entries, lang }: EventLogPanelProps) {
  return (
    <section className="panel event-log" aria-label={lang === 'ja' ? 'イベントログパネル' : 'Event log panel'}>
      <h2>{lang === 'ja' ? 'イベントログ' : 'Event Log'}</h2>
      {entries.length === 0 ? (
        <p>{lang === 'ja' ? 'イベントはまだありません。' : 'No events yet.'}</p>
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
