  // src/localDb.js
  export function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MedReachDB', 2); // 🔄 bump version to 2

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('patients')) {
          db.createObjectStore('patients', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('visits')) {
          db.createObjectStore('visits', { keyPath: 'localId', autoIncrement: true }); // new store
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  export const savePatientLocally = async (patient) => {
    const db = await initDB();
    const tx = db.transaction("patients", "readwrite");
    const store = tx.objectStore("patients");
    store.put(patient);
    return tx.complete;
  };

  export async function saveVisitLocally(visit) {
    const dbInstance = await initDB();
    const tx = dbInstance.transaction('visits', 'readwrite');
    const store = tx.objectStore('visits');
    await store.put(visit);
    await tx.done;
  }
  export async function getLocalVisits(patientId) {
    const db = await initDB();
    const tx = db.transaction('visits', 'readonly');
    const store = tx.objectStore('visits');
    

    return new Promise((resolve, reject) => {
      const request = store.openCursor();
      const results = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.patientId === patientId) {
            results.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
