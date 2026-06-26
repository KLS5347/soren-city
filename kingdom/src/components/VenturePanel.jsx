function Badge({ status }) {
  const label = {
    'empty-lot': 'Empty Lot',
    idea: 'Idea',
    building: 'Building',
    earning: 'Earning',
  }[status] || status

  return <span className={`badge badge--${status}`}>{label}</span>
}

function Tasks({ tasks }) {
  if (!tasks?.length) return <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No tasks yet.</p>
  return (
    <ul className="task-list" style={{ listStyle: 'none' }}>
      {tasks.map((t, i) => (
        <li key={i} className={`task-item${t.done ? ' task-item--done' : ''}`}>
          <input
            type="checkbox"
            className="task-check"
            checked={t.done}
            readOnly
            tabIndex={-1}
          />
          <span>{t.text}</span>
        </li>
      ))}
    </ul>
  )
}

function VaultItems({ items }) {
  if (!items?.length) return null
  return (
    <div className="vault-list">
      {items.map((item, i) => (
        <div key={i} className="vault-item">
          <div className="vault-item__name">{item.name}</div>
          {item.note && <div className="vault-item__note">{item.note}</div>}
          {item.content && <pre className="vault-item__content">{item.content}</pre>}
        </div>
      ))}
    </div>
  )
}

function Connections({ connections }) {
  if (!connections?.length) return <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No connections yet.</p>
  return (
    <div className="conn-list">
      {connections.map((c, i) => (
        <div key={i} className="conn-item">
          <span className="conn-item__name">↗ {c.name}</span>
          {c.note && <span className="conn-item__note">{c.note}</span>}
        </div>
      ))}
    </div>
  )
}

export default function VenturePanel({ venture, onClose }) {
  if (!venture) return null

  const doneTasks = venture.tasks?.filter(t => t.done).length || 0
  const totalTasks = venture.tasks?.length || 0

  return (
    <div className="venture-panel-overlay" role="dialog" aria-label={venture.name}>
      <div className="venture-panel-backdrop" onClick={onClose} />
      <aside className="venture-panel">
        <div className="venture-panel__header">
          <div className="venture-panel__titles">
            <div className="venture-panel__name">{venture.name}</div>
            <div className="venture-panel__real">{venture.realName}</div>
            <div className="venture-panel__badges">
              <Badge status={venture.status} />
              {venture.revenue > 0 && (
                <span className="badge badge--revenue">${venture.revenue.toLocaleString()}</span>
              )}
              {totalTasks > 0 && (
                <span className="badge" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                  {doneTasks}/{totalTasks} tasks
                </span>
              )}
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="venture-panel__body">
          {venture.notes && (
            <section>
              <div className="panel-section__label">Notes</div>
              <p className="notes-text">{venture.notes}</p>
            </section>
          )}

          <section>
            <div className="panel-section__label">Tasks</div>
            <Tasks tasks={venture.tasks} />
          </section>

          {venture.connections?.length > 0 && (
            <section>
              <div className="panel-section__label">Connections</div>
              <Connections connections={venture.connections} />
            </section>
          )}

          {venture.vault?.length > 0 && (
            <section>
              <div className="panel-section__label">Vault</div>
              <VaultItems items={venture.vault} />
            </section>
          )}
        </div>
      </aside>
    </div>
  )
}
