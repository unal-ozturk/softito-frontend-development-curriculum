import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../lib/api';

// API_URL is now handled inside api.js

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async () => {
    const response = await api.get(`/appointments`);
    return response.data;
  }
);

export const addAppointment = createAsyncThunk(
  'appointments/addAppointment',
  async (appointment) => {
    const response = await api.post(`/appointments`, appointment);
    return response.data;
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, durum }) => {
    const response = await api.patch(`/appointments/${id}`, { durum });
    return response.data;
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, data }) => {
    const response = await api.patch(`/appointments/${id}`, data);
    return response.data;
  }
);

export const completeExamination = createAsyncThunk(
  'appointments/complete',
  async ({ appointmentId, notes, doctorId }) => {
    const response = await api.patch(`/appointments/${appointmentId}`, { 
      durum: 'tamamlandi',
      doctorId,
      ...notes
    });
    return response.data;
  }
);

export const referToClinic = createAsyncThunk(
  'appointments/refer',
  async ({ appointmentId, sourceDoctorId, targetClinicId, targetDoctorId, referralNote, patientId, date, time }) => {
    await api.patch(`/appointments/${appointmentId}`, { 
      durum: 'tamamlandi',
      doctorId: sourceDoctorId
    });
    
    const newAppointment = {
      id: `ap-${Date.now()}`,
      patientId,
      doctorId: targetDoctorId || null, 
      clinicId: targetClinicId,
      tarih: date,
      saat: time,
      durum: "bekliyor",
      odemeDurumu: "ödendi", 
      siraNo: 0, // Acil önceliği
      isReferral: true,
      referralNote
    };

    const response = await api.post(`/appointments`, newAppointment);
    return { completedId: appointmentId, newAppt: response.data };
  }
);

const initialState = {
  list: [],
  status: 'idle',
  error: null,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (JSON.stringify(state.list) !== JSON.stringify(action.payload)) {
          state.list = action.payload;
        }
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.list.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(completeExamination.fulfilled, (state, action) => {
        const index = state.list.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(referToClinic.fulfilled, (state, action) => {
        // Mark old as tamamlandi
        const index = state.list.findIndex(a => a.id === action.payload.completedId);
        if (index !== -1) {
          state.list[index].durum = 'tamamlandi';
        }
        // Add new to the list
        state.list.push(action.payload.newAppt);
      });
  },
});

export default appointmentsSlice.reducer;
