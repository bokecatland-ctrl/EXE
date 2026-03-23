-- Seed initial zones and seats only if both tables are empty
INSERT INTO layout_zones (name, sort_order)
SELECT vals.name, vals.sort_order
FROM (
  SELECT 'Window'       AS name, 1 AS sort_order UNION ALL
  SELECT 'Bar Counter',          2               UNION ALL
  SELECT 'Sofa',                 3               UNION ALL
  SELECT 'Center Table',         4
) AS vals
WHERE NOT EXISTS (SELECT 1 FROM layout_zones LIMIT 1);

INSERT INTO seats (zone_id, label, capacity)
SELECT z.id, vals.label, vals.capacity
FROM (
  SELECT 'Window'       AS zone, 'W1' AS label, 2 AS capacity UNION ALL
  SELECT 'Window',               'W2',           2             UNION ALL
  SELECT 'Window',               'W3',           2             UNION ALL
  SELECT 'Window',               'W4',           2             UNION ALL
  SELECT 'Window',               'W5',           2             UNION ALL
  SELECT 'Window',               'W6',           2             UNION ALL
  SELECT 'Bar Counter',          'B1',           1             UNION ALL
  SELECT 'Bar Counter',          'B2',           1             UNION ALL
  SELECT 'Bar Counter',          'B3',           1             UNION ALL
  SELECT 'Bar Counter',          'B4',           1             UNION ALL
  SELECT 'Bar Counter',          'B5',           1             UNION ALL
  SELECT 'Bar Counter',          'B6',           1             UNION ALL
  SELECT 'Sofa',                 'S1',           3             UNION ALL
  SELECT 'Sofa',                 'S2',           3             UNION ALL
  SELECT 'Sofa',                 'S3',           3             UNION ALL
  SELECT 'Sofa',                 'S4',           3             UNION ALL
  SELECT 'Sofa',                 'S5',           3             UNION ALL
  SELECT 'Sofa',                 'S6',           3             UNION ALL
  SELECT 'Center Table',         'C1',           4             UNION ALL
  SELECT 'Center Table',         'C2',           4             UNION ALL
  SELECT 'Center Table',         'C3',           4             UNION ALL
  SELECT 'Center Table',         'C4',           4             UNION ALL
  SELECT 'Center Table',         'C5',           4             UNION ALL
  SELECT 'Center Table',         'C6',           4
) AS vals
JOIN layout_zones z ON z.name = vals.zone
WHERE NOT EXISTS (SELECT 1 FROM seats LIMIT 1);
