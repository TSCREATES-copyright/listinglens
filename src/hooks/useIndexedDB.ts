import { useState, useEffect } from 'react';
import { ValuationRecord } from '../types/valuation';
import { StorageManager } from '../systems/StorageManager';

export const useIndexedDB = () => {
  const [records, setRecords] = useState<ValuationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await StorageManager.getAllValuations();
      setRecords(data.sort((a, b) => b.updatedAt - a.updatedAt));
    } catch (e) {
      console.error("Failed to load records", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
    window.addEventListener('valuations-updated', loadRecords);
    return () => {
      window.removeEventListener('valuations-updated', loadRecords);
    };
  }, []);

  const saveRecord = async (record: ValuationRecord) => {
    await StorageManager.saveValuation(record);
    await loadRecords();
  };

  const deleteRecord = async (id: string) => {
    await StorageManager.deleteValuation(id);
    await loadRecords();
  };

  const clearRecords = async () => {
    await StorageManager.clearAll();
    await loadRecords();
  };

  return { records, loading, saveRecord, deleteRecord, clearRecords, reload: loadRecords };
};
