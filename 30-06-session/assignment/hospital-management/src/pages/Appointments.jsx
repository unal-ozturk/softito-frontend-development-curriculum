import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Clock } from 'lucide-react';
import { addAppointment, updateAppointment } from '../store/appointmentsSlice';
import { fetchUsers } from '../store/usersSlice';
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00",
  "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

const CLINICS = [
  { id: 'c1', name: 'Dahiliye Polikliniği' },
  { id: 'c2', name: 'Kardiyoloji Polikliniği' },
  { id: 'c3', name: 'Ortopedi Polikliniği' },
  { id: 'c4', name: 'Göz Polikliniği' },
  { id: 'c5', name: 'KBB Polikliniği' },
];

export default function Appointments() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { list: appointments, status: apptStatus } = useSelector((state) => state.appointments);
  const { list: patients, status: patientStatus } = useSelector((state) => state.patients);

  const { list: usersList, status: usersStatus } = useSelector((state) => state.users);
  const doctors = useMemo(() => usersList.filter(u => u.role && u.role.includes('doctor')), [usersList]);
  const isDoctorsLoaded = usersStatus === 'succeeded';
  
  const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString('sv-SE'));
  const [selectedClinic, setSelectedClinic] = useState("c1");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  
  const [isNewApptOpen, setIsNewApptOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  
  const [isManageApptOpen, setIsManageApptOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Load Doctors
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  // Ensure selected doctor defaults to the first doctor of the selected clinic
  useEffect(() => {
    const availableDocs = doctors.filter(d => d.clinicId === selectedClinic);
    if (availableDocs.length > 0) {
      if (!availableDocs.find(d => String(d.id) === String(selectedDoctor))) {
        setSelectedDoctor(availableDocs[0].id);
      }
    } else {
      setSelectedDoctor("");
    }
  }, [selectedClinic, doctors, selectedDoctor]);

  const currentAppointments = useMemo(() => {
    return appointments.filter(a => 
      a.tarih === selectedDate && 
      String(a.doctorId) === String(selectedDoctor) &&
      a.durum !== 'iptal' // İptal edilenleri gösterme veya farklı renkte göster
    );
  }, [appointments, selectedDate, selectedDoctor]);

  const handleSlotClick = (time, isOccupied, appt) => {
    const today = new Date().toLocaleDateString('sv-SE');
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Geçmiş Tarih Kontrolü
    if (selectedDate < today || (selectedDate === today && time < currentTimeStr)) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Geçmiş zamana randevu verilemez veya işlem yapılamaz.",
      });
      return;
    }

    if (isOccupied) {
      setSelectedAppointment(appt);
      setIsManageApptOpen(true);
      return;
    }
    
    setSelectedTimeSlot(time);
    setIsNewApptOpen(true);
  };

  const onSubmitAppt = (data) => {
    const patient = patients.find(p => p.tcNo === data.tcNo);
    if (!patient) {
      toast({
        variant: "destructive",
        title: "Hasta Bulunamadı",
        description: "Girdiğiniz TC Kimlik numarasına ait hasta sistemde kayıtlı değil.",
      });
      return;
    }

    const newAppt = {
      id: `ap-${Date.now()}`,
      patientId: patient.id,
      doctorId: String(selectedDoctor),
      clinicId: selectedClinic,
      tarih: selectedDate,
      saat: selectedTimeSlot,
      durum: "bekliyor",
      odemeDurumu: "bekliyor",
      siraNo: currentAppointments.length + 1
    };

    dispatch(addAppointment(newAppt));
    setIsNewApptOpen(false);
    reset();
    toast({
      variant: "success",
      title: "Randevu Oluşturuldu",
      description: `${patient.adSoyad} için saat ${selectedTimeSlot}'a randevu verildi.`,
    });
  };

  const handleCancelAppt = () => {
    if (selectedAppointment) {
      dispatch(updateAppointment({ id: selectedAppointment.id, data: { durum: 'iptal' } }));
      toast({
        variant: "success",
        title: "Randevu İptal Edildi",
        description: "Randevu başarıyla iptal edildi.",
      });
      setIsManageApptOpen(false);
    }
  };

  const isLoading = (apptStatus === 'loading' && appointments.length === 0) || (patientStatus === 'loading' && (!patients || patients.length === 0)) || !isDoctorsLoaded;

  return (
    <div className="page-container">
      <div>
        <h2 className="page-header">Randevu Takvimi</h2>
        <p className="page-subtitle">Poliklinik ve doktor bazlı çalışma takvimi ve yeni randevu oluşturma.</p>
      </div>

      <div className="appt-filters-row">
        <div className="form-group">
          <Label>Tarih</Label>
          <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>
        <div className="form-group flex-1">
          <Label>Poliklinik</Label>
          <select 
            className="appt-select-input"
            value={selectedClinic} 
            onChange={(e) => setSelectedClinic(e.target.value)}
          >
            {CLINICS.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group flex-1">
          <Label>Doktor</Label>
          <select 
            className="appt-select-input"
            value={selectedDoctor} 
            onChange={(e) => setSelectedDoctor(e.target.value)}
            disabled={!selectedDoctor}
          >
            {doctors.filter(d => d.clinicId === selectedClinic).map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="dashboard-card-header">
            <CalendarIcon className="calendar-title-icon" />
            Günlük Randevu Cetveli
          </CardTitle>
          <CardDescription>Yeşil saatlere tıklayarak o dilime yeni randevu oluşturabilirsiniz. Dolu randevulara tıklayarak yönetebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="calendar-grid">
               {[...Array(15)].map((_, i) => <Skeleton key={i} className="calendar-slot-skeleton" />)}
            </div>
          ) : (
            <div className="calendar-grid">
              {TIME_SLOTS.map((time) => {
                const appt = currentAppointments.find(a => a.saat === time);
                const isOccupied = !!appt;
                let patientName = "";
                if (isOccupied) {
                  const p = patients.find(p => p.id === appt.patientId);
                  patientName = p ? p.adSoyad : "Bilinmeyen Hasta";
                }

                const today = new Date().toLocaleDateString('sv-SE');
                const now = new Date();
                const currentTimeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
                const isPast = selectedDate < today || (selectedDate === today && time < currentTimeStr);

                return (
                  <div 
                    key={time}
                    onClick={() => handleSlotClick(time, isOccupied, appt)}
                    className={`calendar-slot-base ${isOccupied ? 'calendar-slot-occupied' : isPast ? 'calendar-slot-past' : 'calendar-slot-free'}`}
                  >
                    <div className="calendar-slot-time-wrapper">
                      <Clock className={isOccupied ? 'calendar-slot-icon-occupied' : isPast ? 'calendar-slot-icon-past' : 'calendar-slot-icon-free'} />
                      <span className={isOccupied ? 'calendar-slot-time-red' : isPast ? 'calendar-slot-time-past' : 'calendar-slot-time-green'}>{time}</span>
                    </div>
                    {isOccupied ? (
                      <span className="calendar-slot-patient">
                        {patientName}
                      </span>
                    ) : (
                      <span className={isPast ? "calendar-slot-action-past" : "calendar-slot-action"}>
                        {isPast ? "Geçmiş Saat" : "+ Randevu Ver"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NEW APPOINTMENT MODAL */}
      {isNewApptOpen && (
        <Dialog open={isNewApptOpen} onOpenChange={setIsNewApptOpen}>
          <DialogContent className="modal-content-sm">
            <DialogHeader>
              <DialogTitle>Yeni Randevu Oluştur</DialogTitle>
              <DialogDescription>
                Seçilen Saat: <strong className="dashboard-value-primary">{selectedTimeSlot}</strong>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitAppt)} className="form-group-modal">
              <div className="form-group">
                <Label htmlFor="tcNo">Hastanın TC Kimlik Numarası</Label>
                <Input id="tcNo" maxLength={11} placeholder="11 haneli TC no girin..." {...register('tcNo', { required: true })} />
                <p className="modal-helper-text">Not: Randevu vermek için hastanın sistemde daha önceden kayıtlı olması gerekir.</p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewApptOpen(false)}>İptal</Button>
                <Button type="submit">Randevuyu Kaydet</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* MANAGE APPOINTMENT MODAL */}
      {isManageApptOpen && selectedAppointment && (
        <Dialog open={isManageApptOpen} onOpenChange={setIsManageApptOpen}>
          <DialogContent className="modal-content-sm">
            <DialogHeader>
              <DialogTitle>Randevu Yönetimi</DialogTitle>
              <DialogDescription>
                Seçilen Saat: <strong className="text-red-600">{selectedAppointment.saat}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm">Bu randevu dolu. Ne yapmak istersiniz?</p>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsManageApptOpen(false)}>Vazgeç</Button>
                <Button type="button" variant="destructive" onClick={handleCancelAppt}>Randevuyu İptal Et</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
