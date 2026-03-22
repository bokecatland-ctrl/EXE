CREATE TABLE IF NOT EXISTS seat_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  seat_id     INTEGER NOT NULL REFERENCES seats(id),
  from_status TEXT,
  to_status   TEXT    NOT NULL,
  notes       TEXT,
  changed_by  TEXT,
  changed_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_seat_history_seat_id
  ON seat_history(seat_id, changed_at DESC);
