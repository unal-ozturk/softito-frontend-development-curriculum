import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ChevronLeft, ChevronRight, Activity, FlaskConical, History, Send, Beaker, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { completeExamination, referToClinic } from '../store/appointmentsSlice';
import { requestLabTest } from '../store/labSlice';
import { fetchUsers } from '../store/usersSlice';
import { useToast } from "@/hooks/use-toast";

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

export default function ExaminationModal({ open, onOpenChange, appointment, patient, onNext, onPrev, hasNext, hasPrev, isHistory = false }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { list: labResults } = useSelector((state) => state.lab);
  const { list: allAppointments } = useSelector((state) => state.appointments);
  
  // If it's history, default to "sonuclar" tab
  const [activeTab, setActiveTab] = useState(isHistory ? "sonuclar" : "muayene");
  const { register, handleSubmit, reset } = useForm();
  
  // Test Request Form State
  const [selectedTest, setSelectedTest] = useState("Kan Testi 1 (Hemogram)");
  
  // Referral Form State
  const [selectedClinic, setSelectedClinic] = useState("c1");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [referralNote, setReferralNote] = useState("");

  const isER = user?.role === 'er_doctor';

  // Past Note Edit State
  const [editingPastApptId, setEditingPastApptId] = useState(null);
  const [editFormData, setEditFormData] = useState({ sikayet: "", tani: "", recete: "" });

  const handleEditPastAppt = (appt) => {
    setEditingPastApptId(appt.id);
    setEditFormData({
      sikayet: appt.sikayet || "",
      tani: appt.tani || "",
      recete: appt.recete || ""
    });
  };

  const handleSavePastAppt = (id) => {
    dispatch(completeExamination({ appointmentId: id, notes: editFormData, doctorId: user.id }));
    setEditingPastApptId(null);
    toast({
      variant: "success",
      title: "Geçmiş Kayıt Güncellendi",
      description: "Tıbbi geçmiş kaydındaki notlar başarıyla düzenlendi."
    });
  };

  const { list: usersList, status: usersStatus } = useSelector((state) => state.users);
  const doctors = React.useMemo(() => usersList.filter(u => u.role && u.role.includes('doctor')), [usersList]);

  // Load doctors for referral and history resolving
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  // Update selected doctor when clinic changes
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

  // Form Verilerini Mevcut Randevu Notlarıyla Doldur veya Sıfırla
  useEffect(() => {
    if (appointment) {
      reset({
        sikayet: appointment.sikayet || "",
        tani: appointment.tani || "",
        recete: appointment.recete || ""
      });
    }
  }, [appointment, reset]);

  // Filter lab results for this patient
  const patientLabs = labResults.filter(l => l.patientId === patient?.id);

  // Filter past examinations for this patient (if history, include all completed; if active, exclude current)
  const pastExaminations = allAppointments.filter(
    a => a.patientId === patient?.id && a.durum === 'tamamlandi' && (isHistory || a.id !== appointment?.id) && (a.tani || a.sikayet || a.recete)
  ).sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

  const onSubmitMuayene = (data) => {
    dispatch(completeExamination({ appointmentId: appointment.id, notes: data, doctorId: user.id }));
    toast({
      variant: "success",
      title: isHistory ? "Notlar Güncellendi" : "Muayene Tamamlandı",
      description: `${patient.adSoyad} isimli hastanın notları kaydedildi.`,
    });
    if (hasNext) onNext();
    else onOpenChange(false);
  };

  const handleTestRequest = () => {
    dispatch(requestLabTest({
      patientId: patient.id,
      doctorId: user.id,
      testType: selectedTest
    })).unwrap().then(() => {
      toast({
        variant: "success",
        title: "Tetkik Sonucu Çıktı",
        description: `${selectedTest} sonucu sisteme yüklendi. 'Geçmiş Kayıtlar' sekmesinden inceleyebilirsiniz.`,
      });
    });

    toast({
      title: "Tetkik İsteği Gönderildi",
      description: `${selectedTest} için laboratuvara/radyolojiye istek düşüldü. Lütfen bekleyin.`,
    });
  };

  const handleReferral = () => {
    if(!referralNote) {
      toast({ variant: "destructive", title: "Hata", description: "Lütfen sevk notu giriniz."});
      return;
    }
    if(!selectedDoctor) {
      toast({ variant: "destructive", title: "Hata", description: "Lütfen hedef hekimi seçiniz."});
      return;
    }
    dispatch(referToClinic({
      appointmentId: appointment.id,
      sourceDoctorId: user.id,
      targetClinicId: selectedClinic,
      targetDoctorId: selectedDoctor,
      referralNote,
      patientId: patient.id,
      date: appointment.tarih, // Same day
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' }) // Current time
    }));
    toast({
      variant: "success",
      title: "Hasta Sevk Edildi",
      description: "Hasta ilgili hekime acil önceliği ile aktarıldı.",
    });
    if (hasNext) onNext();
    else onOpenChange(false);
  };

  const PastRecordsContent = (
    <div className="space-y-8">
      {/* Past Examinations Section */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center text-slate-800 border-b pb-2">
          <Activity className="w-5 h-5 mr-2 text-primary" /> Önceki Muayeneler ve Notlar
        </h3>
        {pastExaminations.length === 0 ? (
          <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-lg border">
            Bu hastaya ait geçmiş muayene kaydı bulunmuyor.
          </div>
        ) : (
          <div className="space-y-4">
            {pastExaminations.map(pastAppt => {
              const doc = doctors.find(d => String(d.id) === String(pastAppt.doctorId));
              const isOwner = String(user?.id) === String(pastAppt.doctorId);
              const isEditing = editingPastApptId === pastAppt.id;

              return (
                <div key={pastAppt.id} className={`bg-white border ${isEditing ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200'} rounded-lg p-4 shadow-sm transition-all`}>
                  <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="font-semibold text-slate-800">{doc ? doc.name : 'Diğer Hekim'}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">{new Date(pastAppt.tarih).toLocaleDateString('tr-TR')} - {pastAppt.saat}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-slate-50 text-slate-600">
                        {pastAppt.clinicId === 'er' ? 'Acil Servis' : `Poliklinik (${pastAppt.clinicId})`}
                      </Badge>
                      {isOwner && !isEditing && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleEditPastAppt(pastAppt)}>
                          Düzenle
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3 mt-3 animate-in fade-in zoom-in-95 duration-200">
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Şikayet</Label>
                        <Textarea 
                          value={editFormData.sikayet} 
                          onChange={e => setEditFormData({...editFormData, sikayet: e.target.value})} 
                          className="min-h-[60px] text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Tanı</Label>
                        <Textarea 
                          value={editFormData.tani} 
                          onChange={e => setEditFormData({...editFormData, tani: e.target.value})} 
                          className="min-h-[60px] text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Reçete</Label>
                        <Textarea 
                          value={editFormData.recete} 
                          onChange={e => setEditFormData({...editFormData, recete: e.target.value})} 
                          className="min-h-[60px] text-sm"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingPastApptId(null)}>İptal</Button>
                        <Button size="sm" onClick={() => handleSavePastAppt(pastAppt.id)}>Kaydet</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm mt-3">
                      {pastAppt.referralNote && (
                        <div className="grid grid-cols-[80px_1fr] gap-2 bg-red-50 p-2 rounded border border-red-100">
                          <span className="font-medium text-red-800">Sevk Notu:</span>
                          <span className="text-red-700">{pastAppt.referralNote}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-[80px_1fr] gap-2">
                        <span className="font-medium text-slate-700">Şikayet:</span>
                        <span className="text-slate-600">{pastAppt.sikayet || '-'}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-2">
                        <span className="font-medium text-slate-700">Tanı:</span>
                        <span className="text-slate-600">{pastAppt.tani || '-'}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-2">
                        <span className="font-medium text-slate-700">Reçete:</span>
                        <span className="text-slate-600">{pastAppt.recete || '-'}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lab Results Section */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center text-slate-800 border-b pb-2">
          <FlaskConical className="w-5 h-5 mr-2 text-primary" /> Laboratuvar ve Görüntüleme
        </h3>
        {patientLabs.length === 0 ? (
          <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-lg border">
            Bu hastaya ait geçmiş laboratuvar veya radyoloji kaydı bulunmuyor.
          </div>
        ) : (
          <Accordion>
            {patientLabs.filter(l => l.status === "Çıktı").map((lab, idx) => (
              <AccordionItem 
                key={lab.id} 
                title={
                  <div>
                    <h4 className="modal-patient-name">{lab.type}</h4>
                    <span className="modal-patient-tc">{new Date(lab.date).toLocaleString('tr-TR')}</span>
                  </div>
                } 
                badge={<Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sonuç Çıktı</Badge>}
                defaultOpen={idx === 0}
              >
                <div className="lab-result-body">
                  {(lab.type === 'MR' || lab.type === 'Röntgen') && (
                    <div className="xray-card">
                      <div className="xray-thumbnail">
                        <img 
                          src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=400&auto=format&fit=crop" 
                          alt="X-Ray Placeholder" 
                          className="xray-img"
                        />
                      </div>
                      <div className="xray-info">
                        <h5 className="xray-title">Görüntüleme Sonucu</h5>
                        <p className="xray-desc">Sol yanda görülen röntgen/MR kesiti sisteme başarıyla yüklenmiştir. Radyoloji uzmanı notları aşağıdadır.</p>
                        {lab.results.map((r, i) => (
                          <div key={i} className="xray-note">
                            <strong>{r.name}:</strong> {r.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lab.type.includes('Kan Testi') && (
                    <table className="lab-result-table">
                       <thead className="lab-result-thead">
                         <tr>
                           <th className="px-4 py-2 font-medium">Parametre</th>
                           <th className="px-4 py-2 font-medium">Sonuç</th>
                           <th className="px-4 py-2 font-medium">Birim</th>
                           <th className="px-4 py-2 font-medium">Referans Aralığı</th>
                           <th className="px-4 py-2 font-medium">Durum</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {lab.results.map((r, i) => (
                           <tr key={i} className="hover:bg-slate-50/50">
                             <td className="px-4 py-2 font-medium text-slate-700">{r.name}</td>
                             <td className={`px-4 py-2 font-semibold ${r.flag === 'YÜKSEK' || r.flag === 'ANORMAL' ? 'text-red-600' : r.flag === 'DÜŞÜK' ? 'text-blue-600' : 'text-slate-700'}`}>
                               {r.value}
                             </td>
                             <td className="px-4 py-2 text-slate-500">{r.unit}</td>
                             <td className="px-4 py-2 text-slate-500">{r.reference}</td>
                             <td className="px-4 py-2">
                               {r.flag === 'NORMAL' && <Badge variant="outline" className="badge-normal">NORMAL</Badge>}
                               {r.flag === 'YÜKSEK' && <Badge variant="outline" className="badge-high">YÜKSEK</Badge>}
                               {r.flag === 'DÜŞÜK' && <Badge variant="outline" className="badge-low">DÜŞÜK</Badge>}
                               {r.flag === 'ANORMAL' && <Badge variant="outline" className="badge-high">ANORMAL</Badge>}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
                  )}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[95vw] h-[90vh] flex flex-col overflow-hidden">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50/50 shrink-0">
          <div className="flex-1 flex justify-start">
            {!isHistory && (
              <Button variant="outline" size="sm" onClick={onPrev} disabled={!hasPrev}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Önceki Hasta
              </Button>
            )}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-slate-800 flex items-center justify-center whitespace-nowrap">
              {patient?.adSoyad}
              {isHistory && <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-700 border-blue-200">Tıbbi Geçmiş Kayıtları</Badge>}
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">TC: {patient?.tcNo} | {patient?.cinsiyet}</p>
          </div>
          <div className="flex-1 flex justify-end">
            {!isHistory && (
              <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext}>
                Sonraki Hasta <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {isHistory ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 border-t">
            <div className="max-w-5xl mx-auto">
              {PastRecordsContent}
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="modal-tabs-root">
            <TabsList className="modal-tabs-list">
              <TabsTrigger value="muayene"><Activity className="w-4 h-4 mr-2"/> Muayene</TabsTrigger>
              <TabsTrigger value="tetkik"><FlaskConical className="w-4 h-4 mr-2"/> Tetkik İste</TabsTrigger>
              <TabsTrigger value="sonuclar"><History className="w-4 h-4 mr-2"/> Geçmiş Kayıtlar</TabsTrigger>
              <TabsTrigger value="sevk"><Send className="w-4 h-4 mr-2"/> Sevk (Acil)</TabsTrigger>
            </TabsList>

            {/* TAB 1: MUAYENE */}
            <TabsContent value="muayene" className="modal-tabs-content">
              {appointment.isReferral && (
                <div className="referral-alert-wrapper">
                  <h4 className="referral-alert-title">
                    <AlertCircle className="w-4 h-4 mr-2" /> Acilden Sevk Notu
                  </h4>
                  <p className="referral-alert-text">{appointment.referralNote}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmitMuayene)} className="space-y-4">
                <div className="form-group">
                  <Label>Şikayet ve Anamnez</Label>
                  <Textarea placeholder="Hastanın şikayetleri..." className="min-h-[100px]" {...register("sikayet")} />
                </div>
                <div className="form-group">
                  <Label>Klinik Bulgular ve Tanı</Label>
                  <Textarea placeholder="Fiziksel muayene bulguları ve tanı..." className="min-h-[100px]" {...register("tani")} />
                </div>
                <div className="form-group">
                  <Label>Reçete Edilecek İlaçlar</Label>
                  <Textarea placeholder="İlaç doz ve kullanım şekilleri..." className="min-h-[80px]" {...register("recete")} />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Muayeneyi Tamamla
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* TAB 2: TETKİK İSTE */}
            <TabsContent value="tetkik" className="modal-tabs-content">
               <div className="test-request-wrapper">
                  <div>
                    <h3 className="test-request-title">
                      <Beaker className="w-5 h-5 mr-2 text-primary" /> Yeni Tetkik İste
                    </h3>
                    <p className="test-request-desc">Sistemde entegre laboratuvar ve görüntüleme merkezine istek gönderir. Sonuçlar 5 saniye içinde simüle edilir.</p>
                    
                    <div className="flex items-end gap-4">
                      <div className="form-group flex-1">
                        <Label>Tetkik Türü</Label>
                        <select 
                          className="custom-select-input"
                          value={selectedTest}
                          onChange={(e) => setSelectedTest(e.target.value)}
                        >
                          <option value="Kan Testi 1 (Hemogram)">Kan Testi 1 (Hemogram)</option>
                          <option value="Kan Testi 2 (Biyokimya)">Kan Testi 2 (Biyokimya)</option>
                          <option value="Kan Testi 3 (Hormon)">Kan Testi 3 (Hormon)</option>
                          <option value="MR">MR (Manyetik Rezonans)</option>
                          <option value="Röntgen">Röntgen</option>
                        </select>
                      </div>
                      <Button onClick={handleTestRequest} className="w-32">Test İste</Button>
                    </div>
                  </div>

                  {/* Show Pending Tests here as a quick indicator */}
                  <div className="space-y-3">
                    {patientLabs.filter(l => l.status === "Bekleniyor...").map(lab => (
                      <div key={lab.id} className="pending-test-item">
                        <div className="pending-test-title">
                          <Activity className="w-4 h-4 mr-2 animate-pulse" />
                          <span>{lab.type} işleniyor...</span>
                        </div>
                        <Badge variant="outline" className="pending-test-badge">Bekleniyor...</Badge>
                      </div>
                    ))}
                  </div>
               </div>
            </TabsContent>

            {/* TAB 3: GEÇMİŞ SONUÇLAR */}
            <TabsContent value="sonuclar" className="modal-tabs-content-pr">
               {PastRecordsContent}
            </TabsContent>


          {/* TAB 4: SEVK İŞLEMLERİ */}
          <TabsContent value="sevk" className="flex-1 overflow-y-auto pb-6">
            {isER ? (
              <div className="space-y-6">
                <div className="referral-box">
                  <h3 className="referral-box-title">Acilden Polikliniğe Sevk</h3>
                  <p className="referral-box-desc">Bu hastanın durumu ilgili uzmanlık alanı gerektiriyorsa sevk edebilirsiniz. Hasta acil önceliği ile sevk edilen kliniğin ilk sırasına yerleşir.</p>
                  
                  <div className="space-y-4">
                    <div className="form-group">
                      <Label>Hedef Poliklinik</Label>
                      <select 
                        className="custom-select-input"
                        value={selectedClinic}
                        onChange={(e) => setSelectedClinic(e.target.value)}
                      >
                        <option value="c1">Dahiliye Polikliniği</option>
                        <option value="c2">Kardiyoloji Polikliniği</option>
                        <option value="c3">Ortopedi Polikliniği</option>
                        <option value="c4">Göz Polikliniği</option>
                        <option value="c5">KBB Polikliniği</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <Label>Hedef Hekim</Label>
                      <select 
                        className="custom-select-input"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        disabled={!selectedDoctor}
                      >
                        {doctors.filter(d => d.clinicId === selectedClinic).map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <Label>Sevk Notu (Hedef Hekim İçin)</Label>
                      <Textarea 
                        placeholder="Örn: Hastanın tansiyonu düşürülemedi, detaylı kardiyolojik tetkik rica olunur." 
                        className="min-h-[100px]"
                        value={referralNote}
                        onChange={(e) => setReferralNote(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button variant="destructive" onClick={handleReferral}>
                        <Send className="w-4 h-4 mr-2" /> Hastayı Kliniğe Sevk Et
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-labs-state">
                Bu sekme yalnızca Acil Servis (ER) doktorlarının kullanımına açıktır.
              </div>
            )}
          </TabsContent>
        </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
