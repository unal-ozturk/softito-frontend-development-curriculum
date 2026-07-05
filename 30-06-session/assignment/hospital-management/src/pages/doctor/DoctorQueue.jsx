import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/data-table';
import ExaminationModal from '../../components/ExaminationModal';

export default function DoctorQueue() {
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, status: apptStatus } = useSelector((state) => state.appointments);
  const { list: patients, status: patientStatus } = useSelector((state) => state.patients);

  const [examModalOpen, setExamModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const isLoading = (apptStatus === 'loading' && appointments.length === 0) || (patientStatus === 'loading' && (!patients || patients.length === 0));

  // Filter today's appointments for this doctor that are still "bekliyor"
  const { myQueue, data } = useMemo(() => {
    const today = new Date().toLocaleDateString('sv-SE');
    const queue = appointments.filter(a => {
      const isToday = a.tarih === today;
      const isWaiting = a.durum === 'bekliyor';
      if (user?.role === 'er_doctor') {
        return isToday && isWaiting && a.clinicId === 'er';
      }
      return isToday && isWaiting && (
        String(a.doctorId) === String(user?.id) || 
        (a.clinicId === user?.clinicId && a.doctorId === null)
      );
    });

    const mappedData = queue.map(appt => {
      const p = patients.find(p => p.id === appt.patientId);
      return {
        ...appt,
        patientName: p ? p.adSoyad : 'Bilinmiyor',
        tcNo: p ? p.tcNo : '-',
      };
    }).sort((a, b) => {
      if (a.siraNo === 0 && b.siraNo !== 0) return -1;
      if (b.siraNo === 0 && a.siraNo !== 0) return 1;
      return a.saat.localeCompare(b.saat);
    });

    return { myQueue: queue, data: mappedData };
  }, [appointments, patients, user]);

  const columns = [
    { accessorKey: "saat", header: "Saat" },
    { accessorKey: "tcNo", header: "TC No" },
    { accessorKey: "patientName", header: "Hasta Adı", cell: ({row}) => <span className="font-medium">{row.original.patientName}</span> },
    { 
      accessorKey: "status", 
      header: "Durum",
      cell: ({ row }) => {
        if (row.original.isReferral) {
          return <Badge variant="destructive">Acilden Sevk</Badge>;
        }
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Bekliyor</Badge>;
      }
    },
    {
      id: "actions",
      header: "İşlem",
      cell: ({ row }) => {
        return (
          <Button size="sm" onClick={() => {
            setSelectedAppointment(row.original);
            setExamModalOpen(true);
          }}>
            Muayeneye Al
          </Button>
        );
      }
    }
  ];

  const currentIndex = selectedAppointment ? data.findIndex(a => a.id === selectedAppointment.id) : -1;

  const handleNextPatient = () => {
    if (currentIndex >= 0 && currentIndex < data.length - 1) {
      setSelectedAppointment(data[currentIndex + 1]);
    } else if (currentIndex === -1 && data.length > 0) {
      setSelectedAppointment(data[0]);
    }
  };

  const handlePrevPatient = () => {
    if (currentIndex > 0) {
      setSelectedAppointment(data[currentIndex - 1]);
    }
  };

  return (
    <div className="page-container">
      <Card>
        <CardHeader>
          <CardTitle>Bekleyen Hastalar</CardTitle>
          <CardDescription>Size atanmış ve sırada bekleyen bugünkü hastalarınız.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={data} searchKey="patientName" pageSize={5} />
          )}
        </CardContent>
      </Card>

      {/* Examination Modal */}
      {examModalOpen && selectedAppointment && (
        <ExaminationModal 
          open={examModalOpen} 
          onOpenChange={setExamModalOpen} 
          appointment={selectedAppointment}
          patient={patients.find(p => p.id === selectedAppointment.patientId)}
          onNext={handleNextPatient}
          onPrev={handlePrevPatient}
          hasNext={(currentIndex >= 0 && currentIndex < data.length - 1) || (currentIndex === -1 && data.length > 0)}
          hasPrev={currentIndex > 0}
        />
      )}
    </div>
  );
}
