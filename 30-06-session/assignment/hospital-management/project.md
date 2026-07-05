# Yedikule Hastanesi - HBYS Kullanım Kılavuzu

Hoş geldiniz. Bu kılavuz, Yedikule Hastanesi Bilgi Yönetim Sistemi'ni (HBYS) günlük işleyişinizde nasıl kullanacağınızı adım adım anlatmaktadır. Sistem, yetkinize göre (Sekreter veya Doktor) size özel ekranlar sunarak iş akışınızı hızlandırmak ve kağıt israfını önlemek için tasarlanmıştır.

---

## Sekreter Paneli Kullanımı

Hastane girişindeki hasta trafiğini, randevuları ve temel kayıt işlemlerini yönettiğiniz alandır. 

### 1. Sisteme Giriş
Size tanımlanan kurumsal e-posta adresi (örneğin: zehra.yilmaz@yedikule.com) ve şifrenizle giriş yapınız. Giriş yaptıktan sonra sistem sizi otomatik olarak Sekreterya Ana Ekranına yönlendirecektir. Sisteme başarılı şekilde giriş yaptığınızda sağ üst köşede isminizi görebilirsiniz.

### 2. Hastalar (Kayıt ve Arama İşlemleri)
Yan menüden "Hastalar" (Patients) sekmesine tıklayarak hastaneye daha önce gelmiş tüm hastaların listesine ulaşabilirsiniz.
- Yeni Hasta Kaydı: Hastaneye ilk defa gelen bir hasta için "Yeni Kayıt" butonuna tıklayın. Açılan formda hastanın TC Kimlik Numarası, Ad Soyad, Doğum Tarihi, Cinsiyet, Kan Grubu, iletişim bilgileri, Sigorta Türü (SGK, Özel vb.), kronik hastalıkları ve alerji durumlarını doldurup kaydedin. Sistem hastaya otomatik olarak benzersiz bir Hasta Numarası (Örn: HY-1001) atayacaktır.
- Hasta Arama: Listede yüzlerce hasta olabileceği için üst kısımdaki arama çubuğunu kullanarak hastaları TC Kimlik Numarası veya İsim ile hızlıca bulabilirsiniz.

### 3. Randevular ve Sıra Verme (Kabul İşlemleri)
Yan menüden "Randevular" (Appointments) sekmesine geçiş yapın. Bu ekran hastaları ilgili doktorlara yönlendirdiğiniz merkezdir.
- Poliklinik Randevusu: Önceden randevu almış veya o an muayene olmak isteyen hastayı seçin. İlgili branşı ve poliklinik doktorunu listeden işaretleyin. Tarih ve saat bilgilerini girerek randevuyu oluşturun.
- Acil Servis Girişi: Acil servisten giriş yapan hastalar için doğrudan "Acil Doktoru"nu seçerek "Acil Sırası" verebilirsiniz. Bu işlem anında ilgili acil doktorunun ekranına bildirim olarak düşer.
- Durum Takibi: Randevu tablosunda her randevunun bir "Muayene Durumu" (Bekliyor / Tamamlandı) ve "Ödeme Durumu" (Bekliyor / Ödendi) bulunur. Vezne işlemleri tamamlandığında buradan ödeme durumunu güncelleyebilirsiniz.
![Sekreter Ana Ekranı](./docs/sekreter-paneli.png)

---

## Doktor Paneli Kullanımı (Klinik ve Acil Servis)

Hastalarınızın şikayetlerini dinleyip, tanı koyduğunuz ve tedavi sürecini sistem üzerinden yönettiğiniz alandır.

### 1. Sisteme Giriş
Size özel e-posta adresiniz (örneğin: ali.veli@yedikule.com veya hakan.ozturk@yedikule.com) ve şifrenizle giriş yapınız. Sistem rolünüzü otomatik tanır: Klinik doktoruysanız kendi poliklinik muayene ekranınıza, acil doktoruysanız acil servis paneline yönlendirilirsiniz.

### 2. Bekleyen Hastalar (Kuyruk ve Çağrı Paneli)
Sol menüdeki "Bekleyen Hastalar" veya "Sıradakiler" sekmesinde o an kapınızda bekleyen hastaların listesini geliş saatlerine göre sıralı şekilde görebilirsiniz.
- Hastayı Çağır: Listeden sıradaki hastanın ismine tıkladığınızda hasta muayeneye alınmış sayılır.
- Ön Bilgi Görüntüleme: Hasta içeri alındığında, sekreterlikte girilmiş olan kronik hastalıklar, alerjiler ve yaş gibi kritik tıbbi uyarılar muayene ekranınızda otomatik olarak belirir. Bu sayede hastaya soru sormadan önce temel risk tablosunu görebilirsiniz.

### 3. Muayene ve Tanı Ekranı
Aktif muayene ekranında hastanın mevcut tıbbi durumunu kayıt altına alırsınız.
- Şikayet (Anamnez): Hastanın o anki geliş sebebini ve kendi ağzından anlattığı şikayetlerini detaylıca not alın.
- Tanı (Teşhis): Muayene bulguları ve tahliller sonucunda hastaya koyduğunuz kesin veya ön tanıyı sisteme işleyin.
- Reçete ve Tedavi: Hastanın kullanması gereken ilaçları, dozajlarını ve diğer tedavi yöntemlerini yazın. 
- İşlemi Bitir: Tüm alanları doldurduktan sonra "Kaydet" veya "Muayeneyi Tamamla" butonuna bastığınızda, hasta sizin bekleme listenizden (kuyruktan) silinir. Veriler anında hastanın kalıcı tıbbi geçmiş dosyasına aktarılır.

### 4. Geçmiş Randevular ve Tıbbi Kayıtlar
Yan menüden "Geçmiş" (History) sekmesine tıklayarak daha önce muayene ettiğiniz hastaların listesine ulaşabilirsiniz.
- Geriye Dönük İnceleme: Bir hasta tekrar geldiğinde veya epikriz raporu istendiğinde, bu sekmeden hastanın geçmişteki şikayetlerini, koyduğunuz tanıları ve yazdığınız reçeteleri detaylıca inceleyebilirsiniz.
![Doktor Muayene Ekranı](./docs/doktor-paneli.png)
![Hasta Kabul Bekleme Ekranı](./docs/doktor-kuyruk.png)

---

## Destek ve Yardım
Sisteme giriş yapamamanız, şifrenizi unutmanız veya sistemsel bir hata (örneğin butonların çalışmaması) almanız durumunda lütfen hastane Bilgi İşlem (IT) departmanı ile iletişime geçiniz. Yanlış girilen hasta kayıtları veya hatalı verilen randevular sekreterya paneli üzerinden yetkili personel tarafından düzenlenebilmektedir.
