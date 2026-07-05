# HBYS (Hastane Bilgi Yönetim Sistemi)

Bu proje, bir hastanenin temel süreçlerini dijital ortama taşıyan, sekreter ve doktor (Klinik ve Acil) rollerini barındıran kapsamlı bir Hastane Bilgi Yönetim Sistemidir (HBYS).

Not: Bu proje, klasik bir uygulamadaki yaklaşımının ötesinde; farklı kullanıcı rolleri için izole edilmiş, Role-Based Access Control (RBAC) kullanan (protected routes, farklı layoutlar) modüler bir kurumsal web uygulaması mimarisiyle tasarlanmıştır.

## Kullanılan Kütüphaneler ve Teknolojiler

Projede modern web geliştirme standartlarına uygun, performanslı ve sürdürülebilir bir altyapı oluşturmak için aşağıdaki kütüphaneler tercih edilmiştir:

- Vite & React (v18): Uygulamanın temel çatısı ve hızlı derleme aracı olarak Vite kullanılmıştır.
- Tailwind CSS: CSS-in-JS veya geleneksel CSS yerine, utility-first bir yaklaşım ile tasarımın hızlıca inşa edilmesi sağlanmıştır.
- Radix UI Primitives (@radix-ui/react-dialog, label, slot, toast vb.): Erişilebilirlik (a11y) standartlarına uygun, stillendirilmemiş (headless) temel UI bileşenlerini oluşturmak için kullanılmıştır.
- Lucide React (lucide-react): Uygulama genelinde kullanılan modern ve tutarlı ikon seti.
- Redux Toolkit (@reduxjs/toolkit) & React Redux: Uygulamanın global state (durum) yönetimi için standartlaştırılmış ve optimize edilmiş Redux mimarisi kullanılmıştır.
- Redux Persist (redux-persist): Belirli Redux verilerinin (örneğin auth) localStorage üzerinde kalıcı hale getirilerek oturumun korunmasını sağlar.
- React Router DOM (v6): Sayfa yönlendirmeleri, iç içe yönlendirmeler (nested routes) ve RBAC tabanlı korumalı rotalar için tercih edilmiştir.
- React Hook Form & Yup (@hookform/resolvers): Performanslı form yönetimi (özellikle giriş, hasta kaydı vb. işlemlerde) ve şema tabanlı doğrulama (validation) işlemleri için kullanılmıştır.
- TanStack Table (@tanstack/react-table): Karmaşık veri setlerinin (hasta listeleri, randevu tabloları vb.) sayfalandırma, filtreleme ve sıralama gibi özelliklerle performanslı bir şekilde tabloya dökülmesi için kullanılmıştır.
- Date-fns (date-fns): Tarih ve saat formatlama ile tarihsel hesaplamaların yapılması için kullanılan hafif bir tarih kütüphanesidir.
- Axios: Gelişmiş HTTP istekleri ve API entegrasyonları için kullanılmıştır.
- Class Variance Authority (class-variance-authority), Clsx, Tailwind Merge: Özellikle Radix UI bileşenlerinde dinamik Tailwind sınıflarının çatışmadan güvenli bir şekilde birleştirilmesi için tercih edilmiştir.
- UUID & Nanoid: Hastalara, randevulara veya tablolardaki satırlara benzersiz kimlik (ID) atamak için kullanılmıştır.
- JSON Server (json-server): Geliştirme aşamasında backend ve veritabanı ihtiyacını simüle eden, RESTful API davranışı sergileyen mock sunucu kütüphanesidir.

---

## Klasör Yapısı ve Hiyerarşi

Uygulamanın mimarisi, temiz kod (clean code) prensiplerine uygun ve modüler bir şekilde src dizini altında organize edilmiştir. Her modül kendi sorumluluğuna sahiptir:

- src/components/: Yeniden kullanılabilir (reusable) kullanıcı arayüzü bileşenleri.
  - ui/: Button, Dialog, Label, Toast, Table gibi Radix UI ve Tailwind altyapısına sahip temel "atomic" UI elementlerini barındırır. Bu klasör, projenin temel tasarım sistemini (design system) oluşturur.
  - ProtectedRoute.jsx: Yetkilendirilmemiş kullanıcıların sayfalara erişimini engelleyen, rollere göre (allowedRoles) yönlendirme sağlayan güvenlik katmanıdır.
  - ExaminationModal.jsx, SystemClock.jsx vb.: Uygulama geneline özel, iş mantığı barındıran kompleks bileşenlerdir.
- src/pages/: Farklı rollere hitap eden ana işlevsel ekranlar.
  - Sekreter Ekranları: SecretaryDashboard.jsx (Genel istatistikler), Patients.jsx (Hasta kayıt/listeleme), Appointments.jsx (Randevu yönetimi).
  - Doktor Ekranları (doctor/): DoctorQueue.jsx (Hasta sırası ve çağrı paneli), DoctorUpcoming.jsx (Gelecek randevular), DoctorHistory.jsx (Geçmiş hasta muayeneleri) gibi modüllerden oluşur.
- src/layouts/: Sayfaların dış çerçevesini çizen ortak şablonlar.
  - SecretaryLayout ve DoctorLayout, kendilerine ait yan menü (sidebar), üst menü (header) ve içerik alanını (Outlet) barındırır. Bu yapı, aynı arayüz bileşenlerinin tekrar tekrar yüklenmesini önler.
- src/store/: Redux yapılandırması ve veri dilimlerini (slices) içerir. store.js dosyası ana Redux mağazasını yapılandırırken, authSlice.js, patientsSlice.js, appointmentsSlice.js, labSlice.js, usersSlice.js gibi dosyalar kendi iç işleyişlerine göre ayrılmış state yönetim mantıklarını bulundurur.
- src/hooks/: Özelleştirilmiş (Custom) React hook'ları. Örneğin useDataPoller.js, uygulamadaki randevu ve hasta verilerinin sunucudan (db.json) periyodik olarak güncellenmesi ve anlık ekran değişikliklerinin sağlanması için geliştirilmiş özel bir hook'tur.
- App.jsx: Uygulamanın kök yönlendirme (routing) kurallarının, layout eşleşmelerinin ve yetkilendirme sarmalayıcılarının (Toaster, Provider vb.) tanımlandığı ana giriş noktasıdır.

### Yönlendirme (Routing) Hiyerarşisi

Sistem App.jsx üzerinde Role-Based (Rol Bazlı) bir yapıyla yönlendirilmiştir:

- /login: Tüm kullanıcıların giriş yaptığı ortak portal.
- /secretary/\*: Sadece "secretary" rolünün erişebildiği, hastaların, randevuların ve genel sistem yönetiminin yapıldığı yönlendirme katmanı.
- /doctor/\*: Sadece "er_doctor" (Acil Doktoru) ve "clinic_doctor" (Klinik Doktoru) rollerinin görebildiği, hasta sırası, muayene paneli ve tanı/reçete sistemlerinin bulunduğu yönlendirme katmanı.

---

## Redux Sistemi (State Management)

Uygulamanın global durumu (state), Redux Toolkit ile modüler "Slice" (dilim) yapısında idare edilir:

- authSlice: Oturum açan kullanıcının kimlik bilgilerini, ve rolünü tutar. Sistemdeki tüm yetkilendirmeler buraya bağlıdır.
- patientsSlice: Sisteme kayıtlı tüm hastaların ve detaylı profillerinin çekilmesi/yönetimi işlemlerini üstlenir.
- appointmentsSlice: Randevu kayıtları, acil/klinik sırası bekleme listeleri ve doktorların hasta programı gibi dinamik süreçleri yönetir.
- labSlice: Laboratuvar testleri, tahlil durumları ve sonuç ekranlarının state yönetimini sağlar.
- usersSlice: Sistemdeki çalışan (doktor/sekreter) listesini yönetir.

Redux Persist: store.js içerisinde bulunan yapılandırma ile auth (oturum) ve lab (laboratuvar) verileri tarayıcı hafızasında (localStorage) güvenli şekilde yedeklenir. Böylece sayfa yenilense veya tarayıcı kapatılıp açılsa bile kullanıcı tekrar giriş yapmak zorunda kalmaz.

---

## Veritabanı Yapısı (db.json)

Backend API simülasyonu için JSON Server kullanılmıştır. db.json dosyası, uygulamanın kullandığı tüm verilerin tutulduğu merkezdir. Temel koleksiyonlar şunlardır:

1. users (Kullanıcılar): Sistemdeki personelleri içerir. Kişilerin role (sekreter/doktor) ve doktorlarsa clinicId (hangi polikliniğe bağlı oldukları) bilgisi burada tutulur.
2. patients (Hastalar): Hastaların temel kimlik bilgileri, TC No, hasta numarası (HY-1001 vb.), adres, telefon, kronik hastalık ve alerji profilleri bulunur.
3. appointments (Randevular/Sıralar): Sürecin kalbidir. Bir hastanın hangi doktora randevusu olduğu, tarih, saat, durum (bekliyor, tamamlandi) ile birlikte muayene bitiminde eklenen sikayet (şikayet), tani (tanı) ve recete (reçete) alanlarını barındırır.
4. medical_records & lab_results: Uygulama içerisinde oluşturulan geçmiş medikal kayıtlar ve tahliller bu tablolarda arşivlenir.

Ekstra: Projedeki update-db.js Node.js script'i, veritabanına dışarıdan manuel eklenen personelin email ve şifre bilgilerini standart bir formata oturtmak için kullanılan, geliştirme sürecini hızlandıran bir yardımcı araçtır.

---

## Kurulum ve Çalıştırma

Projeyi yerel ortamınızda (localhost) çalıştırmak için aşağıdaki adımları sırasıyla uygulayınız:

### 1. NPM Paketlerinin Yüklenmesi

Terminali projenin ana dizininde açın ve bağımlılıkları indirin:

```bash
npm install
```

### 2. Uygulamanın Başlatılması

Projede verilerin sağlıklı akması için hem REST API'nin (json-server) hem de Frontend'in (Vite) ayağa kalkması gerekir. Bunun için package.json içerisine hazır bir komut eklenmiştir:

```bash
npm run dev:all (Bu komut çalışmaz ise npm run server ve npm run dev ile aktif ediniz)
```

Bu komut eşzamanlı olarak:

1. npm run server komutu ile JSON Server'ı başlatır (Veritabanı http://localhost:3000 portundan hizmet vermeye başlar).
2. npm run dev komutu ile Vite geliştirme sunucusunu çalıştırır (Arayüz http://localhost:5173 portunda açılır).

### Test İçin Örnek Kullanıcı Girişleri

Uygulamayı test etmek için db.json içerisindeki personelleri kullanabilirsiniz:

- Sekreter: zehra.yilmaz@yedikule.com / Şifre: 123456
- Klinik Doktoru (Poliklinik): ali.veli@yedikule.com / Şifre: 123456
- Acil Doktoru: hakan.ozturk@yedikule.com / Şifre: 123456
