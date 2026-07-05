import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../store/appointmentsSlice';
import { fetchPatients } from '../store/patientsSlice';

export function useDataPoller() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // İlk yükleme
    dispatch(fetchAppointments());
    dispatch(fetchPatients());

    // 10 saniyede bir short polling
    const interval = setInterval(() => {
      dispatch(fetchAppointments());
      dispatch(fetchPatients());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated]);
}
