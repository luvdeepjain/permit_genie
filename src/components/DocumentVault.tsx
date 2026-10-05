import React, { useState } from 'react';
import { 
  FolderArchive, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Plus, 
  Download, 
  ShieldCheck,
  Calendar,
  Layers,
  X
} from 'lucide-react';
import { DocumentVaultItem } from '../types/permit';

interface DocumentVaultProps {
  documents: DocumentVaultItem[];
  onAddDocument: (doc: DocumentVaultItem) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  onAddDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Doc Form
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<DocumentVaultItem['category']>('Corporate');
  const [newDocFileName, setNewDocFileName] = useState('');
  const [newDocExpiry, setNewDocExpiry] = useState('');

  const categories = ['ALL', 'Corporate', 'Architectural', 'Safety', 'Financial', 'Environmental'];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory === 'ALL') return true;
    return doc.category === selectedCategory;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    const newDoc: DocumentVaultItem = {
      id: `vault-${Date.now()}`,
      name: newDocName,
      category: newDocCategory,
      fileName: newDocFileName || `${newDocName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      fileSize: `${(Math.random() * 4 + 1.5).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      expiryDate: newDocExpiry || undefined,
      verified: true,
      linkedApplicationsCount: 1,
    };

    onAddDocument(newDoc);
    setIsAddModalOpen(false);
    setNewDocName('');
    setNewDocFileName('');
    setNewDocExpiry('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <FolderArchive className="w-4 h-4" />
            <span>Centralized Municipal Records Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Enterprise Document Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Store, version, and verify recurring compliance exhibits. Once verified, vault documents can be mapped instantly to any new permit application.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Record</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified records by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {doc.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {doc.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                    {doc.fileName} · {doc.fileSize}
                  </div>
                </div>
              </div>

              {doc.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span>Uploaded: {doc.uploadedAt}</span>
                {doc.expiryDate && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-700 font-medium">Expires {doc.expiryDate}</span>
                  </>
                )}
              </div>

              <span className="font-mono text-[11px] text-slate-400">
                Mapped to {doc.linkedApplicationsCount} filing{doc.linkedApplicationsCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Upload Compliance Document to Vault
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Food Facility Grease Trap Schematic"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Compliance Category *
                  </label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Corporate">Corporate & Legal</option>
                    <option value="Architectural">Architectural & Blueprints</option>
                    <option value="Safety">Fire & Life Safety</option>
                    <option value="Financial">Financial & Tax</option>
                    <option value="Environmental">Environmental & Biohazard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expiration Date (if applicable)
                  </label>
                  <input
                    type="date"
                    value={newDocExpiry}
                    onChange={(e) => setNewDocExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  File Attachment (Simulated)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-slate-600 font-medium block">
                    {newDocFileName ? newDocFileName : 'Click to select signed PDF / CAD file'}
                  </span>
                  <span className="text-[11px] text-slate-400">PDF, DWG, DXF up to 50MB</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Verify & Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
