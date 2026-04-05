import localforage from 'localforage';

// Configure localforage
localforage.config({
  name: 'NafasApp',
  version: 1.0,
  storeName: 'nafas_store',
  description: 'Local storage for Nafas crisis intervention app'
});

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
    const plan = await localforage.getItem<SafetyPlan>('safety_plan');
    return plan || DEFAULT_SAFETY_PLAN;
  },
  async saveSafetyPlan(plan: SafetyPlan): Promise<void> {
    await localforage.setItem('safety_plan', plan);
  },
  
  async getDiaryEntries(): Promise<DiaryEntry[]> {
    const entries = await localforage.getItem<DiaryEntry[]>('diary_entries');
    return entries || [];
  },
  async saveDiaryEntry(entry: DiaryEntry): Promise<void> {
    const entries = await this.getDiaryEntries();
    entries.push(entry);
    await localforage.setItem('diary_entries', entries);
  },

  async getVaultItems(): Promise<VaultItem[]> {
    const items = await localforage.getItem<VaultItem[]>('vault_items');
    return items || [];
  },
  async saveVaultItem(item: VaultItem): Promise<void> {
    const items = await this.getVaultItems();
    items.push(item);
    await localforage.setItem('vault_items', items);
  },
  async deleteVaultItem(id: string): Promise<void> {
    const items = await this.getVaultItems();
    await localforage.setItem('vault_items', items.filter(i => i.id !== id));
  },

  async clearAllData(): Promise<void> {
    await localforage.clear();
  }
};
