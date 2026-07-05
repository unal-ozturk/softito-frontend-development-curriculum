import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/data-table';
import ExaminationModal from '../../components/ExaminationModal';
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DoctorHistory() {
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, status: apptStatus } = useSelector((state) => state.appointments);
  const { list: patients, status: patientStatus } = useSelector((state) => state.patients);

  const [examModalOpen, setExamModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const isLoading = (apptStatus === 'loading' && appointments.length === 0) || (patientStatus === 'loading' && (!patients || patients.length === 0));

  // Filter completed appointments for this doctor using useMemo
  const data = useMemo(() => {
    const myHistory = appointments.filter(a => 
      String(a.doctorId) === String(user?.id) && 
      a.durum === 'tamamlandi'
    );

    return myHistory.map(appt => {
      const p = patients.find(p => p.id === appt.patientId);
      return {
        ...appt,
        patientName: p ? p.adSoyad : 'Bilinmiyor',
        tcNo: p ? p.tcNo : '-',
      };
    }).sort((a, b) => new Date(b.tarih) - new Date(a.tarih) || b.saat.localeCompare(a.saat));
  }, [appointments, patients, user]);

  const columns = [
    { accessorKey: "tarih", header: "Tarih", cell: ({ row }) => formatDate(row.original.tarih) },
    { accessorKey: "saat", header: "Saat" },
    { accessorKey: "tcNo", header: "TC No" },
    { accessorKey: "patientName", header: "Hasta Adı", cell: ({row}) => <span className="font-medium">{row.original.patientName}</span> },
    { 
      accessorKey: "status", 
      header: "Durum",
      cell: () => <Badge variant="success">Tamamlandı</Badge>
    },
    {
      id: "actions",
      header: "İşlem",
      cell: ({ row }) => {
        return (
          <Button size="sm" variant="secondary" onClick={() => {
            setSelectedAppointment(row.original);
            setExamModalOpen(true);
          }}>
            <Eye className="w-4 h-4 mr-2" /> Dosyayı İncele
          </Button>
        );
      }
    }
  ];

  return (
    <div className="page-container">
      <Card>
        <CardHeader>
          <CardTitle>Geçmiş Hastalar</CardTitle>
          <CardDescription>Daha önce muayene ettiğiniz hastaların geçmiş kayıtları ve tahlil sonuçları.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={data} searchKey="patientName" pageSize={10} />
          )}
        </CardContent>
      </Card>

      {/* Examination Modal (Read Only mode passed via prop in future, for now just open it) */}
      {examModalOpen && selectedAppointment && (
        <ExaminationModal 
          open={examModalOpen} 
          onOpenChange={setExamModalOpen} 
          appointment={selectedAppointment}
          patient={patients.find(p => p.id === selectedAppointment.patientId)}
          onNext={() => {}}
          onPrev={() => {}}
          hasNext={false}
          hasPrev={false}
          isHistory={true}
        />
      )}
    </div>
  );
}
