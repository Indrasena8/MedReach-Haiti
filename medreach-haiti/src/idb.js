import { openDB } from 'idb';

const DB_NAME = 'medreach-db';
const STORE_NAME = 'patients';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
  },
});

export async function savePatient(data) {
  const db = await dbPromise;
  const entry = {
    ...data,
    date: new Date().toISOString(),
    synced: false
  };
  await db.add(STORE_NAME, entry);
  await db.add('syncQueue', entry);
}

export async function getAllPatients() {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
}

export async function getSyncQueue() {
  const db = await dbPromise;
  return db.getAll('syncQueue');
}

export async function clearSynced(id) {
  const db = await dbPromise;
  await db.delete('syncQueue', id);
}