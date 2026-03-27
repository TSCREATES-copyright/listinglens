import React from 'react';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { useAppStore } from '../../state/appStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { toastManager } from '../../systems/toastManager';
import { Trash2, Copy, Clock, Download, FileDown } from 'lucide-react';
import { ProFeatureGate } from '../ui/ProFeatureGate';
import { PremiumBadge } from '../ui/PremiumBadge';

export const HistoryView: React.FC = () => {
  const { records, deleteRecord, clearRecords } = useIndexedDB();
  const { updateInput, settings } = useAppStore();

  const handleLoad = (record: any) => {
    updateInput(record);
    toastManager.success("Valuation Loaded", "Inputs have been updated.");
  };

  const handleCopy = (record: any) => {
    const text = `${record.title}\nList Price: ${formatCurrency(record.listPrice)}\nLikely Sell Price: ${formatCurrency(record.likelySellPrice)}\nFast Sale: ${formatCurrency(record.fastSalePrice)}`;
    navigator.clipboard.writeText(text);
    toastManager.success("Copied to Clipboard", "Listing details copied.");
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;

    const headers = ['Date', 'Title', 'Category', 'Condition', 'List Price', 'Likely Sell Price', 'Fast Sale Price'];
    const csvContent = [
      headers.join(','),
      ...records.map(r => [
        new Date(r.createdAt).toLocaleDateString(),
        `"${r.title.replace(/"/g, '""')}"`,
        r.category,
        r.condition,
        r.listPrice,
        r.likelySellPrice,
        r.fastSalePrice
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `listinglens_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toastManager.success("Export Successful", "Your history has been downloaded.");
  };

  const handleDelete = (id: string) => {
    toastManager.confirm({
      title: "Delete Valuation?",
      message: "⚠️ This will permanently remove this item from your history.",
      confirmText: "Delete 🧹",
      cancelText: "Cancel",
      isDestructive: true,
      onConfirm: () => {
        deleteRecord(id);
        toastManager.success("Deleted", "Valuation removed from history.");
      }
    });
  };

  const handleClearAll = () => {
    toastManager.confirm({
      title: "Clear All History?",
      message: "⚠️ This will permanently remove all saved valuations. This cannot be undone.",
      confirmText: "Clear All 🧹",
      cancelText: "Cancel",
      isDestructive: true,
      onConfirm: () => {
        clearRecords();
        toastManager.success("History Cleared", "All saved valuations have been removed.");
      }
    });
  };

  if (records.length === 0) {
    return (
      <Card className="bg-gray-50/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="w-10 h-10 text-cool-gray-light mb-3" />
          <h3 className="text-sm font-semibold text-forest-black">No History Yet 📌</h3>
          <p className="text-xs text-cool-gray mt-1 max-w-[200px]">Saved valuations will appear here for easy reference. 📍</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-cool-gray-light/50">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-cool-gray" />
          Saved History
        </CardTitle>
        <div className="flex items-center gap-3">
          <ProFeatureGate featureName="Export to CSV" fallback={
            <button 
              className="text-xs flex items-center gap-1 transition-colors text-gold-dark hover:text-gold"
              title="Export to CSV (Pro Feature)"
            >
              <FileDown className="w-3.5 h-3.5" /> Export <PremiumBadge className="ml-0.5" />
            </button>
          }>
            <button 
              onClick={handleExportCSV}
              className="text-xs flex items-center gap-1 transition-colors text-cool-gray hover:text-forest-black"
              title="Export to CSV"
            >
              <FileDown className="w-3.5 h-3.5" /> Export
            </button>
          </ProFeatureGate>
          <button 
            onClick={handleClearAll}
            className="text-xs text-cool-gray hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-cool-gray-light/50 max-h-[400px] overflow-y-auto">
          {records.map((record) => (
            <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-bold text-forest-black line-clamp-1">{record.title}</h4>
                  <p className="text-xs text-cool-gray capitalize">{record.category} • {record.condition}</p>
                </div>
                <Badge variant="success" className="flex-shrink-0">{formatCurrency(record.listPrice)}</Badge>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-cool-gray uppercase tracking-wider font-semibold">
                  {new Date(record.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleLoad(record)}
                    className="p-1.5 text-cool-gray hover:text-forest-black hover:bg-gray-200 rounded-md transition-colors"
                    title="Load into inputs"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleCopy(record)}
                    className="p-1.5 text-cool-gray hover:text-forest-black hover:bg-gray-200 rounded-md transition-colors"
                    title="Copy details"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="p-1.5 text-cool-gray hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
