// src/localDb.js
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MedReachDB", 1);

    request.onerror = () => reject("Database failed to open");
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("patients")) {
        db.createObjectStore("patients", { keyPath: "id" });
      }
    };
  });
};

export const savePatientLocally = async (patient) => {
  const db = await initDB();
  const tx = db.transaction("patients", "readwrite");
  const store = tx.objectStore("patients");
  store.put(patient);
  return tx.complete;
};