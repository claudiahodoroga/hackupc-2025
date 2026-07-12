// Demo data replacing the original Postgres database.
// The live demo acts as user "Marco" (id 6), whose friends are listed below —
// mirroring the original seed data in initdb/db/init.sql.
export const DEMO_USER = { id: 6, name: "Marco", phone: "617890123" };

export const DEMO_FRIENDS = [
  { id: 7, name: "Antonia", phone: "618901234" },
  { id: 8, name: "Pepe", phone: "619012345" },
  { id: 9, name: "Jose", phone: "620123456" },
  { id: 11, name: "Pedro", phone: "622345678" },
];
