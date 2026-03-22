CREATE TABLE IF NOT EXISTS layout_zones (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS seats (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_id        INTEGER REFERENCES layout_zones(id) ON DELETE SET NULL,
  label          TEXT    NOT NULL,
  capacity       INTEGER NOT NULL DEFAULT 1,
  status         TEXT    NOT NULL DEFAULT 'available'
                   CHECK(status IN ('available','occupied','reserved','cleaning')),
  notes          TEXT,
  occupied_since TEXT,
  position_x     REAL,
  position_y     REAL,
  is_active      INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_by     TEXT
);
