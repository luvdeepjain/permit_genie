import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { NewApplicationWizard } from './components/NewApplicationWizard';
import { PermitFinder } from './components/PermitFinder';
import { DocumentVault } from './components/DocumentVault';
import { AgencyOfficerPortal } from './components/AgencyOfficerPortal';
import { DigitalCertificateModal } from './components/DigitalCertificateModal';
import { QueryResolutionModal } from './components/QueryResolutionModal';
import { 
  PermitApplication, 
  DocumentVaultItem, 
  BusinessCategory 
} from './types/permit';
import { 
  getStoredApplications, 
  saveStoredApplications, 
  getStoredVault, 
  saveStoredVault, 
  resetToDemoData 
} from './utils/permitStorage';
import { CheckCircle2, Info, Sparkles } from 'lucide-react';

export default function App() {
  const [applications, setApplications] = useState<PermitApplication[]>([]);
  const [vaultDocuments, setVaultDocuments] = useState<DocumentVaultItem[]>([]);
  const [currentTab, setCurrentTab] = useState<'applications' | 'apply' | 'finder' | 'vault' | 'officer'>('applications');
  const [userRole, setUserRole] = useState<'entrepreneur' | 'officer'>('entrepreneur');

  // Modals
  const [selectedAppDetail, setSelectedAppDetail] = useState<PermitApplication | null>(null);
  const [selectedAppCertificate, setSelectedAppCertificate] = useState<PermitApplication | null>(null);
  const [selectedAppQueryResolve, setSelectedAppQueryResolve] = useState<PermitApplication | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const loadedApps = getStoredApplications();
    const loadedVault = getStoredVault();
    setApplications(loadedApps);
    setVaultDocuments(loadedVault);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleUpdateApplication = (updatedApp: PermitApplication) => {
    const updated = applications.map(a => a.id === updatedApp.id ? updatedApp : a);
    setApplications(updated);
    saveStoredApplications(updated);

    if (selectedAppDetail?.id === updatedApp.id) {
      setSelectedAppDetail(updatedApp);
    }

    if (updatedApp.status === 'APPROVED') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    showToast(`Application ${updatedApp.id} updated successfully.`);
  };

  const handleCreateNewApplication = (newApp: PermitApplication) => {
    const updated = [newApp, ...applications];
    setApplications(updated);
    saveStoredApplications(updated);
    setCurrentTab('applications');

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    showToast(`Filing ${newApp.id} concurrently dispatched to ${newApp.agencyClearances.length} municipal agencies!`);
  };

  const handleAddVaultDocument = (newDoc: DocumentVaultItem) => {
    const updated = [newDoc, ...vaultDocuments];
    setVaultDocuments(updated);
    saveStoredVault(updated);
    showToast(`Document "${newDoc.name}" added to enterprise vault.`);
  };

  const handleResetData = () => {
    if (confirm('Reset application data back to initial demo state?')) {
      resetToDemoData();
      setApplications(getStoredApplications());
      setVaultDocuments(getStoredVault());
      setSelectedAppDetail(null);
      setSelectedAppCertificate(null);
      setSelectedAppQueryResolve(null);
      showToast('Permit Genie demo dataset restored.');
    }
  };

  const handleToggleRole = () => {
    if (userRole === 'entrepreneur') {
      setUserRole('officer');
      setCurrentTab('officer');
      showToast('Switched to City Regulatory Case Officer Desk.');
    } else {
      setUserRole('entrepreneur');
      setCurrentTab('applications');
      showToast('Switched to Entrepreneur / Business Owner Portal.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'applications' && (
          <ApplicationTracker
            applications={applications}
            onSelectApplication={(app) => setSelectedAppDetail(app)}
            onOpenApply={() => setCurrentTab('apply')}
            onOpenCertificate={(app) => setSelectedAppCertificate(app)}
            onOpenQueryResolve={(app) => setSelectedAppQueryResolve(app)}
          />
        )}

        {currentTab === 'apply' && (
          <NewApplicationWizard
            vaultDocuments={vaultDocuments}
            onSubmitSuccess={handleCreateNewApplication}
            onCancel={() => setCurrentTab('applications')}
          />
        )}

        {currentTab === 'finder' && (
          <PermitFinder
            onStartApplicationWithPreset={(industry: BusinessCategory) => {
              setCurrentTab('apply');
            }}
          />
        )}

        {currentTab === 'vault' && (
          <DocumentVault
            documents={vaultDocuments}
            onAddDocument={handleAddVaultDocument}
          />
        )}

        {currentTab === 'officer' && (
          <AgencyOfficerPortal
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
          />
        )}
      </main>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAppDetail && (
        <ApplicationDetailModal
          application={selectedAppDetail}
          onClose={() => setSelectedAppDetail(null)}
          onOpenCertificate={(app) => {
            setSelectedAppDetail(null);
            setSelectedAppCertificate(app);
          }}
          onOpenQueryResolve={(app) => {
            setSelectedAppDetail(null);
            setSelectedAppQueryResolve(app);
          }}
        />
      )}

      {/* Digital Certificate Modal */}
      {selectedAppCertificate && (
        <DigitalCertificateModal
          application={selectedAppCertificate}
          onClose={() => setSelectedAppCertificate(null)}
        />
      )}

      {/* Query Resolution Modal */}
      {selectedAppQueryResolve && (
        <QueryResolutionModal
          application={selectedAppQueryResolve}
          onClose={() => setSelectedAppQueryResolve(null)}
          onResolveSuccess={(updatedApp) => {
            handleUpdateApplication(updatedApp);
          }}
        />
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Permit Genie</span>
            <span>·</span>
            <span>Single-Window Municipal Approvals Clearinghouse</span>
          </div>
          <div>
            Adheres to Municipal Digital Fast-Track & Inter-Agency Concurrent Clearance Standards.
          </div>
        </div>
      </footer>
    </div>
  );
}
