import localforage from 'localforage';
import CryptoJS from 'crypto-js';

// Configure localforage
localforage.config({
  name: 'NafasApp',
  version: 1.0,
  storeName: 'nafas_store',
  description: 'Local storage for Nafas crisis intervention app'
});

// --- ENCRYPTION SETUP ---
// In a fully native Android app, we would use SQLCipher and EncryptedSharedPreferences.
// Since this is a cross-platform PWA/Capacitor app, we implement AES-256 encryption at the application layer.
// The data is encrypted BEFORE being saved to IndexedDB (localforage).

const ENCRYPTION_KEY_STORAGE = 'nafas_device_key';
let encryptionKey = localStorage.getItem(ENCRYPTION_KEY_STORAGE);

// Generate a secure random key on first launch if it doesn't exist.
// Note: For maximum security in a production medical app, this key should ideally be 
// derived from a user's PIN or Biometrics rather than stored in localStorage.
if (!encryptionKey) {
  encryptionKey = CryptoJS.lib.WordArray.random(256 / 8).toString();
  localStorage.setItem(ENCRYPTION_KEY_STORAGE, encryptionKey);
}

function encryptData(data: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey!).toString();
}

function decryptData<T>(ciphertext: string | null): T | null {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey!);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString) as T;
  } catch (e) {
    console.error("Decryption failed. Data might be corrupted or key is invalid.", e);
    return null;
  }
}
// ------------------------

export interface SafetyPlan {
  warningSigns: string[];
  copingStrategies: string[];
  socialDistractions: { name: string; contact: string }[];
  trustedPeople: { name: string; phone: string }[];
  professionals: { name: string; phone: string; role: string }[];
  environmentSafety: string[];
}

export interface DiaryEntry {
  id: string;
  date: string;
  mood: number; // 1-10
  ideationFrequency: number; // 1-5
  copingStrategiesUsed: string[];
  notes: string;
}

export interface VaultItem {
  id: string;
  type: 'image' | 'text' | 'audio';
  content: string; // URL or text
  title?: string;
}

const DEFAULT_SAFETY_PLAN: SafetyPlan = {
  warningSigns: [],
  copingStrategies: [],
  socialDistractions: [],
  trustedPeople: [],
  professionals: [],
  environmentSafety: []
};

export const db = {
  async getSafetyPlan(): Promise<SafetyPlan> {
    const encryptedPlan = await localforage.getItem<string>('safety_plan_enc');
    if (encryptedPlan) {
      return decryptData<SafetyPlan>(encryptedPlan) || DEFAULT_SAFETY_PLAN;
    }
    return DEFAULT_SAFETY_PLAN;
  },
  async saveSafetyPlan(plan: SafetyPlan): Promise<void> {
    const encrypted = encryptData(plan);
    await localforage.setItem('safety_plan_enc', encrypted);
  },
  
  async getDiaryEntries(): Promise<DiaryEntry[]> {
    const encryptedEntries = await localforage.getItem<string>('diary_entries_enc');
    if (encryptedEntries) {
      return decryptData<DiaryEntry[]>(encryptedEntries) || [];
    }
    return [];
  },
  async saveDiaryEntry(entry: DiaryEntry): Promise<void> {
    const entries = await this.getDiaryEntries();
    entries.push(entry);
    const encrypted = encryptData(entries);
    await localforage.setItem('diary_entries_enc', encrypted);
  },

  async getVaultItems(): Promise<VaultItem[]> {
    const encryptedItems = await localforage.getItem<string>('vault_items_enc');
    if (encryptedItems) {
      return decryptData<VaultItem[]>(encryptedItems) || [];
    }
    return [];
  },
  async saveVaultItem(item: VaultItem): Promise<void> {
    const items = await this.getVaultItems();
    items.push(item);
    const encrypted = encryptData(items);
    await localforage.setItem('vault_items_enc', encrypted);
  },
  async deleteVaultItem(id: string): Promise<void> {
    const items = await this.getVaultItems();
    const filtered = items.filter(i => i.id !== id);
    await localforage.setItem('vault_items_enc', encryptData(filtered));
  },

  async clearAllData(): Promise<void> {
    await localforage.clear();
    // We do not clear the encryption key so that if backups are restored, they can be decrypted.
  },

  async getUserName(): Promise<string | null> {
    const encryptedName = await localforage.getItem<string>('user_name_enc');
    if (encryptedName) {
      return decryptData<string>(encryptedName);
    }
    return null;
  },

  async setUserName(name: string): Promise<void> {
    const encrypted = encryptData(name);
    await localforage.setItem('user_name_enc', encrypted);
  },

  // --- BACKUP MECHANISM ---
  // Generates an encrypted JSON string containing all user data that can be safely 
  // synced to a cloud provider or saved locally as a file.
  async generateEncryptedBackup(): Promise<string> {
    const backupData = {
      safetyPlan: await this.getSafetyPlan(),
      diaryEntries: await this.getDiaryEntries(),
      vaultItems: await this.getVaultItems(),
      timestamp: new Date().toISOString()
    };
    // Encrypt the entire backup payload
    return encryptData(backupData);
  },

  async restoreFromBackup(encryptedBackupString: string): Promise<boolean> {
    const decrypted = decryptData<any>(encryptedBackupString);
    if (decrypted && decrypted.safetyPlan && decrypted.diaryEntries) {
      await this.saveSafetyPlan(decrypted.safetyPlan);
      await localforage.setItem('diary_entries_enc', encryptData(decrypted.diaryEntries));
      if (decrypted.vaultItems) {
         await localforage.setItem('vault_items_enc', encryptData(decrypted.vaultItems));
      }
      return true;
    }
    return false;
  }
};
