import { getSyncQueue, clearSynced } from './idb';

// Simulated API call
async function pushToServer(patient) {
  console.log("🔁 Syncing to cloud:", patient);
  await new Promise((res) => setTimeout(res, 500)); // Simulate delay
  return true;
}

export async function syncQueueWithServer() {
  if (!navigator.onLine) return;
  const queue = await getSyncQueue();
  for (let record of queue) {
    const success = await pushToServer(record);
    if (success) await clearSynced(record.id);
  }
}