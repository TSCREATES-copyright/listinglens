import { ValuationRecord } from '../types/valuation';

const DB_NAME = 'ListingLensDB';
const DB_VERSION = 1;
const STORE_NAME = 'valuations';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const StorageManager = {
  async saveValuation(record: ValuationRecord): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(record);
      request.onsuccess = () => {
        window.dispatchEvent(new Event('valuations-updated'));
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  },

  async getAllValuations(): Promise<ValuationRecord[]> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async deleteValuation(id: string): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => {
        window.dispatchEvent(new Event('valuations-updated'));
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  async clearAll(): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => {
        window.dispatchEvent(new Event('valuations-updated'));
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }
};
