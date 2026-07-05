import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SecretaryLayout from './layouts/SecretaryLayout';
import SecretaryDashboard from './pages/SecretaryDashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import DoctorLayout from './layouts/DoctorLayout';
import DoctorQueue from './pages/doctor/DoctorQueue';
import DoctorUpcoming from './pages/doctor/DoctorUpcoming';
import DoctorHistory from './pages/doctor/DoctorHistory';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import { useDataPoller } from './hooks/useDataPoller';

function App() {
  useDataPoller();

  return (
    <>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Adım 2: Secretary Routes (Protected) */}
          <Route element={<ProtectedRoute allowedRoles={['secretary']} />}>
            <Route path="/secretary" element={<SecretaryLayout />}>
              <Route index element={<SecretaryDashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="appointments" element={<Appointments />} />
            </Route>
          </Route>

          {/* Adım 3: Doctor Routes (Protected) */}
          <Route element={<ProtectedRoute allowedRoles={['er_doctor', 'clinic_doctor']} />}>
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route path="er" element={<DoctorQueue />} />
              <Route path="clinic" element={<DoctorQueue />} />
              <Route path="upcoming" element={<DoctorUpcoming />} />
              <Route path="history" element={<DoctorHistory />} />
            </Route>
          </Route>
          <Route path="*" element={<div className="p-8 text-center text-2xl">404 - Sayfa Bulunamadı</div>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
