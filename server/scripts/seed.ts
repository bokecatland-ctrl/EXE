import db from '../src/db';

// Clear existing data
db.exec('DELETE FROM seat_history');
db.exec('DELETE FROM seats');
db.exec('DELETE FROM layout_zones');
db.exec("DELETE FROM sqlite_sequence WHERE name IN ('seats','layout_zones','seat_history')");

const zones = [
  { name: 'Window', sort_order: 1 },
  { name: 'Bar Counter', sort_order: 2 },
  { name: 'Sofa', sort_order: 3 },
  { name: 'Center Table', sort_order: 4 },
];

const insertZone = db.prepare('INSERT INTO layout_zones (name, sort_order) VALUES (?, ?)');
const zoneIds: Record<string, number> = {};

for (const zone of zones) {
  const result = insertZone.run(zone.name, zone.sort_order);
  zoneIds[zone.name] = result.lastInsertRowid as number;
}

const seats = [
  // Window seats
  ...['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((label) => ({
    zone: 'Window', label, capacity: 2,
  })),
  // Bar counter
  ...['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'].map((label) => ({
    zone: 'Bar Counter', label, capacity: 1,
  })),
  // Sofa
  ...['S1', 'S2', 'S3', 'S4'].map((label) => ({
    zone: 'Sofa', label, capacity: 3,
  })),
  // Center tables
  ...['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((label) => ({
    zone: 'Center Table', label, capacity: 4,
  })),
];

const insertSeat = db.prepare(
  'INSERT INTO seats (zone_id, label, capacity, status) VALUES (?, ?, ?, ?)'
);

for (const seat of seats) {
  insertSeat.run(zoneIds[seat.zone], seat.label, seat.capacity, 'available');
}

console.log(`Seeded ${zones.length} zones and ${seats.length} seats.`);
db.close();
