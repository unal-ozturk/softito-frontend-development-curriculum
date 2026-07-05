import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Users, Building2, Clock, Ban, CreditCard } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SecretaryDashboard() {
  const { list: appointments, status: apptStatus } = useSelector((state) => state.appointments);
  const { list: patients, status: patientStatus } = useSelector((state) => state.patients);

  const isLoading = (apptStatus === 'loading' && appointments.length === 0) || (patientStatus === 'loading' && (!patients || patients.length === 0));

  // Calculate Statistics using useMemo
  const stats = useMemo(() => {
    const todayObj = new Date();
    const todayStr = todayObj.toLocaleDateString('sv-SE');
    
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayStr = yesterdayObj.toLocaleDateString('sv-SE');

    const todaysAppointments = appointments.filter(a => a.tarih === todayStr);
    const yesterdaysAppointments = appointments.filter(a => a.tarih === yesterdayStr);
    
    const patientDiff = todaysAppointments.length - yesterdaysAppointments.length;
    let diffText = "Düne göre eşit";
    if (patientDiff > 0) diffText = `+${patientDiff} dünden beri artış`;
    else if (patientDiff < 0) diffText = `${patientDiff} dünden beri azalış`;
    
    // Total 10 clinic doctors, each with 15 slots = 150 slots
    const MAX_DAILY_CAPACITY = 150;
    const occupancyRate = ((todaysAppointments.length / MAX_DAILY_CAPACITY) * 100).toFixed(1);

    return {
      bugunkuHasta: todaysAppointments.length,
      hastaFarkiText: diffText,
      hastaFarki: patientDiff,
      bekleyen: todaysAppointments.filter(a => a.durum === 'bekliyor').length,
      iptal: todaysAppointments.filter(a => a.durum === 'iptal').length,
      tahsilEdilen: todaysAppointments.filter(a => a.odemeDurumu === 'ödendi').length * 500, // Mock 500TL per appt
      dolulukOrani: occupancyRate
    };
  }, [appointments]);

  return (
    <div className="page-container">
      <div>
        <h2 className="page-header">Ana Sayfa</h2>
        <p className="page-subtitle">Günlük klinik özetiniz ve istatistikleriniz.</p>
      </div>

      {/* Dashboard Widgets */}
      <div className="dashboard-grid">
        
        {isLoading ? <Skeleton className="dashboard-skeleton" /> : (
          <Card>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Bugünkü Hasta</CardTitle>
              <Users className="dashboard-icon-muted" />
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats.bugunkuHasta}</div>
              <p className={`dashboard-card-label ${stats.hastaFarki > 0 ? 'text-green-600 font-medium' : stats.hastaFarki < 0 ? 'text-red-500 font-medium' : ''}`}>
                {stats.hastaFarkiText}
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading ? <Skeleton className="dashboard-skeleton" /> : (
          <Card>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Doluluk Oranı</CardTitle>
              <Building2 className="dashboard-icon-primary" />
            </CardHeader>
            <CardContent>
              <div className="dashboard-value-primary">%{stats.dolulukOrani}</div>
              <p className="dashboard-card-label">Poliklinik kapasitesi</p>
            </CardContent>
          </Card>
        )}

        {isLoading ? <Skeleton className="dashboard-skeleton" /> : (
          <Card>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Bekleyen</CardTitle>
              <Clock className="dashboard-icon-warning" />
            </CardHeader>
            <CardContent>
              <div className="dashboard-value-warning">{stats.bekleyen}</div>
              <p className="dashboard-card-label">Kuyrukta bekleyenler</p>
            </CardContent>
          </Card>
        )}

        {isLoading ? <Skeleton className="dashboard-skeleton" /> : (
          <Card>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">İptaller</CardTitle>
              <Ban className="dashboard-icon-destructive" />
            </CardHeader>
            <CardContent>
              <div className="dashboard-value-destructive">{stats.iptal}</div>
              <p className="dashboard-card-label">Bugün iptal edilen</p>
            </CardContent>
          </Card>
        )}

        {isLoading ? <Skeleton className="dashboard-skeleton" /> : (
          <Card className="dashboard-card-success">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title-success">Bugün Tahsil Edilen</CardTitle>
              <CreditCard className="dashboard-icon-success" />
            </CardHeader>
            <CardContent>
              <div className="dashboard-value-success">₺{stats.tahsilEdilen.toLocaleString('tr-TR')}</div>
              <p className="dashboard-label-success">Güncel vardiya kasası</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="dashboard-secondary-grid">
         {/* We can add quick actions or mini-tables here later */}
         <Card className="dashboard-secondary-card">
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="dashboard-empty-state">
                Güncel bir aktivite bulunmuyor.
              </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
