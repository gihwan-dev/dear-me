'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash2, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import Sparkles from '@/components/ui/Sparkles';
import { exportAllData, importAllData, clearAllData } from '@/lib/storage';

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState('');

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dear-me-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const success = importAllData(reader.result as string);
      if (success) {
        showToast('Data imported successfully!');
        window.location.reload();
      } else {
        showToast('Import failed. Invalid file format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all letters? This cannot be undone.')) {
      clearAllData();
      showToast('All data cleared.');
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8 py-2"
    >
      {/* About */}
      <div className="relative text-center py-10 bg-white rounded-2xl shadow-card overflow-hidden">
        <Sparkles count={6} />
        <h2 className="font-[family-name:var(--font-script)] text-4xl text-rose-gold mb-2 relative z-10">
          Dear Me
        </h2>
        <p className="text-xs text-warm-gray/50 font-[family-name:var(--font-body)] relative z-10">
          Version 1.0.0
        </p>
        <p className="text-sm text-warm-gray/70 font-[family-name:var(--font-body)] mt-3 max-w-xs mx-auto leading-relaxed relative z-10">
          Letters to your future self.
          Written with love, sealed with hope.
        </p>
        <div className="flex items-center justify-center gap-1 mt-3 text-rose-gold/60 relative z-10">
          <Heart size={12} fill="currentColor" />
          <span className="text-xs font-[family-name:var(--font-body)]">Made with love</span>
          <Heart size={12} fill="currentColor" />
        </div>
      </div>

      {/* Data Management */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-warm-gray tracking-[0.15em] uppercase font-[family-name:var(--font-body)]">
          Data Management
        </h3>

        <div className="bg-white rounded-2xl shadow-card p-5 space-y-3">
          <Button
            variant="secondary"
            fullWidth
            icon={<Download size={16} />}
            onClick={handleExport}
          >
            Export Data
          </Button>

          <Button
            variant="secondary"
            fullWidth
            icon={<Upload size={16} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Import Data
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <div className="pt-2 border-t border-blush/20">
            <Button
              variant="ghost"
              fullWidth
              icon={<Trash2 size={16} />}
              onClick={handleClear}
              className="text-rose-gold/60! hover:text-rose-gold!"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-soft-black/90 text-white px-5 py-2.5 rounded-full text-sm font-[family-name:var(--font-body)] shadow-card z-50"
        >
          {toast}
        </motion.div>
      )}
    </motion.div>
  );
}
