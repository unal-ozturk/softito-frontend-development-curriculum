import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Search, UserPlus, Clock } from 'lucide-react';
import { nanoid } from 'nanoid';
import { fetchPatients, addPatient, fetchPatientHistory, updatePaymentStatus } from '../store/patientsSlice';
import { addAppointment } from '../store/appointmentsSlice';
import { fetchUsers } from '../store/usersSlice';
import { formatDate } from '@/lib/utils';

const CLINICS = [
  { id: 'c1', name: 'Dahiliye' },
  { id: 'c2', name: 'Kardiyoloji' },
  { id: 'c3', name: 'Ortopedi' },
  { id: 'c4', name: 'Göz' },
  { id: 'c5', name: 'KBB' },
];

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";

// Validation schema for New Patient
const newPatientSchema = yup.object().shape({
  tcNo: yup.string().length(11, 'TC No 11 haneli olmalıdır').required('Zorunlu alan'),
  adSoyad: yup.string().required('Zorunlu alan'),
  dogumTarihi: yup.string().required('Zorunlu alan'),
  cinsiyet: yup.string().oneOf(['Erkek', 'Kadın'], 'Lütfen geçerli bir cinsiyet seçin').required('Zorunlu alan'),
  telefon: yup.string().transform(v => v ? v.replace(/\s+/g, '') : v).matches(/^05\d{9}$/, 'Telefon 05XXXXXXXXX formatında 11 haneli olmalıdır.').required('Zorunlu alan'),
});

export default function Patients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: patients, history, status } = useSelector((state) => state.patients);
  const { list: allAppointments } = useSelector((state) => state.appointments);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [newlyRegisteredPatient, setNewlyRegisteredPatient] = useState(null);

  // Modals state
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { list: usersList, status: usersStatus } = useSelector((state) => state.users);
  const doctors = useMemo(() => usersList.filter(u => u.role && u.role.includes('doctor')), [usersList]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(newPatientSchema),
  });

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.adSoyad.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.tcNo.includes(searchTerm) ||
      p.hastaNo.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  const onSubmitNewPatient = (data) => {
    // Check if TC exists
    if (patients.some(p => p.tcNo === data.tcNo)) {
      toast({
        variant: "destructive",
        title: "Kayıt Başarısız",
        description: "Bu TC numarası zaten sistemde kayıtlı!",
      });
      return;
    }

    const newPatient = {
      ...data,
      hastaNo: `HY-${Math.floor(1000 + Math.random() * 9000)}`,
      kronikHastaliklar: [],
      alerjiler: "Bilinmiyor",
      sigortaTuru: "SGK"
    };

    dispatch(addPatient(newPatient))
      .unwrap()
      .then((savedPatient) => {
        setNewlyRegisteredPatient(savedPatient);
      })
      .catch((err) => {
        console.error(err);
      });
    setIsNewPatientOpen(false);
    reset();
  };

  const handleRouteToER = (patient) => {
    // Check if the parameter is a valid patient object, otherwise fallback to newlyRegisteredPatient
    const targetPatient = (patient && patient.id) ? patient : newlyRegisteredPatient;
    if (!targetPatient) return;
    
    const today = new Date().toLocaleDateString('sv-SE');
    const currentERAppts = allAppointments.filter(a => a.clinicId === 'er' && a.tarih === today && a.durum === 'bekliyor');
    
    const erAppt = {
      id: `ap-${Date.now()}`,
      patientId: targetPatient.id,
      doctorId: null, // Generic ER doctor
      clinicId: 'er',
      tarih: today,
      saat: 'Acil Sıra',
      durum: 'bekliyor',
      odemeDurumu: 'bekliyor',
      siraNo: currentERAppts.length + 1
    };
    dispatch(addAppointment(erAppt));
    toast({
      variant: "success",
      title: "Acile Yönlendirildi",
      description: `${targetPatient.adSoyad} başarıyla acil sırasına alındı.`,
    });
    
    // Clear modal if it was a newly registered patient
    if (newlyRegisteredPatient && newlyRegisteredPatient.id === targetPatient.id) {
      setNewlyRegisteredPatient(null);
    }
  };

  const handleRouteToClinic = () => {
    setNewlyRegisteredPatient(null);
    navigate('/secretary/appointments');
  };

  const openHistoryModal = (patient) => {
    setSelectedPatient(patient);
    dispatch(fetchPatientHistory(patient.id));
    setIsHistoryOpen(true);
  };

  const handlePaymentUpdate = (recordId) => {
    dispatch(updatePaymentStatus({ id: recordId, odemeDurumu: 'ödendi' }))
      .unwrap()
      .then(() => {
        toast({
          variant: "success",
          title: "Ödeme Alındı",
          description: "Hastanın ödeme durumu sistemde güncellendi.",
        });
      });
  };

  const getDoctorName = (docId) => {
    const doc = doctors.find(d => String(d.id) === String(docId));
    return doc ? doc.name : `Dr. ${docId}`;
  };

  const getClinicName = (clinicId) => {
    const clinic = CLINICS.find(c => c.id === clinicId);
    return clinic ? clinic.name : 'Dahiliye';
  };

  const patientColumns = [
    {
      accessorKey: "hastaNo",
      header: "Hasta No",
      cell: ({ row }) => <span className="table-cell-bold">{row.original.hastaNo}</span>,
    },
    {
      accessorKey: "tcNo",
      header: "TC Kimlik",
    },
    {
      accessorKey: "adSoyad",
      header: "Ad Soyad",
    },
    {
      accessorKey: "dogumTarihi",
      header: "Doğum T.",
      cell: ({ row }) => formatDate(row.original.dogumTarihi),
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8" onClick={() => handleRouteToER(row.original)}>
            Acile Al
          </Button>
          <Button variant="link" onClick={() => openHistoryModal(row.original)} className="table-action-link">
            Geçmişi Gör <Clock className="table-action-icon" />
          </Button>
        </div>
      ),
    },
  ];

  const historyColumns = [
    {
      accessorKey: "tarih",
      header: "Tarih ve Saat",
      cell: ({ row }) => `${formatDate(row.original.tarih)} - ${row.original.saat}`,
    },
    {
      accessorKey: "clinicId",
      header: "Poliklinik",
      cell: ({ row }) => getClinicName(row.original.clinicId),
    },
    {
      accessorKey: "doctorId",
      header: "Doktor",
      cell: ({ row }) => getDoctorName(row.original.doctorId),
    },
    {
      accessorKey: "odemeDurumu",
      header: "Ücret Durumu",
      cell: ({ row }) => (
        row.original.odemeDurumu === 'bekliyor' ? (
          <Badge variant="warning">Bekliyor</Badge>
        ) : (
          <Badge variant="success">Ödendi</Badge>
        )
      ),
    },
    {
      id: "actions",
      header: "Aksiyon",
      cell: ({ row }) => (
        row.original.odemeDurumu === 'bekliyor' && (
          <Button size="sm" variant="outline" onClick={() => handlePaymentUpdate(row.original.id)}>Ödeme Al</Button>
        )
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2 className="page-header">Hastalar</h2>
          <p className="page-subtitle">Sistemdeki tüm hasta kayıtları ve geçmiş işlemleri.</p>
        </div>
        <Button onClick={() => setIsNewPatientOpen(true)} className="patients-new-btn">
          <UserPlus className="btn-icon-mr" />
          Yeni Hasta Kayıt
        </Button>
      </div>

      <Card>
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Kayıtlı Hastalar</CardTitle>
          <div className="table-search-wrapper">
            <Search className="table-search-icon" />
            <Input 
              placeholder="İsim, TC veya No Ara..." 
              className="table-search-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="table-card-content">
          {status === 'loading' ? (
             <div className="table-skeleton-wrapper">
               {[1,2,3].map(i => <Skeleton key={i} className="table-row-skeleton" />)}
             </div>
          ) : (
            <DataTable columns={patientColumns} data={filteredPatients} pageSize={5} />
          )}
        </CardContent>
      </Card>

      {/* NEW PATIENT MODAL */}
      {isNewPatientOpen && (
        <Dialog open={isNewPatientOpen} onOpenChange={setIsNewPatientOpen}>
          <DialogContent className="modal-content-sm">
            <DialogHeader>
              <DialogTitle>Yeni Hasta Kayıt</DialogTitle>
              <DialogDescription>
                Hastanemize ilk defa giriş yapan hastanın temel bilgilerini girin.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitNewPatient)} className="form-group-modal">
              <div className="form-group">
                <Label htmlFor="tcNo">TC Kimlik No</Label>
                <Input id="tcNo" maxLength={11} {...register('tcNo')} />
                {errors.tcNo && <span className="form-error-text">{errors.tcNo.message}</span>}
              </div>
              <div className="form-group">
                <Label htmlFor="adSoyad">Ad Soyad</Label>
                <Input id="adSoyad" {...register('adSoyad')} />
                {errors.adSoyad && <span className="form-error-text">{errors.adSoyad.message}</span>}
              </div>
              <div className="modal-form-grid">
                <div className="form-group">
                  <Label htmlFor="dogumTarihi">Doğum Tarihi</Label>
                  <Input id="dogumTarihi" type="date" {...register('dogumTarihi')} />
                  {errors.dogumTarihi && <span className="form-error-text">{errors.dogumTarihi.message}</span>}
                </div>
                <div className="form-group">
                  <Label htmlFor="cinsiyet">Cinsiyet</Label>
                  <select id="cinsiyet" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" {...register('cinsiyet')}>
                    <option value="">Seçiniz</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                  {errors.cinsiyet && <span className="form-error-text">{errors.cinsiyet.message}</span>}
                </div>
              </div>
              <div className="form-group">
                <Label htmlFor="telefon">Telefon</Label>
                <Input id="telefon" placeholder="05XXXXXXXXX" maxLength={11} {...register('telefon')} />
                {errors.telefon && <span className="form-error-text">{errors.telefon.message}</span>}
              </div>
              <DialogFooter>
                <Button type="submit">Kaydet</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* POST REGISTRATION MODAL */}
      {newlyRegisteredPatient && (
        <Dialog open={!!newlyRegisteredPatient} onOpenChange={() => setNewlyRegisteredPatient(null)}>
          <DialogContent className="modal-content-sm">
            <DialogHeader>
              <DialogTitle>Hasta Başarıyla Kaydedildi</DialogTitle>
              <DialogDescription>
                {newlyRegisteredPatient.adSoyad} isimli hastayı şimdi nereye yönlendirmek istersiniz?
              </DialogDescription>
            </DialogHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <Button onClick={handleRouteToER} style={{ backgroundColor: '#dc2626', color: 'white' }}>Acil Servis Sırasına Al</Button>
              <Button onClick={handleRouteToClinic}>Poliklinik Randevusu Ver</Button>
              <Button variant="outline" onClick={() => setNewlyRegisteredPatient(null)}>İşlemi Tamamla (Kapat)</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* PAST VISITS MODAL */}
      {isHistoryOpen && selectedPatient && (
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="modal-content-lg">
            <DialogHeader>
              <DialogTitle>{selectedPatient.adSoyad} - Geçmiş İşlemler</DialogTitle>
              <DialogDescription>
                Hastanın tüm randevu, muayene ve ödeme geçmişi (Yeniden Eskiye).
              </DialogDescription>
            </DialogHeader>
            <div className="history-modal-content">
               <DataTable columns={historyColumns} data={history} pageSize={5} />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsHistoryOpen(false)}>Kapat</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
