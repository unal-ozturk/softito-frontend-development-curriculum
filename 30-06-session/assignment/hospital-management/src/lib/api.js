import axios from 'axios';
import defaultDb from '../../db.json';

const API_URL = 'http://localhost:3000';
let isBackendDead = false;

// İlk açılışta LocalStorage boşsa db.json'dan yükle
const initStorage = () => {
  if (!localStorage.getItem('hbys_data')) {
    localStorage.setItem('hbys_data', JSON.stringify(defaultDb));
  }
};
initStorage();

const getStorage = () => JSON.parse(localStorage.getItem('hbys_data')) || {};
const setStorage = (data) => localStorage.setItem('hbys_data', JSON.stringify(data));

// Yardımcı Fonksiyon: endpoint'ten koleksiyon adını bulur (örn: /users?role=admin -> users)
const getCollectionName = (endpoint) => {
  const base = endpoint.split('?')[0]; 
  const parts = base.split('/').filter(Boolean); 
  return parts[0];
};

export const api = {
  get: async (endpoint) => {
    const collection = getCollectionName(endpoint);
    
    if (!isBackendDead) {
      try {
        const res = await axios.get(`${API_URL}${endpoint}`, { timeout: 2000 });
        
        // Sunucu sağlıklıysa, saf koleksiyon çağrılarında (örn: /appointments) LocalStorage'ı da tazele
        if (!endpoint.includes('?') && endpoint.split('/').filter(Boolean).length === 1) {
          const storageData = getStorage();
          storageData[collection] = res.data;
          setStorage(storageData);
        }
        return res;
      } catch (error) {
        console.warn('Backend ulaşılamaz, LocalStorage devreye giriyor (GET):', endpoint);
        isBackendDead = true; // Bir kere çöktüyse bir daha zorlama
      }
    }

    // LOCAL STORAGE (FALLBACK)
    const data = getStorage();
    let records = data[collection] || [];
    
    // Basit sorgu (query) filtrelemesi (örn: /users?role=secretary)
    if (endpoint.includes('?')) {
      const query = endpoint.split('?')[1];
      const params = new URLSearchParams(query);
      for (const [key, value] of params.entries()) {
        records = records.filter(r => String(r[key]) === String(value));
      }
    }
    
    return { data: records };
  },
  
  post: async (endpoint, payload) => {
    let storageData = getStorage();
    const collection = getCollectionName(endpoint);
    
    // 1. Önce LocalStorage'a ekle (Kalıcılık)
    const newItem = { ...payload, id: payload.id || Date.now().toString() };
    if (!storageData[collection]) storageData[collection] = [];
    storageData[collection].push(newItem);
    setStorage(storageData);

    // 2. Varsa Sunucuya yolla
    if (!isBackendDead) {
      try {
        const res = await axios.post(`${API_URL}${endpoint}`, newItem, { timeout: 2000 });
        return res;
      } catch (error) {
        console.warn('Backend ulaşılamaz, sadece LocalStorage kullanıldı (POST):', endpoint);
        isBackendDead = true;
      }
    }
    return { data: newItem };
  },
  
  patch: async (endpoint, payload) => {
    let storageData = getStorage();
    const parts = endpoint.split('?')[0].split('/').filter(Boolean);
    const collection = parts[0];
    const id = parts[1];
    
    let updatedItem = null;
    
    // 1. Önce LocalStorage'da bul ve güncelle
    if (storageData[collection] && id) {
      const index = storageData[collection].findIndex(item => String(item.id) === String(id));
      if (index !== -1) {
        updatedItem = { ...storageData[collection][index], ...payload };
        storageData[collection][index] = updatedItem;
        setStorage(storageData);
      }
    }

    // 2. Varsa Sunucuya yolla
    if (!isBackendDead) {
      try {
        const res = await axios.patch(`${API_URL}${endpoint}`, payload, { timeout: 2000 });
        return res;
      } catch (error) {
        console.warn('Backend ulaşılamaz, sadece LocalStorage kullanıldı (PATCH):', endpoint);
        isBackendDead = true;
      }
    }
    return { data: updatedItem };
  }
};
