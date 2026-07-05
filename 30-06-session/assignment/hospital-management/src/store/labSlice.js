import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

// Realistic Mock Data Generators
const generateBloodTest1 = () => [
  { name: "WBC", value: (Math.random() * 8 + 3).toFixed(1), unit: "10^3/µL", reference: "4.5 - 11.0" },
  { name: "RBC", value: (Math.random() * 2 + 3.5).toFixed(2), unit: "10^6/µL", reference: "4.5 - 5.5" },
  { name: "HGB", value: (Math.random() * 6 + 10).toFixed(1), unit: "g/dL", reference: "13.0 - 17.0" },
  { name: "PLT", value: Math.floor(Math.random() * 300 + 100), unit: "10^3/µL", reference: "150 - 400" }
];

const generateBloodTest2 = () => [
  { name: "Glikoz (Açlık)", value: Math.floor(Math.random() * 80 + 70), unit: "mg/dL", reference: "74 - 106" },
  { name: "Üre", value: Math.floor(Math.random() * 40 + 15), unit: "mg/dL", reference: "17 - 43" },
  { name: "Kreatinin", value: (Math.random() * 1.0 + 0.5).toFixed(2), unit: "mg/dL", reference: "0.66 - 1.25" },
  { name: "AST", value: Math.floor(Math.random() * 50 + 10), unit: "U/L", reference: "0 - 40" }
];

const generateBloodTest3 = () => [
  { name: "TSH", value: (Math.random() * 4 + 0.5).toFixed(2), unit: "uIU/mL", reference: "0.27 - 4.2" },
  { name: "Serbest T4", value: (Math.random() * 1.5 + 0.5).toFixed(2), unit: "ng/dL", reference: "0.93 - 1.7" },
  { name: "Vitamin B12", value: Math.floor(Math.random() * 600 + 150), unit: "pg/mL", reference: "197 - 771" }
];

const generateImaging = (type) => [
  { name: "Rapor", value: Math.random() > 0.7 ? "Şüpheli lezyon/bulgu saptandı. İleri tetkik önerilir." : "Normal sınırlarda. Patolojik bulguya rastlanmadı.", unit: "-", reference: "Normal" }
];

const evaluateResults = (results) => {
  return results.map(r => {
    if (r.reference === "Normal") {
      return { ...r, flag: r.value.includes("Şüpheli") ? "ANORMAL" : "NORMAL" };
    }
    const [min, max] = r.reference.split(' - ').map(Number);
    const val = Number(r.value);
    let flag = "NORMAL";
    if (val < min) flag = "DÜŞÜK";
    if (val > max) flag = "YÜKSEK";
    return { ...r, flag };
  });
};

// Async Thunk simulating a 5-second process
export const requestLabTest = createAsyncThunk(
  'lab/requestLabTest',
  async ({ patientId, doctorId, testType }, { dispatch }) => {
    // 1. Create a "Pending" record immediately
    const recordId = nanoid();
    const pendingRecord = {
      id: recordId,
      patientId,
      doctorId,
      type: testType,
      status: "Bekleniyor...",
      date: new Date().toISOString(),
      results: []
    };
    
    // Dispatch an action to add it as pending
    dispatch(labSlice.actions.addPendingResult(pendingRecord));

    // 2. Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 3. Generate data
    let rawResults = [];
    if (testType === 'Kan Testi 1 (Hemogram)') rawResults = generateBloodTest1();
    else if (testType === 'Kan Testi 2 (Biyokimya)') rawResults = generateBloodTest2();
    else if (testType === 'Kan Testi 3 (Hormon)') rawResults = generateBloodTest3();
    else if (testType === 'MR' || testType === 'Röntgen') rawResults = generateImaging(testType);

    const evaluatedResults = evaluateResults(rawResults);

    // 4. Return final data to replace pending
    return {
      id: recordId,
      status: "Çıktı",
      results: evaluatedResults
    };
  }
);

const initialState = {
  list: [], // Array of lab records
};

export const labSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {
    addPendingResult: (state, action) => {
      state.list.unshift(action.payload); // Add to top
    }
  },
  extraReducers: (builder) => {
    builder.addCase(requestLabTest.fulfilled, (state, action) => {
      const { id, status, results } = action.payload;
      const record = state.list.find(r => r.id === id);
      if (record) {
        record.status = status;
        record.results = results;
      }
    });
  }
});

export default labSlice.reducer;
