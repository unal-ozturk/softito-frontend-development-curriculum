import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/data-table';

export default function DoctorUpcoming() {
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, status: apptStatus } = useSelector((state) => state.appointments);
  const { list: patients, status: patientStatus } = useSelector((state) => state.patients);

  const isLoading = (apptStatus === 'loading' && appointments.length === 0) || (patientStatus === 'loading' && (!patients || patients.length === 0));

  // Filter future appointments for this doctor that are still "bekliyor"
  const { data } = useMemo(() => {
    const today = new Date().toLocaleDateString('sv-SE');
    const queue = appointments.filter(a => {
      const isFuture = a.tarih > today;
      const isWaiting = a.durum === 'bekliyor';
      if (user?.role === 'er_doctor') {
        return isFuture && isWaiting && a.clinicId === 'er';
      }
      return isFuture && isWaiting && (
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
      if (a.tarih !== b.tarih) return a.tarih.localeCompare(b.tarih);
      return a.saat.localeCompare(b.saat);
    });

    return { data: mappedData };
  }, [appointments, patients, user]);

  const columns = [
    { accessorKey: "tarih", header: "Tarih", cell: ({row}) => new Date(row.original.tarih).toLocaleDateString('tr-TR') },
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
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Yaklaşan</Badge>;
      }
    }
  ];

  return (
    <div className="page-container">
      <Card>
        <CardHeader>
          <CardTitle>Gelecek Randevular</CardTitle>
          <CardDescription>Size atanmış, önümüzdeki günlere ait randevulu hastalarınız.</CardDescription>
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
    </div>
  );
}
