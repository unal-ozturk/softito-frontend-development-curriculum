import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../lib/api';

// API_URL is now handled inside api.js

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async () => {
    const response = await api.get(`/patients`);
    return response.data;
  }
);

export const addPatient = createAsyncThunk(
  'patients/addPatient',
  async (newPatient) => {
    const response = await api.post(`/patients`, newPatient);
    return response.data;
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'patients/updatePayment',
  async ({ id, odemeDurumu }) => {
    const response = await api.patch(`/appointments/${id}`, { odemeDurumu });
    return response.data;
  }
);

export const fetchPatientHistory = createAsyncThunk(
  'patients/fetchHistory',
  async (patientId) => {
    // Client-side filter to bypass any json-server beta filtering issues
    const records = await api.get(`/appointments`);
    return records.data
      .filter(a => String(a.patientId) === String(patientId))
      .sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
  }
);

const initialState = {
  list: [],
  history: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (JSON.stringify(state.list) !== JSON.stringify(action.payload)) {
          state.list = action.payload;
        }
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(fetchPatientHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const index = state.history.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.history[index] = action.payload;
        }
      });
  },
});

export default patientsSlice.reducer;
