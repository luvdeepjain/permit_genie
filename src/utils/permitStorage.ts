import { DocumentVaultItem, PermitApplication, AgencyClearance, OfficerQuery } from '../types/permit';
import { INITIAL_APPLICATIONS, INITIAL_VAULT_DOCUMENTS } from '../data/mockData';

const APPS_STORAGE_KEY = 'permit_genie_applications_v1';
const VAULT_STORAGE_KEY = 'permit_genie_vault_v1';

export function getStoredApplications(): PermitApplication[] {
  try {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading stored applications', err);
    return INITIAL_APPLICATIONS;
  }
}

export function saveStoredApplications(apps: PermitApplication[]): void {
  try {
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Error saving applications', err);
  }
}

export function getStoredVault(): DocumentVaultItem[] {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(INITIAL_VAULT_DOCUMENTS));
      return INITIAL_VAULT_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading stored vault', err);
    return INITIAL_VAULT_DOCUMENTS;
  }
}

export function saveStoredVault(vault: DocumentVaultItem[]): void {
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
  } catch (err) {
    console.error('Error saving vault', err);
  }
}

export function resetToDemoData(): void {
  localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(INITIAL_VAULT_DOCUMENTS));
}
